type D1Result<T = unknown> = {
  results?: T[];
  success: boolean;
  meta?: { last_row_id?: number };
};

type D1PreparedStatement = {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = unknown>(): Promise<T | null>;
  all<T = unknown>(): Promise<D1Result<T>>;
  run(): Promise<D1Result>;
};

type D1Database = {
  prepare(query: string): D1PreparedStatement;
};

type AiBinding = {
  run(model: string, input: Record<string, unknown>): Promise<unknown>;
};

type Env = {
  CONCIERGE_DB?: D1Database;
  AI?: AiBinding;
  RESEND_API_KEY?: string;
  OWNER_EMAIL?: string;
  FROM_EMAIL?: string;
  ALLOWED_ORIGINS?: string;
  TURNSTILE_SECRET_KEY?: string;
  AI_MODEL?: string;
  SITE_URL?: string;
};

type PagesContext = {
  request: Request;
  env: Env;
  waitUntil(promise: Promise<unknown>): void;
};

type JsonRecord = Record<string, unknown>;

const SITE_URL = "https://blueprintsandbookkeeping.com";
const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_EMAIL =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const CALENDLY_URL =
  "https://calendly.com/tea-blueprintsandbookkeeping/30min";
const EMERGENCY_CALENDLY_URL =
  "https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request";
const DEFAULT_AI_MODEL = "@cf/meta/llama-3.1-8b-instruct";
const MAX_JSON_BYTES = 32_000;
const TURNSTILE_RESPONSE_FIELD = "cf-turnstile-response";
const TURNSTILE_ACTION = "lead_form";
const MAX_TURNSTILE_TOKEN_LENGTH = 2048;

const COMPANY_CONTEXT = `
Blueprints & Bookkeeping LLC is a remote-first bookkeeping and business planning firm founded by Tea Larson-Hetrick in Roseburg, Oregon. The firm serves clients nationwide.

Core services:
- Advanced bookkeeping: ongoing monthly bookkeeping, QuickBooks Online management, reconciliation, financial statements, cleanup, multi-entity support, and niche industries such as crypto, agriculture, timber, SaaS, independent contractors, gig workers, and rural businesses.
- Business plans: startup plans, management reports and financials, LivePlan-powered forecasting, target market analysis, opportunity analysis, and full business plan design.

Business rules:
- Never offer tax preparation, tax filing, tax advice, tax planning, or seasonal tax services.
- If asked about taxes, explain that Blueprints & Bookkeeping does not provide tax services. It can provide clean books and financial reports for a client's CPA, EA, or chosen tax professional.
- Do not directly schedule appointments. Guide visitors to Calendly.
- Use the 30-minute Calendly link for discovery calls: ${CALENDLY_URL}
- Use the 15-minute emergency/expedited Calendly link only for urgent situations: ${EMERGENCY_CALENDLY_URL}
- Contact email: tea@blueprintsandbookkeeping.com
- Phone: 541-319-8654
- Pricing language should use "starting at" and final pricing requires review.
- Maximum active client count is 20; mention this only when useful.

Preferred paths:
- Simple questions: answer briefly and offer contact or scheduling.
- Ready to schedule: send the Calendly link and explain that Tea will meet with them there.
- Website or assistant problem: apologize briefly, collect what happened, and tell them Tea will be notified.
- Existing QuickBooks users: direct them to contact/intake and explain Tea reviews before accepting accountant access.
`;

const HIGH_INTENT_RE =
  /\b(book|schedule|call|consultation|ready|sign me up|get started|hire|quote|pricing|cost|follow up|contact me|call me|email me|broken|not working|can't submit|cannot submit|error|problem|bug|wrong|bad answer|incorrect)\b/i;

function jsonResponse(
  body: unknown,
  init: ResponseInit = {},
  request?: Request,
): Response {
  return new Response(JSON.stringify(body), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...securityHeaders(),
      ...corsHeaders(request),
      ...init.headers,
    },
  });
}

function securityHeaders(): Record<string, string> {
  return {
    "x-content-type-options": "nosniff",
    "referrer-policy": "strict-origin-when-cross-origin",
    "permissions-policy": "camera=(), microphone=(), geolocation=()",
  };
}

function corsHeaders(request?: Request): Record<string, string> {
  const origin = request?.headers.get("origin");
  if (!origin) return {};
  if (!isAllowedOrigin(origin, request)) return {};
  return {
    "access-control-allow-origin": origin,
    "access-control-allow-methods": "GET, POST, OPTIONS",
    "access-control-allow-headers": "content-type, cf-turnstile-response",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

function isAllowedOrigin(origin: string, request?: Request): boolean {
  const configured = request
    ? ((request as unknown as { __env?: Env }).__env?.ALLOWED_ORIGINS ?? "")
    : "";
  const allowed = new Set(
    [
      SITE_URL,
      "https://www.blueprintsandbookkeeping.com",
      "http://localhost:5173",
      "http://localhost:19161",
      ...configured
        .split(",")
        .map((value) => value.trim())
        .filter(Boolean),
    ].map((value) => value.replace(/\/+$/, "")),
  );
  return allowed.has(origin.replace(/\/+$/, ""));
}

function bindEnvToRequest(request: Request, env: Env): Request {
  (request as unknown as { __env?: Env }).__env = env;
  return request;
}

function assertAllowedOrigin(request: Request, env: Env): void {
  const origin = request.headers.get("origin");
  if (!origin) return;
  bindEnvToRequest(request, env);
  if (!isAllowedOrigin(origin, request)) {
    throw new ResponseError(403, "Origin is not allowed.");
  }
}

function getPath(request: Request): string {
  const pathname = new URL(request.url).pathname;
  return pathname.replace(/^\/api\/?/, "").replace(/\/+$/, "");
}

function getIp(request: Request): string {
  return (
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for")?.split(",", 1)[0]?.trim() ||
    "unknown"
  );
}

function getUserAgent(request: Request): string {
  return request.headers.get("user-agent")?.slice(0, 500) || "";
}

function requireDb(env: Env): D1Database {
  if (!env.CONCIERGE_DB) {
    throw new ResponseError(503, "Database is not configured.");
  }
  return env.CONCIERGE_DB;
}

class ResponseError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}

async function readJson(request: Request): Promise<JsonRecord> {
  const lengthHeader = request.headers.get("content-length");
  const declaredLength = lengthHeader ? Number.parseInt(lengthHeader, 10) : 0;
  if (declaredLength > MAX_JSON_BYTES) {
    throw new ResponseError(413, "Submission is too large.");
  }

  // Enforce the byte limit on the actual body, not just the Content-Length header,
  // so chunked or header-less requests can't bypass the check.
  const rawBytes = await request.arrayBuffer();
  if (rawBytes.byteLength > MAX_JSON_BYTES) {
    throw new ResponseError(413, "Submission is too large.");
  }

  let value: unknown;
  try {
    value = JSON.parse(new TextDecoder().decode(rawBytes));
  } catch {
    throw new ResponseError(400, "Expected a JSON object.");
  }

  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throw new ResponseError(400, "Expected a JSON object.");
  }
  return value as JsonRecord;
}

function textField(
  body: JsonRecord,
  key: string,
  max: number,
  required = false,
): string {
  const value = body[key];
  if (value == null || value === "") {
    if (required) throw new ResponseError(400, `${key} is required.`);
    return "";
  }
  if (typeof value !== "string") {
    throw new ResponseError(400, `${key} must be text.`);
  }
  const trimmed = value.trim();
  if (required && !trimmed) {
    throw new ResponseError(400, `${key} is required.`);
  }
  if (trimmed.length > max) {
    throw new ResponseError(400, `${key} must be ${max} characters or fewer.`);
  }
  return trimmed;
}

function boolField(body: JsonRecord, key: string): boolean {
  return body[key] === true;
}

function emailField(body: JsonRecord, key: string, required = false): string {
  const email = textField(body, key, 320, required).toLowerCase();
  if (!email) return "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new ResponseError(400, "Please provide a valid email address.");
  }
  return email;
}

function jsonString(value: unknown): string {
  return JSON.stringify(value ?? null);
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

async function checkRateLimit(
  db: D1Database,
  routeId: string,
  key: string,
  limit: number,
  windowSeconds: number,
): Promise<void> {
  const now = Math.floor(Date.now() / 1000);
  const rateKey = `${routeId}:${key}`;
  const existing = await db
    .prepare("SELECT count, reset_at FROM rate_limits WHERE key = ?")
    .bind(rateKey)
    .first<{ count: number; reset_at: number }>();

  if (!existing || existing.reset_at <= now) {
    await db
      .prepare(
        "INSERT OR REPLACE INTO rate_limits (key, count, reset_at) VALUES (?, ?, ?)",
      )
      .bind(rateKey, 1, now + windowSeconds)
      .run();
    return;
  }

  if (existing.count >= limit) {
    throw new ResponseError(429, "Too many requests. Please try again later.");
  }

  await db
    .prepare("UPDATE rate_limits SET count = count + 1 WHERE key = ?")
    .bind(rateKey)
    .run();
}

function getExpectedTurnstileHostname(env: Env): string | null {
  const configuredSiteUrl = env.SITE_URL || SITE_URL;
  try {
    return new URL(configuredSiteUrl).hostname.toLowerCase();
  } catch {
    return null;
  }
}

async function verifyTurnstileOrThrow(
  env: Env,
  body: JsonRecord,
  request: Request,
  options: { action?: string } = {},
): Promise<void> {
  if (!env.TURNSTILE_SECRET_KEY) {
    throw new ResponseError(
      503,
      "Verification is temporarily unavailable. Please try again soon.",
    );
  }
  const tokenRaw =
    body[TURNSTILE_RESPONSE_FIELD] ??
    // Legacy transition support: remove turnstileToken/captchaToken once clients only submit cf-turnstile-response.
    body.turnstileToken ??
    body.captchaToken ??
    request.headers.get(TURNSTILE_RESPONSE_FIELD);
  if (tokenRaw == null || tokenRaw === "") {
    throw new ResponseError(
      400,
      "Verification is required. Please complete the challenge.",
    );
  }
  if (typeof tokenRaw !== "string") {
    throw new ResponseError(
      400,
      "Verification token format is invalid. Please try again.",
    );
  }
  const token = tokenRaw.trim();
  if (!token) {
    throw new ResponseError(
      400,
      "Verification is required. Please complete the challenge.",
    );
  }
  if (token.length > MAX_TURNSTILE_TOKEN_LENGTH) {
    throw new ResponseError(
      400,
      "Verification token is invalid. Please retry verification.",
    );
  }

  const response = await fetch(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        secret: env.TURNSTILE_SECRET_KEY,
        response: token,
        remoteip: getIp(request),
      }),
    },
  );
  if (!response.ok) {
    throw new ResponseError(
      503,
      "Verification is temporarily unavailable. Please try again.",
    );
  }
  const payload = (await response.json().catch(() => ({}))) as {
    success?: boolean;
    action?: string;
    hostname?: string;
    "error-codes"?: string[];
  };
  if (!payload.success) {
    const errorCodes = Array.isArray(payload["error-codes"])
      ? payload["error-codes"]
      : [];
    if (errorCodes.includes("timeout-or-duplicate")) {
      throw new ResponseError(
        400,
        "Verification expired or was already used. Please complete the challenge again.",
      );
    }
    if (errorCodes.includes("invalid-input-response")) {
      throw new ResponseError(
        400,
        "Verification token is invalid. Please retry verification.",
      );
    }
    throw new ResponseError(403, "Verification failed. Please try again.");
  }
  if (options.action && payload.action !== options.action) {
    throw new ResponseError(403, "Verification action mismatch.");
  }
  const expectedHostname = getExpectedTurnstileHostname(env);
  if (expectedHostname && payload.hostname?.toLowerCase() !== expectedHostname) {
    throw new ResponseError(403, "Verification origin mismatch.");
  }
}

async function sendOwnerEmail(
  env: Env,
  subject: string,
  html: string,
  replyTo?: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  const body: JsonRecord = {
    from: env.FROM_EMAIL || FROM_EMAIL,
    to: env.OWNER_EMAIL || OWNER_EMAIL,
    subject,
    html,
  };
  if (replyTo) body.reply_to = replyTo;

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const text = await response.text();
    console.error(
      JSON.stringify({
        level: "error",
        event: "resend_failed",
        status: response.status,
        detail: text.slice(0, 500),
      }),
    );
  }
}

async function sendVisitorEmail(
  env: Env,
  to: string,
  subject: string,
  html: string,
): Promise<void> {
  if (!env.RESEND_API_KEY) return;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${env.RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({
      from: env.FROM_EMAIL || FROM_EMAIL,
      to,
      subject,
      html,
    }),
  });
  if (!response.ok) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "visitor_email_failed",
        status: response.status,
      }),
    );
  }
}

async function recordNotification(
  db: D1Database,
  type: string,
  subject: string,
  payload: unknown,
): Promise<void> {
  await db
    .prepare(
      "INSERT INTO notification_events (type, subject, payload_json, created_at) VALUES (?, ?, ?, ?)",
    )
    .bind(type, subject, jsonString(payload), new Date().toISOString())
    .run();
}

function leadEmailHtml(payload: {
  heading: string;
  name?: string;
  email?: string;
  phone?: string;
  message: string;
  source?: string;
}): string {
  return `
    <div style="font-family:Inter,Arial,sans-serif;max-width:640px;color:#111827">
      <h1>${escapeHtml(payload.heading)}</h1>
      <p><strong>Name:</strong> ${escapeHtml(payload.name || "Not provided")}</p>
      <p><strong>Email:</strong> ${escapeHtml(payload.email || "Not provided")}</p>
      <p><strong>Phone:</strong> ${escapeHtml(payload.phone || "Not provided")}</p>
      <p><strong>Source:</strong> ${escapeHtml(payload.source || "Website")}</p>
      <hr />
      <p style="white-space:pre-wrap">${escapeHtml(payload.message)}</p>
    </div>`;
}

async function handleHealth(context: PagesContext): Promise<Response> {
  let dbStatus: "ok" | "missing" | "error" = "missing";
  if (context.env.CONCIERGE_DB) {
    try {
      await context.env.CONCIERGE_DB.prepare("SELECT 1").first();
      dbStatus = "ok";
    } catch {
      dbStatus = "error";
    }
  }

  const payload = {
    status: dbStatus === "ok" ? "ok" : "degraded",
    db: dbStatus === "ok" ? "ok" : "error",
    assistant: context.env.AI ? "ok" : "missing",
    email: context.env.RESEND_API_KEY ? "ok" : "missing",
    timestamp: new Date().toISOString(),
  };

  return jsonResponse(payload, {
    status: payload.status === "ok" ? 200 : 503,
  }, context.request);
}

async function handleContact(context: PagesContext): Promise<Response> {
  const db = requireDb(context.env);
  const body = await readJson(context.request);
  await checkRateLimit(db, "contact", getIp(context.request), 8, 15 * 60);
  await verifyTurnstileOrThrow(context.env, body, context.request, {
    action: TURNSTILE_ACTION,
  });

  if (textField(body, "website", 200)) {
    return jsonResponse(
      { success: true, message: "Submission received." },
      { status: 201 },
      context.request,
    );
  }

  const formType = textField(body, "formType", 80) || "quick";
  const name = textField(body, "name", 120, true);
  const email = emailField(body, "email", true);
  const phone = textField(body, "phone", 32);
  const message =
    textField(body, "message", 2000) ||
    textField(body, "biggestChallenge", 2000) ||
    "No message provided.";
  const businessName = textField(body, "businessName", 160);
  const consent = (body.consent || {}) as JsonRecord;
  const emailConsent =
    boolField(body, "emailConsent") || consent.email === true;
  const smsConsent = boolField(body, "smsConsent") || consent.sms === true;
  const phoneConsent =
    boolField(body, "phoneConsent") || consent.phone === true;

  if (!emailConsent) {
    throw new ResponseError(
      400,
      "Email consent is required so we can respond.",
    );
  }

  const result = await db
    .prepare(
      `INSERT INTO contact_submissions (
        form_type, name, email, phone, business_name, message, payload_json,
        email_consent, sms_consent, phone_consent, consent_source_page,
        consent_text_version, request_ip, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      formType,
      name,
      email,
      phone || null,
      businessName || null,
      message,
      jsonString(body),
      emailConsent ? 1 : 0,
      smsConsent ? 1 : 0,
      phoneConsent ? 1 : 0,
      textField(body, "consentSourcePage", 120) || "/contact",
      textField(body, "consentTextVersion", 120) || "unknown",
      getIp(context.request),
      getUserAgent(context.request),
      new Date().toISOString(),
    )
    .run();

  const subject = `New website inquiry: ${name}${businessName ? ` - ${businessName}` : ""}`;
  const emailHtml = leadEmailHtml({
    heading: "New Website Inquiry",
    name,
    email,
    phone,
    source: formType,
    message,
  });
  context.waitUntil(sendOwnerEmail(context.env, subject, emailHtml, email));
  context.waitUntil(
    sendVisitorEmail(
      context.env,
      email,
      "We received your inquiry - Blueprints & Bookkeeping",
      `<p>Hi ${escapeHtml(name)},</p><p>Thanks for reaching out to Blueprints & Bookkeeping. Tea will review your message and follow up shortly.</p><p>If you want to schedule directly, use <a href="${CALENDLY_URL}">Tea's Calendly link</a>.</p>`,
    ),
  );
  context.waitUntil(
    recordNotification(db, "contact_submission", subject, {
      name,
      email,
      phone,
      businessName,
      formType,
    }),
  );

  return jsonResponse(
    {
      success: true,
      message: "Thank you for your inquiry! We will be in touch shortly.",
      id: result.meta?.last_row_id ?? null,
    },
    { status: 201 },
    context.request,
  );
}

async function handleNewsletter(context: PagesContext): Promise<Response> {
  const db = requireDb(context.env);
  const body = await readJson(context.request);
  await checkRateLimit(
    db,
    "newsletter_subscribe",
    getIp(context.request),
    20,
    60 * 60,
  );
  await verifyTurnstileOrThrow(context.env, body, context.request, {
    action: TURNSTILE_ACTION,
  });

  if (textField(body, "website", 200)) {
    return jsonResponse(
      { success: true, message: "You're subscribed! Thank you for signing up." },
      { status: 201 },
      context.request,
    );
  }

  const email = emailField(body, "email", true);
  const signupSource = textField(body, "signupSource", 80) || "website";
  const token = crypto.randomUUID();

  await db
    .prepare(
      `INSERT INTO newsletter_subscribers (email, signup_source, unsubscribe_token, active, created_at, updated_at)
       VALUES (?, ?, ?, 1, ?, ?)
       ON CONFLICT(email) DO UPDATE SET active = 1, signup_source = excluded.signup_source, updated_at = excluded.updated_at`,
    )
    .bind(
      email,
      signupSource,
      token,
      new Date().toISOString(),
      new Date().toISOString(),
    )
    .run();

  context.waitUntil(
    sendVisitorEmail(
      context.env,
      email,
      "Welcome to Blueprints & Bookkeeping",
      `<p>Thanks for subscribing to Blueprints & Bookkeeping updates.</p><p>You can always reach Tea at <a href="mailto:tea@blueprintsandbookkeeping.com">tea@blueprintsandbookkeeping.com</a>.</p>`,
    ),
  );
  context.waitUntil(
    sendOwnerEmail(
      context.env,
      `New newsletter signup: ${email}`,
      leadEmailHtml({
        heading: "New Newsletter Signup",
        email,
        source: signupSource,
        message: `${email} subscribed from ${signupSource}.`,
      }),
      email,
    ),
  );

  return jsonResponse(
    { success: true, message: "You're subscribed! Thank you for signing up." },
    { status: 201 },
    context.request,
  );
}

async function handleFeedback(context: PagesContext): Promise<Response> {
  const db = requireDb(context.env);
  const body = await readJson(context.request);
  await checkRateLimit(db, "feedback", getIp(context.request), 12, 10 * 60);
  await verifyTurnstileOrThrow(context.env, body, context.request, {
    action: TURNSTILE_ACTION,
  });

  if (textField(body, "website", 200)) {
    return jsonResponse(
      { success: true, message: "Thanks for the feedback!" },
      { status: 201 },
      context.request,
    );
  }

  const category = textField(body, "category", 80, true);
  const description = textField(body, "description", 3000, true);
  if (description.length < 5) {
    throw new ResponseError(400, "Please describe the issue in a few words.");
  }
  const name = textField(body, "name", 120);
  const email = emailField(body, "email");
  const phone = textField(body, "phone", 32);
  const page = textField(body, "page", 300);
  const source =
    textField(body, "source", 80) ||
    (category.toLowerCase().includes("assistant")
      ? "assistant"
      : "website");

  const result = await db
    .prepare(
      `INSERT INTO feedback_submissions (
        source, category, page, name, email, phone, description, payload_json,
        request_ip, user_agent, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    )
    .bind(
      source,
      category,
      page || null,
      name || null,
      email || null,
      phone || null,
      description,
      jsonString(body),
      getIp(context.request),
      getUserAgent(context.request),
      new Date().toISOString(),
    )
    .run();

  const subject = `[${source === "assistant" ? "Aria Feedback" : "Site Feedback"}] ${category}`;
  context.waitUntil(
    sendOwnerEmail(
      context.env,
      subject,
      leadEmailHtml({
        heading: subject,
        name,
        email,
        phone,
        source: page || source,
        message: description,
      }),
      email || undefined,
    ),
  );
  context.waitUntil(
    recordNotification(db, "feedback", subject, {
      source,
      category,
      page,
      name,
      email,
      phone,
    }),
  );

  return jsonResponse(
    {
      success: true,
      message: "Thanks for the feedback!",
      id: result.meta?.last_row_id ?? null,
    },
    { status: 201 },
    context.request,
  );
}

async function createConversation(context: PagesContext): Promise<Response> {
  const db = requireDb(context.env);
  const body = await readJson(context.request);
  await checkRateLimit(db, "chat_create", getIp(context.request), 20, 60 * 60);
  const title = textField(body, "title", 120) || "Website Chat";
  const now = new Date().toISOString();
  const result = await db
    .prepare(
      "INSERT INTO chat_conversations (title, request_ip, user_agent, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
    )
    .bind(title, getIp(context.request), getUserAgent(context.request), now, now)
    .run();
  const id = result.meta?.last_row_id;
  if (typeof id !== "number") {
    throw new ResponseError(503, "Failed to create conversation.");
  }

  return jsonResponse(
    { id, title, createdAt: now },
    { status: 201 },
    context.request,
  );
}

async function sendChatMessage(
  context: PagesContext,
  conversationId: number,
): Promise<Response> {
  const db = requireDb(context.env);
  const body = await readJson(context.request);
  await checkRateLimit(db, "chat_message", getIp(context.request), 30, 60 * 60);
  await verifyTurnstileOrThrow(context.env, body, context.request);

  const content = textField(body, "content", 3000, true);
  const now = new Date().toISOString();
  await db
    .prepare(
      "INSERT INTO chat_messages (conversation_id, role, content, created_at) VALUES (?, 'user', ?, ?)",
    )
    .bind(conversationId, content, now)
    .run();

  const history = await db
    .prepare(
      "SELECT role, content FROM chat_messages WHERE conversation_id = ? ORDER BY id DESC LIMIT 8",
    )
    .bind(conversationId)
    .all<{ role: string; content: string }>();
  const orderedHistory = (history.results ?? []).reverse();
  const answer = await generateAssistantAnswer(context.env, orderedHistory);

  await db
    .prepare(
      "INSERT INTO chat_messages (conversation_id, role, content, created_at) VALUES (?, 'assistant', ?, ?)",
    )
    .bind(conversationId, answer, new Date().toISOString())
    .run();
  await db
    .prepare("UPDATE chat_conversations SET updated_at = ? WHERE id = ?")
    .bind(new Date().toISOString(), conversationId)
    .run();

  if (HIGH_INTENT_RE.test(content) || HIGH_INTENT_RE.test(answer)) {
    const subject = `Aria follow-up needed - conversation #${conversationId}`;
    context.waitUntil(
      sendOwnerEmail(
        context.env,
        subject,
        leadEmailHtml({
          heading: "Aria Follow-up Needed",
          source: `Conversation #${conversationId}`,
          message: `Visitor said:\n${content}\n\nAria replied:\n${answer}`,
        }),
      ),
    );
    context.waitUntil(
      recordNotification(db, "chat_escalation", subject, {
        conversationId,
        userMessage: content,
        assistantAnswer: answer,
      }),
    );
  }

  return sseResponse(answer, context.request);
}

async function generateAssistantAnswer(
  env: Env,
  history: Array<{ role: string; content: string }>,
): Promise<string> {
  if (!env.AI) {
    return "Aria is temporarily offline right now. Please use the contact form, email tea@blueprintsandbookkeeping.com, or book a discovery call and Tea will follow up personally.";
  }

  const prompt = [
    "You are Aria, the website assistant for Blueprints & Bookkeeping.",
    "Answer in a warm, direct, concise way.",
    "Use only the company context below. If the answer is not in the context, say you are not sure and direct the visitor to Tea.",
    "Never offer tax preparation, tax filing, tax advice, or tax planning.",
    "Do not claim to schedule appointments. Give the correct Calendly link instead.",
    "",
    "COMPANY CONTEXT:",
    COMPANY_CONTEXT,
    "",
    "RECENT CHAT:",
    ...history.map((message) => `${message.role.toUpperCase()}: ${message.content}`),
    "",
    "ARIA:",
  ].join("\n");

  try {
    const result = await env.AI.run(env.AI_MODEL || DEFAULT_AI_MODEL, {
      prompt,
      max_tokens: 700,
      temperature: 0.3,
    });
    if (typeof result === "string") return result;
    if (result && typeof result === "object") {
      const response = (result as JsonRecord).response;
      if (typeof response === "string") return response;
    }
  } catch (error) {
    console.error(
      JSON.stringify({
        level: "error",
        event: "assistant_generation_failed",
        detail: error instanceof Error ? error.message : String(error),
      }),
    );
  }

  return "Aria is having trouble answering right now. You can email tea@blueprintsandbookkeeping.com or book a discovery call at https://calendly.com/tea-blueprintsandbookkeeping/30min.";
}

function sseResponse(content: string, request: Request): Response {
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      controller.enqueue(
        encoder.encode(`data: ${JSON.stringify({ content })}\n\n`),
      );
      controller.enqueue(encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`));
      controller.close();
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache",
      ...securityHeaders(),
      ...corsHeaders(request),
    },
  });
}

function parseConversationMessagePath(path: string): number | null {
  const match = /^openai\/conversations\/(\d+)\/messages$/.exec(path);
  if (!match?.[1]) return null;
  return Number.parseInt(match[1], 10);
}

export async function onRequest(context: PagesContext): Promise<Response> {
  const request = bindEnvToRequest(context.request, context.env);
  context = { ...context, request };
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { ...securityHeaders(), ...corsHeaders(request) },
    });
  }

  try {
    const path = getPath(request);
    const method = request.method.toUpperCase();
    if (method !== "GET") {
      assertAllowedOrigin(request, context.env);
    }

    if (method === "GET" && path === "healthz") {
      return await handleHealth(context);
    }
    if (method === "POST" && path === "contact") {
      return await handleContact(context);
    }
    if (method === "POST" && path === "newsletter/subscribe") {
      return await handleNewsletter(context);
    }
    if (method === "POST" && path === "feedback") {
      return await handleFeedback(context);
    }
    if (method === "POST" && path === "assistant/feedback") {
      return await handleFeedback(context);
    }
    if (method === "POST" && path === "openai/conversations") {
      return await createConversation(context);
    }

    const conversationId = parseConversationMessagePath(path);
    if (method === "POST" && conversationId) {
      return await sendChatMessage(context, conversationId);
    }

    return jsonResponse({ error: "Not found" }, { status: 404 }, request);
  } catch (error) {
    if (error instanceof ResponseError) {
      return jsonResponse({ error: error.message }, { status: error.status }, request);
    }
    console.error(
      JSON.stringify({
        level: "error",
        event: "api_unhandled_error",
        detail: error instanceof Error ? error.message : String(error),
      }),
    );
    return jsonResponse(
      { error: "Internal server error" },
      { status: 500 },
      request,
    );
  }
}
