import { Router, type IRouter } from "express";
import rateLimit from "express-rate-limit";
import { db, contactInquiriesTable } from "@workspace/db";
import { SubmitContactFormBody } from "@workspace/api-zod";
import * as contractService from "../lib/contract-service";
import { isEmailSuppressed } from "../lib/email-suppression";
import { queueContactInquiryEmails } from "../lib/outbound-email-events";

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

router.post("/contact", contactLimiter, async (req, res): Promise<void> => {
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

  await queueContactInquiryEmails({
    inquiryId: inquiry.id,
    senderEmail: data.email,
    senderSuppressed: suppressed,
    ownerHtml: notifyHtml,
    ownerSubject: `New Inquiry: ${data.name}${data.businessName ? ` — ${data.businessName}` : ""}`,
    confirmationHtml: confirmHtml,
  });

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
    message: "Thank you for your inquiry! We will be in touch within 48 hours.",
    id: inquiry.id,
  });
});

export default router;
