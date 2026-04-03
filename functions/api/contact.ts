/**
 * Cloudflare Pages Function: POST /api/contact
 *
 * Handles contact form submissions. Sends a notification email to the owner
 * and an auto-reply to the submitter via Resend.
 *
 * Required Cloudflare Pages env vars:
 *   RESEND_API_KEY  — Resend API key
 *   OWNER_EMAIL     — override notification recipient (default: tea@blueprintsandbookkeeping.com)
 *   SITE_URL        — canonical site URL (default: https://blueprintsandbookkeeping.com)
 */

export interface Env {
  RESEND_API_KEY?: string;
  OWNER_EMAIL?: string;
  SITE_URL?: string;
}

const OWNER_EMAIL_DEFAULT = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

const ALLOWED_CONSENT_TEXT_VERSIONS = new Set([
  "contact-consent-2026-03-31.1",
  "self-service-onboarding-consent-2026-03-31.1",
  "legacy-unknown",
]);

const ALLOWED_CONSENT_SOURCE_PAGES = new Set(["/contact", "/onboarding"]);

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 320;
}

function normalizeEmail(email: string): string | null {
  const trimmed = email.trim().toLowerCase();
  return isValidEmail(trimmed) ? trimmed : null;
}

async function sendEmail(
  apiKey: string,
  payload: {
    from: string;
    to: string;
    replyTo?: string;
    subject: string;
    html: string;
    headers?: Record<string, string>;
  },
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const text = await res.text();
    console.error("[Resend] Email send failed:", res.status, text);
  }
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;

  // CORS preflight is handled by Cloudflare automatically for same-origin Pages requests.
  // Add an explicit allow header so API calls from a custom domain work.
  const headers = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers,
    });
  }

  // Basic type guard — full validation below
  if (typeof body !== "object" || body === null) {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers,
    });
  }

  const data = body as Record<string, unknown>;

  // Honeypot: reject bots that fill the website field
  if (data.website && typeof data.website === "string" && data.website.trim()) {
    return new Response(
      JSON.stringify({ success: true, message: "Thank you for your inquiry!" }),
      { status: 201, headers },
    );
  }

  // Required fields
  const name =
    typeof data.name === "string" ? data.name.trim().slice(0, 120) : "";
  const rawEmail =
    typeof data.email === "string" ? data.email.trim().slice(0, 320) : "";
  const formType =
    data.formType === "quick" || data.formType === "detailed"
      ? data.formType
      : null;

  if (!name || !rawEmail || !formType) {
    return new Response(
      JSON.stringify({ error: "name, email, and formType are required." }),
      { status: 400, headers },
    );
  }

  const email = normalizeEmail(rawEmail);
  if (!email) {
    return new Response(
      JSON.stringify({ error: "Please provide a valid email address." }),
      { status: 400, headers },
    );
  }

  // Consent validation
  const consentTextVersion =
    typeof data.consentTextVersion === "string"
      ? data.consentTextVersion
      : "legacy-unknown";
  const consentSourcePage =
    typeof data.consentSourcePage === "string" ? data.consentSourcePage : "";

  if (!ALLOWED_CONSENT_TEXT_VERSIONS.has(consentTextVersion)) {
    return new Response(
      JSON.stringify({ error: "Invalid consentTextVersion." }),
      { status: 400, headers },
    );
  }
  if (!ALLOWED_CONSENT_SOURCE_PAGES.has(consentSourcePage)) {
    return new Response(
      JSON.stringify({ error: "Invalid consentSourcePage." }),
      { status: 400, headers },
    );
  }

  // Optional fields
  const phone =
    typeof data.phone === "string" ? data.phone.trim().slice(0, 32) : "";
  const businessName =
    typeof data.businessName === "string"
      ? data.businessName.trim().slice(0, 160)
      : "";
  const industry =
    typeof data.industry === "string" ? data.industry.trim().slice(0, 120) : "";
  const message =
    typeof data.message === "string" ? data.message.trim().slice(0, 2000) : "";
  const biggestChallenge =
    typeof data.biggestChallenge === "string"
      ? data.biggestChallenge.trim().slice(0, 2000)
      : "";
  const preferredContactMethod =
    typeof data.preferredContactMethod === "string"
      ? data.preferredContactMethod.trim().slice(0, 64)
      : "";
  const monthlyRevenueRange =
    typeof data.monthlyRevenueRange === "string"
      ? data.monthlyRevenueRange.trim().slice(0, 64)
      : "";
  const servicesInterested = Array.isArray(data.servicesInterested)
    ? (data.servicesInterested as unknown[])
        .filter((s): s is string => typeof s === "string")
        .slice(0, 20)
    : [];

  const smsConsent = data.smsConsent === true;
  const consent =
    data.consent &&
    typeof data.consent === "object" &&
    !Array.isArray(data.consent)
      ? (data.consent as {
          email?: boolean;
          sms?: boolean;
          phone?: boolean;
          source?: string;
          legalTextVersion?: string;
        })
      : null;

  const emailConsent = consent ? Boolean(consent.email) : true;
  const effectiveSmsConsent = consent ? Boolean(consent.sms) : smsConsent;
  const phoneConsent = consent ? Boolean(consent.phone) : smsConsent;

  const servicesLabel =
    servicesInterested.length > 0
      ? servicesInterested.map(escapeHtml).join(", ")
      : "Not specified";

  // Build owner notification email
  const ownerEmail = env.OWNER_EMAIL ?? OWNER_EMAIL_DEFAULT;
  const notifyHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
      <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">New Inquiry — Blueprints &amp; Bookkeeping</h1>
      </div>
      <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#666;font-size:14px;width:140px;">Name</td><td style="padding:8px 0;font-weight:600;">${escapeHtml(name)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${escapeHtml(email)}" style="color:#6366f1;">${escapeHtml(email)}</a></td></tr>
          ${phone ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone</td><td style="padding:8px 0;">${escapeHtml(phone)}</td></tr>` : ""}
          ${businessName ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Business</td><td style="padding:8px 0;">${escapeHtml(businessName)}</td></tr>` : ""}
          ${industry ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Industry</td><td style="padding:8px 0;">${escapeHtml(industry)}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Services</td><td style="padding:8px 0;">${servicesLabel}</td></tr>
          ${monthlyRevenueRange ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Revenue Range</td><td style="padding:8px 0;">${escapeHtml(monthlyRevenueRange)}</td></tr>` : ""}
          ${preferredContactMethod ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Prefers</td><td style="padding:8px 0;">${escapeHtml(preferredContactMethod)}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email Consent</td><td style="padding:8px 0;font-weight:600;color:${emailConsent ? "#10B981" : "#EF4444"};">${emailConsent ? "Yes" : "No"}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">SMS Consent</td><td style="padding:8px 0;font-weight:600;color:${effectiveSmsConsent ? "#10B981" : "#EF4444"};">${effectiveSmsConsent ? "Yes" : "No"}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone Consent</td><td style="padding:8px 0;font-weight:600;color:${phoneConsent ? "#10B981" : "#EF4444"};">${phoneConsent ? "Yes" : "No"}</td></tr>
        </table>
        ${
          biggestChallenge || message
            ? `
        <div style="margin-top:20px;padding:16px;background:white;border-radius:6px;border-left:3px solid #6366f1;">
          <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Message</p>
          <p style="margin:0;line-height:1.6;">${escapeHtml(biggestChallenge || message)}</p>
        </div>`
            : ""
        }
        <p style="margin-top:24px;font-size:13px;color:#999;">Reply directly to this email to respond to ${escapeHtml(name)}.</p>
      </div>
    </div>`;

  // Build auto-reply email
  const confirmHtml = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
      <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">We've got your message.</h1>
      </div>
      <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
        <p>Hi ${escapeHtml(name)},</p>
        <p>Thanks for reaching out to Blueprints &amp; Bookkeeping. Your inquiry has been received and I'll be in touch within <strong>one business day</strong> — usually sooner.</p>
        <p>In the meantime:</p>
        <ul style="line-height:1.8;">
          <li>Browse our <a href="https://blueprintsandbookkeeping.com/faq" style="color:#6366f1;">FAQ</a> for quick answers</li>
          <li>Book a <a href="https://blueprintsandbookkeeping.com/schedule" style="color:#6366f1;">free discovery call</a> directly on my calendar</li>
        </ul>
        <p>Talk soon,</p>
        <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints &amp; Bookkeeping LLC</span></p>
        <hr style="border:none;border-top:1px solid #e2e5f0;margin:24px 0;">
        <p style="font-size:12px;color:#999;">This is an automated confirmation. Tea will follow up from her personal inbox.</p>
      </div>
    </div>`;

  // Send emails via Resend (non-blocking failures are logged, not returned as errors)
  const resendKey = env.RESEND_API_KEY;
  if (resendKey) {
    const emailPromises: Promise<void>[] = [
      sendEmail(resendKey, {
        from: FROM_ADDRESS,
        to: ownerEmail,
        replyTo: email,
        subject: `New Inquiry: ${name}${businessName ? ` — ${businessName}` : ""}`,
        html: notifyHtml,
      }),
    ];

    if (emailConsent) {
      emailPromises.push(
        sendEmail(resendKey, {
          from: FROM_ADDRESS,
          to: email,
          subject: "We've received your inquiry — Blueprints & Bookkeeping",
          html: confirmHtml,
        }),
      );
    }

    await Promise.allSettled(emailPromises);
  } else {
    console.warn(
      "[contact] RESEND_API_KEY not set — skipping email notifications",
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message:
        "Thank you for your inquiry! We will be in touch within one business day.",
    }),
    { status: 201, headers },
  );
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
