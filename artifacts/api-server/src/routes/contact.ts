import { Router, type IRouter, type Request, type Response } from "express";
import rateLimit from "express-rate-limit";
import { SubmitContactFormBody } from "@workspace/api-zod";
import { tryGetResend, tryGetOwnerEmail, EMAIL_FROM } from "../lib/email";
import { logger } from "../lib/logger";
import type { Resend } from "resend";

const router: IRouter = Router();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    error: "Too many submissions from this IP. Please try again later.",
  },
});

type ContactEmailDeps = {
  tryGetResend: () => Resend | null;
  tryGetOwnerEmail: () => string | null;
};

type ContactHandlerDeps = ContactEmailDeps & {
  insertInquiry: (values: Record<string, unknown>) => Promise<{
    id: number;
  }>;
  isEmailSuppressed: (email: string) => Promise<boolean>;
  logWarn: (message: string, context?: Record<string, unknown>) => void;
  logError: (
    message: string,
    error?: Error,
    context?: Record<string, unknown>,
  ) => void;
  processFormSubmission: (data: {
    formType: string;
    name: string;
    email: string;
    servicesInterested?: string[] | null;
    contactInquiryId: number;
  }) => Promise<unknown>;
};

function createDefaultDeps(): ContactHandlerDeps {
  return {
    tryGetResend,
    tryGetOwnerEmail,
    insertInquiry: async (values) => {
      const { db, contactInquiriesTable } = await import("@workspace/db");
      const [inquiry] = await db
        .insert(contactInquiriesTable)
        .values(values)
        .returning();
      if (!inquiry) {
        throw new Error("Failed to insert contact inquiry record");
      }
      return { id: inquiry.id };
    },
    isEmailSuppressed: async (email) => {
      const suppression = await import("../lib/email-suppression");
      return suppression.isEmailSuppressed(email);
    },
    logWarn: (message, context) => logger.warn(message, context),
    logError: (message, error, context) =>
      logger.error(message, error, context),
    processFormSubmission: async (data) => {
      const contractService = await import("../lib/contract-service");
      return contractService.processFormSubmission(data);
    },
  };
}

async function sendInquiryEmails(
  deps: ContactHandlerDeps,
  inquiryId: number,
  data: {
    name: string;
    email: string;
    phone?: string | null;
    businessName?: string | null;
    industry?: string | null;
    servicesInterested?: string[] | null;
    monthlyRevenueRange?: string | null;
    preferredContactMethod?: string | null;
    smsConsent: boolean;
    biggestChallenge?: string | null;
    message?: string | null;
  },
): Promise<void> {
  const resend = deps.tryGetResend();
  if (!resend) {
    deps.logWarn(
      "Skipping contact inquiry emails because provider is unavailable",
      {
        inquiryId,
        reason: "resend_unavailable",
      },
    );
    return;
  }

  const ownerEmail = deps.tryGetOwnerEmail();
  if (!ownerEmail) {
    deps.logWarn(
      "Skipping contact inquiry emails because owner email is unavailable",
      {
        inquiryId,
        reason: "owner_email_unavailable",
      },
    );
    return;
  }

  const suppressed = await deps.isEmailSuppressed(data.email);

  const servicesLabel =
    Array.isArray(data.servicesInterested) && data.servicesInterested.length
      ? data.servicesInterested.join(", ")
      : "Not specified";

  const notifyHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">New Inquiry — Blueprints & Bookkeeping</h1>
        </div>
        <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#666;font-size:14px;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${data.name}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${data.email}" style="color:#6366f1;">${data.email}</a></td></tr>
            ${data.phone ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone</td><td style="padding:8px 0;">${data.phone}</td></tr>` : ""}
            ${data.businessName ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Business</td><td style="padding:8px 0;">${data.businessName}</td></tr>` : ""}
            ${data.industry ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Industry</td><td style="padding:8px 0;">${data.industry}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">Services</td><td style="padding:8px 0;">${servicesLabel}</td></tr>
            ${data.monthlyRevenueRange ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Revenue Range</td><td style="padding:8px 0;">${data.monthlyRevenueRange}</td></tr>` : ""}
            ${data.preferredContactMethod ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Prefers</td><td style="padding:8px 0;">${data.preferredContactMethod}</td></tr>` : ""}
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">SMS/Call Consent</td><td style="padding:8px 0;font-weight:600;color:${data.smsConsent ? "#10B981" : "#EF4444"};">${data.smsConsent ? "Yes" : "No"}</td></tr>
          </table>
          ${
            data.biggestChallenge || data.message
              ? `
          <div style="margin-top:20px;padding:16px;background:white;border-radius:6px;border-left:3px solid #6366f1;">
            <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
            <p style="margin:0;line-height:1.6;">${data.biggestChallenge || data.message}</p>
          </div>`
              : ""
          }
          <p style="margin-top:24px;font-size:13px;color:#999;">Reply directly to this email to respond to ${data.name}.</p>
        </div>
      </div>`;

  const confirmHtml = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">We've got your message.</h1>
        </div>
        <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
          <p>Hi ${data.name},</p>
          <p>Thanks for reaching out to Blueprints & Bookkeeping. Your inquiry has been received and I'll be in touch within <strong>one business day</strong> — usually sooner.</p>
          <p>In the meantime:</p>
          <ul style="line-height:1.8;">
            <li>Browse our <a href="https://blueprintsandbookkeeping.com/faq" style="color:#6366f1;">FAQ</a> for quick answers</li>
            <li>Book a <a href="https://blueprintsandbookkeeping.com/schedule" style="color:#6366f1;">free discovery call</a> directly on my calendar</li>
          </ul>
          <p>Talk soon,</p>
          <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC</span></p>
          <hr style="border:none;border-top:1px solid #e2e5f0;margin:24px 0;">
          <p style="font-size:12px;color:#999;">This is an automated confirmation. Tea will follow up from her personal inbox.</p>
        </div>
      </div>`;

  const emailPromises: Promise<unknown>[] = [
    resend.emails.send({
      from: EMAIL_FROM.default,
      to: ownerEmail,
      replyTo: data.email,
      subject: `New Inquiry: ${data.name}${data.businessName ? ` — ${data.businessName}` : ""}`,
      html: notifyHtml,
    }),
  ];

  if (suppressed) {
    deps.logWarn(
      "Skipping confirmation email for suppressed contact inquiry email",
      {
        inquiryId,
        email: data.email,
        reason: "email_suppressed",
      },
    );
  } else {
    emailPromises.push(
      resend.emails.send({
        from: EMAIL_FROM.default,
        to: data.email,
        subject: "We received your message — Blueprints & Bookkeeping",
        html: confirmHtml,
      }),
    );
  }

  const settled = await Promise.allSettled(emailPromises);
  settled.forEach((result, index) => {
    if (result.status === "rejected") {
      deps.logError("Contact inquiry email send failed", undefined, {
        inquiryId,
        emailType: index === 0 ? "owner_notification" : "client_confirmation",
        reason:
          result.reason instanceof Error
            ? result.reason.message
            : String(result.reason),
      });
    }
  });
}

export function createContactHandler(
  deps: ContactHandlerDeps = createDefaultDeps(),
) {
  return async (req: Request, res: Response): Promise<void> => {
    if (req.body?.website) {
      res.status(201).json({
        success: true,
        message:
          "Thank you for your inquiry! We will be in touch within 48 hours.",
        id: 0,
      });
      return;
    }

    const parsed = SubmitContactFormBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const data = parsed.data;

    const inquiry = await deps.insertInquiry({
      formType: data.formType,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message ?? null,
      businessName: data.businessName ?? null,
      industry: data.industry ?? null,
      servicesInterested: data.servicesInterested ?? null,
      monthlyRevenueRange: data.monthlyRevenueRange ?? null,
      biggestChallenge: data.biggestChallenge ?? null,
      preferredContactMethod: data.preferredContactMethod ?? null,
      smsConsent: data.smsConsent,
    });

    await sendInquiryEmails(deps, inquiry.id, data);

    deps
      .processFormSubmission({
        formType: data.formType,
        name: data.name,
        email: data.email,
        servicesInterested: data.servicesInterested ?? null,
        contactInquiryId: inquiry.id,
      })
      .catch((err) => {
        console.error("Contract automation error (non-blocking):", err);
      });

    res.status(201).json({
      success: true,
      message:
        "Thank you for your inquiry! We will be in touch within 48 hours.",
      id: inquiry.id,
    });
  };
}

router.post("/contact", contactLimiter, createContactHandler());

export default router;
