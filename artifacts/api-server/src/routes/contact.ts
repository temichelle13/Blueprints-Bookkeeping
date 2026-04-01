import { Router, type IRouter } from "express";
import { db, contactInquiriesTable } from "@workspace/db";
import { SubmitContactFormBody } from "@workspace/api-zod";
import { tryGetResend, tryGetOwnerEmail, EMAIL_FROM } from "../lib/email";
import { logger } from "../lib/logger";
import {
  honeypotProtection,
  createSubmissionRateLimiter,
  enforceMaxLength,
  validateEmailStrict,
  withSubmissionMonitoring,
} from "../middleware/public-submissions";
import { contactLimiter } from "./contact-rate-limit";

const router: IRouter = Router();
const CONSENT_FALLBACK_VERSION = "v2026-03-31";

type ContactConsent = {
  email: boolean;
  sms: boolean;
  phone: boolean;
  source: string;
  legalTextVersion: string;
};

function normalizeConsent(data: {
  consent?: ContactConsent | undefined;
  smsConsent: boolean;
  formType: "quick" | "detailed";
}): ContactConsent {
  if (data.consent) {
    return data.consent;
  }

  return {
    email: true,
    sms: data.smsConsent,
    phone: data.smsConsent,
    source: `legacy_${data.formType}_form`,
    legalTextVersion: CONSENT_FALLBACK_VERSION,
  };
}

router.post("/contact", contactLimiter, async (req, res): Promise<void> => {
  if (req.body?.website) {
    res.status(201).json({
      success: true,
      message:
        "Thank you for your inquiry! We will be in touch within 48 hours.",
      id: 0,
    });

const router: IRouter = Router();

const contactSubmissionLimiter = createSubmissionRateLimiter({
  routeId: "contact",
  windowMs: 15 * 60 * 1000,
  max: 8,
});

router.post(
  "/contact",
  contactSubmissionLimiter,
  honeypotProtection("contact"),
  withSubmissionMonitoring("contact"),
  async (req, res): Promise<void> => {
    if (
      !enforceMaxLength("contact", req, res, [
        { key: "name", max: 120, required: true },
        { key: "email", max: 320, required: true },
        { key: "phone", max: 32 },
        { key: "businessName", max: 160 },
        { key: "industry", max: 120 },
        { key: "monthlyRevenueRange", max: 64 },
        { key: "preferredContactMethod", max: 64 },
        { key: "message", max: 2000 },
        { key: "biggestChallenge", max: 2000 },
      ])
    ) {
      return;
    }

    const parsed = SubmitContactFormBody.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.message });
      return;
    }

    const normalizedEmail = validateEmailStrict(parsed.data.email);
    if (!normalizedEmail) {
      res.status(400).json({ error: "Please provide a valid email address." });
      return;
    }

    const data = {
      ...parsed.data,
      email: normalizedEmail,
    };

    const [inquiry] = await db
      .insert(contactInquiriesTable)
      .values({
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
      })
      .returning();

    if (!inquiry) {
      throw new Error("Failed to insert contact inquiry record");
    }

    const suppressed = await isEmailSuppressed(data.email);

    const resend = getResend();
    if (resend) {
      const servicesLabel =
        Array.isArray(data.servicesInterested) && data.servicesInterested.length
          ? data.servicesInterested.join(", ")
          : "Not specified";

      const notifyHtml = `
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

  const data = parsed.data;
  const normalizedConsent = normalizeConsent(data);
  const consentCapturedAt = new Date();

  const [inquiry] = await db
    .insert(contactInquiriesTable)
    .values({
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
      emailConsent: normalizedConsent.email,
      emailConsentCapturedAt: normalizedConsent.email
        ? consentCapturedAt
        : null,
      emailConsentSource: normalizedConsent.email
        ? normalizedConsent.source
        : null,
      smsConsent: normalizedConsent.sms,
      smsConsentCapturedAt: normalizedConsent.sms ? consentCapturedAt : null,
      smsConsentSource: normalizedConsent.sms ? normalizedConsent.source : null,
      phoneConsent: normalizedConsent.phone,
      phoneConsentCapturedAt: normalizedConsent.phone
        ? consentCapturedAt
        : null,
      phoneConsentSource: normalizedConsent.phone
        ? normalizedConsent.source
        : null,
      consentLegalTextVersion: normalizedConsent.legalTextVersion,
    })
    .returning();

  if (!inquiry) {
    throw new Error("Failed to insert contact inquiry record");
  }

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
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email Consent</td><td style="padding:8px 0;font-weight:600;color:${normalizedConsent.email ? "#10B981" : "#EF4444"};">${normalizedConsent.email ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">SMS Consent</td><td style="padding:8px 0;font-weight:600;color:${normalizedConsent.sms ? "#10B981" : "#EF4444"};">${normalizedConsent.sms ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone Consent</td><td style="padding:8px 0;font-weight:600;color:${normalizedConsent.phone ? "#10B981" : "#EF4444"};">${normalizedConsent.phone ? "Yes" : "No"}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">Consent Source</td><td style="padding:8px 0;">${normalizedConsent.source}</td></tr>
            <tr><td style="padding:8px 0;color:#666;font-size:14px;">Consent Legal Text</td><td style="padding:8px 0;">${normalizedConsent.legalTextVersion}</td></tr>
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
          to: getOwnerEmail(),
          replyTo: data.email,
          subject: `New Inquiry: ${data.name}${data.businessName ? ` — ${data.businessName}` : ""}`,
          html: notifyHtml,
        }),
      ];

      if (suppressed) {
        logger.warn("Skipping confirmation email for suppressed address", {
          email: data.email,
        });
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

      await Promise.allSettled(emailPromises);
    }
  });
}

    contractService
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
  },
);

export default router;
