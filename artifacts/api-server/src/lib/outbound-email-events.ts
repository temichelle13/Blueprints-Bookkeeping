import {
  db,
  outboundEmailEventsTable,
  type OutboundEmailEvent,
  type OutboundEmailEventType,
} from "@workspace/db";
import { and, asc, eq, gte, lte, sql } from "drizzle-orm";
import { EMAIL_FROM, getOwnerEmail, getResend } from "./email";
import { logger } from "./logger";

const MAX_RETRY_ATTEMPTS = 3;
const RETRY_DELAYS_MS = [60_000, 5 * 60_000, 15 * 60_000];

interface QueueContactEmailArgs {
  inquiryId: number;
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
  id: number,
  providerMessageId: string | null,
): Promise<void> {
  await db
    .update(outboundEmailEventsTable)
    .set({
      status: "sent",
      providerMessageId,
      sentAt: new Date(),
      errorPayload: null,
      updatedAt: new Date(),
    })
    .where(eq(outboundEmailEventsTable.id, id));
}

async function markEventRetryOrFailure(
  event: OutboundEmailEvent,
  errorPayload: Record<string, unknown>,
): Promise<void> {
  const attemptCount = event.attemptCount + 1;
  const transient = isTransientError(errorPayload);
  const hasRetriesRemaining = transient && attemptCount < event.maxAttempts;

  const retryDelay =
    RETRY_DELAYS_MS[Math.min(attemptCount - 1, RETRY_DELAYS_MS.length - 1)] ??
    15 * 60_000;

  await db
    .update(outboundEmailEventsTable)
    .set({
      attemptCount,
      status: hasRetriesRemaining ? "queued" : "failed",
      nextAttemptAt: hasRetriesRemaining
        ? new Date(Date.now() + retryDelay)
        : event.nextAttemptAt,
      errorPayload,
      updatedAt: new Date(),
    })
    .where(eq(outboundEmailEventsTable.id, event.id));

  if (event.eventType === "owner_notification") {
    logger.error(
      "Owner notification email delivery failure detected",
      undefined,
      {
        inquiryId: event.inquiryId,
        eventId: event.id,
        attemptCount,
        willRetry: hasRetriesRemaining,
        errorPayload,
      },
    );
  }
}

async function sendSingleEvent(event: OutboundEmailEvent): Promise<void> {
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
      (event.errorPayload as Record<string, unknown> | null) ?? {};
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

    await markEventSent(event.id, (response as any)?.data?.id ?? null);
  } catch (error) {
    await markEventRetryOrFailure(event, buildErrorPayload(error));
  }
}

async function queueEvent(
  inquiryId: number,
  eventType: OutboundEmailEventType,
  recipientEmail: string,
  emailData: {
    subject: string;
    html: string;
    replyTo?: string;
  },
): Promise<void> {
  const [event] = await db
    .insert(outboundEmailEventsTable)
    .values({
      inquiryId,
      eventType,
      recipientEmail,
      status: "queued",
      attemptCount: 0,
      maxAttempts: MAX_RETRY_ATTEMPTS,
      nextAttemptAt: new Date(),
      errorPayload: {
        subject: emailData.subject,
        html: emailData.html,
        ...(emailData.replyTo ? { replyTo: emailData.replyTo } : {}),
      },
    })
    .returning();

  if (!event) {
    logger.error("Failed to create outbound email event", undefined, {
      inquiryId,
      eventType,
      recipientEmail,
    });
    return;
  }

  await sendSingleEvent(event);
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
  const queued = await db
    .select()
    .from(outboundEmailEventsTable)
    .where(
      and(
        eq(outboundEmailEventsTable.status, "queued"),
        lte(outboundEmailEventsTable.nextAttemptAt, new Date()),
      ),
    )
    .orderBy(asc(outboundEmailEventsTable.nextAttemptAt))
    .limit(limit);

  for (const event of queued) {
    await sendSingleEvent(event);
  }

  return queued.length;
}

export async function getOutboundEmailAdminCounts(): Promise<{
  unnotifiedInquiries: number;
  emailFailuresLast24h: number;
}> {
  const [unnotified] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(sql`contact_inquiries ci`).where(sql`not exists (
      select 1 from outbound_email_events oee
      where oee.inquiry_id = ci.id
        and oee.event_type = 'owner_notification'
        and oee.status = 'sent'
    )`);

  const [failures] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(outboundEmailEventsTable)
    .where(
      and(
        eq(outboundEmailEventsTable.status, "failed"),
        gte(
          outboundEmailEventsTable.updatedAt,
          new Date(Date.now() - 24 * 60 * 60 * 1000),
        ),
      ),
    );

  return {
    unnotifiedInquiries: unnotified?.count ?? 0,
    emailFailuresLast24h: failures?.count ?? 0,
  };
}
