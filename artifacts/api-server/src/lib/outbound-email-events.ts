import {
  OutboundEmailEventModel,
  ContactInquiryModel,
  Types,
  type OutboundEmailEventType,
} from "@workspace/db";
import { EMAIL_FROM, getOwnerEmail, getResend } from "./email";
import { logger } from "./logger";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 15 * 60_000];

interface QueueContactEmailArgs {
  inquiryId: string;
  senderEmail: string;
  senderSuppressed: boolean;
  ownerHtml: string;
  ownerSubject: string;
  confirmationHtml: string;
}

function buildErrorPayload(error: unknown): Record<string, unknown> {
  if (error instanceof Error) {
    return {
      name: error.name,
      message: error.message,
      stack: error.stack,
    };
  }

  return { raw: String(error) };
}

function isTransientError(errorPayload: Record<string, unknown>): boolean {
  const statusCode =
    typeof errorPayload.statusCode === "number"
      ? errorPayload.statusCode
      : null;
  if (
    statusCode &&
    [408, 409, 425, 429, 500, 502, 503, 504].includes(statusCode)
  ) {
    return true;
  }

  const message =
    typeof errorPayload.message === "string"
      ? errorPayload.message.toLowerCase()
      : "";
  return (
    message.includes("timeout") ||
    message.includes("temporar") ||
    message.includes("rate limit") ||
    message.includes("network") ||
    message.includes("econn")
  );
}

async function markEventSent(
  id: string,
  providerMessageId: string | null,
): Promise<void> {
  await OutboundEmailEventModel.findByIdAndUpdate(id, {
    status: "sent",
    providerMessageId,
    sentAt: new Date(),
    errorPayload: null,
    updatedAt: new Date(),
  });
}

async function markEventRetryOrFailure(
  event: { _id: Types.ObjectId; attemptCount: number; maxAttempts: number; nextAttemptAt: Date; eventType: string; inquiryId: Types.ObjectId },
  errorPayload: Record<string, unknown>,
): Promise<void> {
  const attemptCount = event.attemptCount + 1;
  const transient = isTransientError(errorPayload);
  const hasRetriesRemaining = transient && attemptCount < event.maxAttempts;

  const retryDelay =
    RETRY_DELAYS_MS[Math.min(attemptCount - 1, RETRY_DELAYS_MS.length - 1)] ??
    15 * 60_000;

  await OutboundEmailEventModel.findByIdAndUpdate(event._id, {
    attemptCount,
    status: hasRetriesRemaining ? "queued" : "failed",
    nextAttemptAt: hasRetriesRemaining
      ? new Date(Date.now() + retryDelay)
      : event.nextAttemptAt,
    errorPayload,
    updatedAt: new Date(),
  });

  if (event.eventType === "owner_notification") {
    logger.error(
      "Owner notification email delivery failure detected",
      undefined,
      {
        inquiryId: event.inquiryId,
        eventId: event._id,
        attemptCount,
        willRetry: hasRetriesRemaining,
        errorPayload,
      },
    );
  }
}

async function sendSingleEvent(event: ReturnType<typeof OutboundEmailEventModel.prototype.toObject> & { _id: Types.ObjectId }): Promise<void> {
  const resend = getResend();

  if (!resend) {
    await markEventRetryOrFailure(event, {
      message: "RESEND_API_KEY not configured",
      code: "provider_unavailable",
    });
    return;
  }

  try {
    const payload =
      (event.emailPayload as Record<string, unknown> | null) ?? {};
    const subject = typeof payload.subject === "string" ? payload.subject : "";
    const html = typeof payload.html === "string" ? payload.html : "";
    const replyTo =
      typeof payload.replyTo === "string" && payload.replyTo
        ? payload.replyTo
        : undefined;

    const response = await resend.emails.send({
      from: EMAIL_FROM.default,
      to: event.recipientEmail,
      ...(replyTo ? { replyTo } : {}),
      subject,
      html,
    });

    if ((response as any)?.error) {
      const providerError = (response as any).error;
      await markEventRetryOrFailure(event, {
        message: providerError.message ?? "Email provider reported an error",
        name: providerError.name,
        statusCode: providerError.statusCode,
      });
      return;
    }

    await markEventSent(event._id.toString(), (response as any)?.data?.id ?? null);
  } catch (error) {
    await markEventRetryOrFailure(event, buildErrorPayload(error));
  }
}

async function queueEvent(
  inquiryId: string,
  eventType: OutboundEmailEventType,
  recipientEmail: string,
  emailData: {
    subject: string;
    html: string;
    replyTo?: string;
  },
): Promise<void> {
  const event = await OutboundEmailEventModel.create({
    inquiryId: new Types.ObjectId(inquiryId),
    eventType,
    recipientEmail,
    status: "queued",
    attemptCount: 0,
    maxAttempts: MAX_RETRY_ATTEMPTS,
    nextAttemptAt: new Date(),
    emailPayload: {
      subject: emailData.subject,
      html: emailData.html,
      ...(emailData.replyTo ? { replyTo: emailData.replyTo } : {}),
    },
  });

  if (!event) {
    logger.error("Failed to create outbound email event", undefined, {
      inquiryId,
      eventType,
      recipientEmail,
    });
  }
}

export async function queueContactInquiryEmails(
  args: QueueContactEmailArgs,
): Promise<void> {
  await queueEvent(args.inquiryId, "owner_notification", getOwnerEmail(), {
    subject: args.ownerSubject,
    html: args.ownerHtml,
    replyTo: args.senderEmail,
  });

  if (!args.senderSuppressed) {
    await queueEvent(args.inquiryId, "client_confirmation", args.senderEmail, {
      subject: "We received your message — Blueprints & Bookkeeping",
      html: args.confirmationHtml,
    });
  } else {
    logger.warn("Skipping confirmation email for suppressed address", {
      email: args.senderEmail,
      inquiryId: args.inquiryId,
    });
  }
}

export async function processPendingOutboundEmailEvents(
  limit = 25,
): Promise<number> {
  const now = new Date();
  const processed: number[] = [];

  // Process events one at a time using atomic findOneAndUpdate to prevent
  // concurrent workers from processing the same event.
  for (let i = 0; i < limit; i++) {
    const event = await OutboundEmailEventModel.findOneAndUpdate(
      { status: "queued", nextAttemptAt: { $lte: now } },
      { $set: { status: "sending", updatedAt: now } },
      { new: true, sort: { nextAttemptAt: 1 } },
    ).lean();

    if (!event) break;
    await sendSingleEvent(event as any);
    processed.push(1);
  }

  return processed.length;
}

export async function getOutboundEmailAdminCounts(): Promise<{
  unnotifiedInquiries: number;
  emailFailuresLast24h: number;
}> {
  const notifiedIds = await OutboundEmailEventModel.distinct("inquiryId", {
    eventType: "owner_notification",
    status: "sent",
  });

  const unnotifiedCount = await ContactInquiryModel.countDocuments({
    _id: { $nin: notifiedIds },
  });

  const failureCount = await OutboundEmailEventModel.countDocuments({
    status: "failed",
    updatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
  });

  return {
    unnotifiedInquiries: unnotifiedCount,
    emailFailuresLast24h: failureCount,
  };
}
