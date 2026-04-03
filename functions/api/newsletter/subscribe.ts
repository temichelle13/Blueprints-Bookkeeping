/**
 * Cloudflare Pages Function: POST /api/newsletter/subscribe
 *
 * Handles newsletter signup. Sends a welcome email to the subscriber and
 * a notification email to the owner via Resend.
 *
 * NOTE: There is no persistent subscriber database in this Cloudflare Pages
 * deployment. Each subscription triggers emails only. If you need a persistent
 * subscriber list, bind a Cloudflare D1 database and update this function.
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

const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const OWNER_EMAIL_DEFAULT = "tea@blueprintsandbookkeeping.com";
const SITE_URL_DEFAULT = "https://blueprintsandbookkeeping.com";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return email.length <= 320 && EMAIL_RE.test(email);
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

function buildWelcomeEmail(siteUrl: string): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
      <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">Welcome to Blueprints &amp; Bookkeeping</h1>
      </div>
      <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
        <p>Hi there,</p>
        <p>Thanks for subscribing. You're on the list for founder-focused bookkeeping insights, business planning guidance, and practical updates from Blueprints &amp; Bookkeeping.</p>
        <p>I'm Tea — founder of Blueprints &amp; Bookkeeping LLC. I specialize in advanced bookkeeping and business planning for small businesses and growing teams.</p>
        <p>What to expect from this newsletter:</p>
        <ul style="line-height:1.8;">
          <li>Practical financial insights for founders and small business owners</li>
          <li>Real talk on bookkeeping systems, cash flow, and business planning</li>
          <li>No fluff. No tax advice. Just actionable guidance.</li>
        </ul>
        <p>If you have a question or want to talk about your business, you can <a href="${siteUrl}/schedule" style="color:#6366f1;">book a free discovery call</a> anytime.</p>
        <p>Talk soon,</p>
        <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints &amp; Bookkeeping LLC · Roseburg, Oregon</span></p>
        <hr style="border:none;border-top:1px solid #e2e5f0;margin:24px 0;">
        <p style="font-size:12px;color:#999;">You're receiving this because you signed up at blueprintsandbookkeeping.com. To unsubscribe, reply to this email with the subject "Unsubscribe".</p>
      </div>
    </div>`;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;

  const corsHeaders = {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };

  // Honeypot (same field as contact form)
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  if (typeof body !== "object" || body === null) {
    return new Response(JSON.stringify({ error: "Invalid request body." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const data = body as Record<string, unknown>;

  // Validate email
  if (typeof data.email !== "string" || data.email.length > 320) {
    return new Response(
      JSON.stringify({ error: "Please provide a valid email address." }),
      { status: 400, headers: corsHeaders },
    );
  }

  const email = normalizeEmail(data.email);
  if (!email) {
    return new Response(
      JSON.stringify({ error: "Please provide a valid email address." }),
      { status: 400, headers: corsHeaders },
    );
  }

  const signupSource =
    data.signupSource === "footer" || data.signupSource === "lead_magnet"
      ? data.signupSource
      : "footer";

  const siteUrl = env.SITE_URL ?? SITE_URL_DEFAULT;
  const ownerEmail = env.OWNER_EMAIL ?? OWNER_EMAIL_DEFAULT;
  const resendKey = env.RESEND_API_KEY;

  if (resendKey) {
    const welcomeHtml = buildWelcomeEmail(siteUrl);

    await Promise.allSettled([
      // Welcome email to subscriber
      sendEmail(resendKey, {
        from: FROM_ADDRESS,
        to: email,
        subject: "Welcome to Blueprints & Bookkeeping",
        html: welcomeHtml,
      }),
      // Notification to owner
      sendEmail(resendKey, {
        from: FROM_ADDRESS,
        to: ownerEmail,
        subject: `New Newsletter Subscriber: ${email}`,
        html: `
          <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
            <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
              <h1 style="color:white;margin:0;font-size:20px;">New Newsletter Subscriber</h1>
            </div>
            <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
              <p><strong>Email:</strong> ${email}</p>
              <p><strong>Signup Source:</strong> ${signupSource}</p>
              <p style="font-size:13px;color:#999;">Note: This site uses Cloudflare Pages Functions. Subscriber data is not persisted in a database — only emails are sent.</p>
            </div>
          </div>`,
      }),
    ]);
  } else {
    console.warn(
      "[newsletter/subscribe] RESEND_API_KEY not set — skipping emails for",
      email,
    );
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "You're subscribed! Thank you for signing up.",
    }),
    { status: 201, headers: corsHeaders },
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
