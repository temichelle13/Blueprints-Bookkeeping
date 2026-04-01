import { Router, type IRouter } from "express";
import Stripe from "stripe";
import {
  db,
  onboardingSubmissionsTable,
  contactInquiriesTable,
  subscriptionsTable,
} from "@workspace/db";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import * as contractService from "../lib/contract-service";
import { isEmailSuppressed } from "../lib/email-suppression";
import { getRequestIp, getUserAgent } from "../lib/request-helpers";

const router: IRouter = Router();

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const SITE_URL =
  process.env["SITE_URL"] || "https://blueprintsandbookkeeping.com";
const TURNSTILE_SECRET = process.env["TURNSTILE_SECRET_KEY"];

function getStripe(): Stripe | null {
  const key = process.env["STRIPE_SECRET_KEY"];
  if (!key) return null;
  return new Stripe(key);
}

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

const onboardingLimiter = createSubmissionRateLimiter({
  routeId: "onboarding",
  windowMs: 30 * 60 * 1000,
  max: 4,
});

router.post(
  "/onboarding",
  onboardingLimiter,
  honeypotProtection("onboarding"),
  withSubmissionMonitoring("onboarding"),
  turnstileProtection({
    routeId: "onboarding",
    required: false,
    action: "onboarding_submit",
    ...(TURNSTILE_SECRET ? { secret: TURNSTILE_SECRET } : {}),
  }),
  async (req, res): Promise<void> => {
    if (
      !enforceMaxLength("onboarding", req, res, [
        { key: "clientName", max: 120, required: true },
        { key: "clientEmail", max: 320, required: true },
        { key: "businessName", max: 160, required: true },
        { key: "ownerName", max: 120, required: true },
        { key: "phone", max: 32 },
        { key: "einBusinessType", max: 120 },
        { key: "currentBookkeepingSoftware", max: 120 },
        { key: "notes", max: 3000 },
        { key: "plan", max: 80 },
        { key: "stripeSessionId", max: 255, required: true },
        { key: "businessState", max: 2, required: true },
      ])
    ) {
      return;
    }

    const {
      clientName,
      clientEmail,
      businessName,
      ownerName,
      phone,
      einBusinessType,
      currentBookkeepingSoftware,
      notes,
      plan,
      stripeSessionId,
      businessState,
    } = req.body as {
      clientName?: string;
      clientEmail?: string;
      businessName?: string;
      ownerName?: string;
      phone?: string;
      einBusinessType?: string;
      currentBookkeepingSoftware?: string;
      notes?: string;
      plan?: string;
      stripeSessionId?: string;
      businessState?: string;
    };

    if (
      !clientName ||
      !clientEmail ||
      !businessName ||
      !ownerName ||
      !businessState
    ) {
      res.status(400).json({
        error:
          "Name, email, business name, owner name, and business state are required.",
      });
      return;
    }

    const normalizedClientEmail = validateEmailStrict(clientEmail);
    if (!normalizedClientEmail) {
      res.status(400).json({ error: "Please provide a valid email address." });
      return;
    }

    const normalizedState = businessState.trim().toUpperCase();
    const VALID_STATE_CODES = [
      "AL",
      "AK",
      "AZ",
      "AR",
      "CA",
      "CO",
      "CT",
      "DE",
      "DC",
      "FL",
      "GA",
      "HI",
      "ID",
      "IL",
      "IN",
      "IA",
      "KS",
      "KY",
      "LA",
      "ME",
      "MD",
      "MA",
      "MI",
      "MN",
      "MS",
      "MO",
      "MT",
      "NE",
      "NV",
      "NH",
      "NJ",
      "NM",
      "NY",
      "NC",
      "ND",
      "OH",
      "OK",
      "OR",
      "PA",
      "RI",
      "SC",
      "SD",
      "TN",
      "TX",
      "UT",
      "VT",
      "VA",
      "WA",
      "WV",
      "WI",
      "WY",
    ];

    if (!VALID_STATE_CODES.includes(normalizedState)) {
      res.status(400).json({
        error:
          "Invalid business state. Please provide a valid two-letter U.S. state code.",
      });
      return;
    }

    if (!stripeSessionId) {
      res.status(400).json({
        error:
          "A valid checkout session is required. Please complete payment first.",
      });
      return;
    }

    let subscriptionId: number | null = null;
    const stripe = getStripe();

    const [inquiry] = await db
      .insert(contactInquiriesTable)
      .values({
        formType: "self_service_onboarding",
        name: clientName,
        email: clientEmail,
        phone: phone ?? null,
        businessName: businessName,
        servicesInterested: plan ? [plan] : null,
        message: notes ?? null,
        consentTextVersion: "self-service-onboarding-consent-2026-03-31.1",
        consentSourcePage: "/onboarding",
        requestIp: req.ip ?? null,
        userAgent: (req.headers["user-agent"] as string | undefined) ?? null,
        consentTimestamp: new Date(),
        requestIp: getRequestIp(req),
        userAgent: getUserAgent(req),
        consentTimestamp: new Date(),
      })
      .returning();

    try {
      const session = await stripe.checkout.sessions.retrieve(stripeSessionId);
      if (session.payment_status !== "paid") {
        res.status(400).json({
          error:
            "Payment has not been completed. Please complete checkout first.",
        });
        return;
      }
      const sessionEmail = session.customer_details?.email;
      if (
        sessionEmail &&
        sessionEmail.toLowerCase() !== normalizedClientEmail
      ) {
        res.status(400).json({
          error:
            "Email does not match the checkout session. Please use the email you checked out with.",
        });
        return;
      }
      const stripeSubId =
        typeof session.subscription === "string" ? session.subscription : "";
      if (stripeSubId) {
        const subs = await db
          .select()
          .from(subscriptionsTable)
          .where(eq(subscriptionsTable.stripeSubscriptionId, stripeSubId))
          .limit(1);
        if (subs.length > 0) {
          subscriptionId = subs[0]!.id;
        }
      }
    } catch (err) {
      console.error("Stripe session verification failed:", err);
      res.status(400).json({
        error: "Could not verify payment session. Please contact support.",
      });
      return;
    }

    try {
      const [submission] = await db
        .insert(onboardingSubmissionsTable)
        .values({
          clientName,
          clientEmail: normalizedClientEmail,
          businessName,
          ownerName,
          phone: phone ?? null,
          einBusinessType: einBusinessType ?? null,
          currentBookkeepingSoftware: currentBookkeepingSoftware ?? null,
          notes: notes ?? null,
          plan: plan ?? null,
          businessState: normalizedState,
          stripeSessionId: stripeSessionId ?? null,
          subscriptionId,
        })
        .returning();

      const [inquiry] = await db
        .insert(contactInquiriesTable)
        .values({
          formType: "self_service_onboarding",
          name: clientName,
          email: normalizedClientEmail,
          phone: phone ?? null,
          businessName,
          servicesInterested: plan ? [plan] : null,
          message: notes ?? null,
        })
        .returning();

      contractService
        .processFormSubmission({
          formType: "self_service_onboarding",
          name: clientName,
          email: normalizedClientEmail,
          servicesInterested: ["bookkeeping"],
          contactInquiryId: inquiry!.id,
        })
        .catch((err) => {
          console.error("Contract automation error (non-blocking):", err);
        });

      const resend = getResend();
      if (resend) {
        const suppressed = await isEmailSuppressed(normalizedClientEmail);
        const emailPromises: Promise<unknown>[] = [
          resend.emails.send({
            from: FROM_ADDRESS,
            to: OWNER_EMAIL,
            replyTo: normalizedClientEmail,
            subject: `Onboarding Form Submitted: ${clientName} — ${businessName}`,
            html: buildAdminOnboardingEmail(
              clientName,
              normalizedClientEmail,
              businessName,
              ownerName,
              phone,
              einBusinessType,
              currentBookkeepingSoftware,
              notes,
              plan,
            ),
          }),
        ];

        if (suppressed) {
          console.warn(
            "[Onboarding] Skipping client confirmation email — address is suppressed:",
            normalizedClientEmail,
          );
        } else {
          emailPromises.push(
            resend.emails.send({
              from: FROM_ADDRESS,
              to: normalizedClientEmail,
              subject: "Onboarding Received — Blueprints & Bookkeeping",
              html: buildClientOnboardingConfirmation(clientName, plan),
            }),
          );
        }

        await Promise.allSettled(emailPromises);
      }

      res.status(201).json({
        success: true,
        message:
          "Onboarding form submitted successfully. Contracts will be sent shortly.",
        id: submission?.id,
      });
    } catch (err) {
      console.error("Onboarding submission error:", err);
      res.status(500).json({ error: "Failed to save onboarding data." });
    }
  },
);

function buildAdminOnboardingEmail(
  name: string,
  email: string,
  businessName: string,
  ownerName: string,
  phone?: string,
  ein?: string,
  software?: string,
  notes?: string,
  plan?: string,
): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">New Onboarding Submission</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <table style="width:100%;border-collapse:collapse;">
        <tr><td style="padding:8px 0;color:#666;font-size:14px;width:160px;">Contact Name</td><td style="padding:8px 0;font-weight:600;">${name}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${email}" style="color:#6366f1;">${email}</a></td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Business Name</td><td style="padding:8px 0;">${businessName}</td></tr>
        <tr><td style="padding:8px 0;color:#666;font-size:14px;">Owner Name</td><td style="padding:8px 0;">${ownerName}</td></tr>
        ${phone ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone</td><td style="padding:8px 0;">${phone}</td></tr>` : ""}
        ${ein ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">EIN / Business Type</td><td style="padding:8px 0;">${ein}</td></tr>` : ""}
        ${software ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Bookkeeping Software</td><td style="padding:8px 0;">${software}</td></tr>` : ""}
        ${plan ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Plan</td><td style="padding:8px 0;font-weight:600;">${plan}</td></tr>` : ""}
      </table>
      ${
        notes
          ? `<div style="margin-top:20px;padding:16px;background:white;border-radius:6px;border-left:3px solid #6366f1;">
        <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Notes</p>
        <p style="margin:0;line-height:1.6;">${notes}</p>
      </div>`
          : ""
      }
      <p style="margin-top:20px;font-size:13px;color:#999;">Engagement Letter and NDA have been triggered via Adobe Sign.</p>
    </div>
  </div>`;
}

function buildClientOnboardingConfirmation(
  name: string,
  plan?: string,
): string {
  return `<div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
    <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
      <h1 style="color:white;margin:0;font-size:20px;">Onboarding Received!</h1>
    </div>
    <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
      <p>Hi ${name},</p>
      <p>Thank you for completing your onboarding form${plan ? ` for the <strong>${plan}</strong> plan` : ""}. Here's what happens next:</p>
      <ol style="line-height:2;">
        <li>You'll receive your <strong>Engagement Letter</strong> and <strong>NDA</strong> via Adobe Sign — please review and sign promptly</li>
        <li>Once signed, we'll begin setting up your accounts</li>
        <li>If we need records from you, we'll send secure file-sharing instructions separately</li>
      </ol>
      <p>Need anything? Reply to this email or call <strong>(541) 319-8654</strong>.</p>
      <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC</span></p>
    </div>
  </div>`;
}

export default router;
