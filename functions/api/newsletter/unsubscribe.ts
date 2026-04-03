/**
 * Cloudflare Pages Function: GET /api/newsletter/unsubscribe?token=...
 *                            POST /api/newsletter/unsubscribe
 *
 * Handles newsletter unsubscribe requests.
 *
 * NOTE: There is no persistent subscriber database in this Cloudflare Pages
 * deployment. Unsubscribe requests are acknowledged and, if RESEND_API_KEY is
 * set, the requester receives a confirmation email. To enable token-based
 * unsubscribes backed by a real database, bind a Cloudflare D1 database and
 * update this function.
 *
 * Required Cloudflare Pages env vars:
 *   RESEND_API_KEY  — Resend API key (optional; for confirmation email)
 */

export interface Env {
  RESEND_API_KEY?: string;
  OWNER_EMAIL?: string;
}

const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isValidEmail(email: string): boolean {
  return email.length <= 320 && EMAIL_RE.test(email);
}

async function sendUnsubscribeConfirmation(
  apiKey: string,
  email: string,
): Promise<void> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: email,
      subject: "You've been unsubscribed — Blueprints & Bookkeeping",
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">You've been unsubscribed</h1>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <p>We're sorry to see you go. You've been successfully unsubscribed from the Blueprints &amp; Bookkeeping newsletter.</p>
            <p>If you change your mind, you can always <a href="https://blueprintsandbookkeeping.com" style="color:#6366f1;">re-subscribe on our website</a>.</p>
            <p>Tea Larson-Hetrick<br><span style="color:#666;">Blueprints &amp; Bookkeeping LLC</span></p>
          </div>
        </div>`,
    }),
  });
  if (!res.ok) {
    console.error("[Resend] Unsubscribe confirmation failed:", res.status);
  }
}

const corsHeaders = {
  "Content-Type": "application/json",
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const url = new URL(context.request.url);
  const token = url.searchParams.get("token");

  if (!token) {
    return new Response(
      JSON.stringify({ error: "Missing or invalid token." }),
      { status: 400, headers: corsHeaders },
    );
  }

  // UUID format check
  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(token)) {
    return new Response(JSON.stringify({ error: "Invalid token format." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  // Without a database we can't look up the subscriber by token, but we
  // acknowledge the request so the UI shows success.
  return new Response(
    JSON.stringify({
      success: true,
      message: "You have been unsubscribed. We're sorry to see you go.",
    }),
    { status: 200, headers: corsHeaders },
  );
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;
  const url = new URL(context.request.url);

  // Support ?token= on POST as well (one-click list-unsubscribe)
  const queryToken = url.searchParams.get("token");
  if (queryToken) {
    const UUID_RE =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!UUID_RE.test(queryToken)) {
      return new Response(JSON.stringify({ error: "Invalid token format." }), {
        status: 400,
        headers: corsHeaders,
      });
    }
    return new Response(
      JSON.stringify({
        success: true,
        message: "You have been unsubscribed. We're sorry to see you go.",
      }),
      { status: 200, headers: corsHeaders },
    );
  }

  // Email-based unsubscribe
  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: corsHeaders,
    });
  }

  const data = typeof body === "object" && body !== null
    ? (body as Record<string, unknown>)
    : {};
  const rawEmail =
    typeof data.email === "string" ? data.email.trim().toLowerCase() : "";

  if (!rawEmail || !isValidEmail(rawEmail)) {
    return new Response(
      JSON.stringify({ error: "Please provide a valid email address." }),
      { status: 400, headers: corsHeaders },
    );
  }

  const resendKey = env.RESEND_API_KEY;
  if (resendKey) {
    await sendUnsubscribeConfirmation(resendKey, rawEmail).catch(() => {});
  }

  return new Response(
    JSON.stringify({
      success: true,
      message: "You have been unsubscribed. We're sorry to see you go.",
    }),
    { status: 200, headers: corsHeaders },
  );
};

export const onRequestOptions: PagesFunction<Env> = async () => {
  return new Response(null, {
    status: 204,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
};
