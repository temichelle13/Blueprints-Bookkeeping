/**
 * Cloudflare Pages Function: POST /api/openai/conversations/:id/messages
 *                            GET  /api/openai/conversations/:id/messages
 *
 * Sends a user message to Aria (powered by OpenAI) and streams the response
 * back to the client using Server-Sent Events.
 *
 * Storage note: Conversation history is kept in a module-level Map (shared
 * within a single Worker isolate). This works for typical short chat sessions
 * but is NOT durable across Worker restarts or across multiple isolate
 * instances. For fully durable chat history, bind a Cloudflare KV namespace
 * named CHAT_KV and this function will use it automatically.
 *
 * Required Cloudflare Pages env vars:
 *   OPENAI_API_KEY      — OpenAI API key
 *   OPENAI_CHAT_MODEL   — model ID (default: gpt-4.1-mini)
 *   RESEND_API_KEY      — (optional) Resend key for lead notifications
 *   OWNER_EMAIL         — (optional) override notification recipient
 *
 * Optional Cloudflare Pages bindings:
 *   CHAT_KV             — KV namespace for durable conversation storage
 */

export interface Env {
  OPENAI_API_KEY?: string;
  OPENAI_CHAT_MODEL?: string;
  RESEND_API_KEY?: string;
  OWNER_EMAIL?: string;
  SITE_URL?: string;
  CHAT_KV?: KVNamespace;
}

interface StoredMessage {
  id: number;
  conversationId: number;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

interface StoredConversation {
  id: number;
  title: string;
  createdAt: string;
  messages: StoredMessage[];
}

// Module-level fallback store (ephemeral, per isolate)
const ephemeralStore = new Map<number, StoredConversation>();

async function loadConversation(
  id: number,
  kv?: KVNamespace,
): Promise<StoredConversation | null> {
  if (kv) {
    const raw = await kv.get(`conv:${id}`, "json");
    return (raw as StoredConversation) ?? null;
  }
  return ephemeralStore.get(id) ?? null;
}

async function saveConversation(
  conv: StoredConversation,
  kv?: KVNamespace,
): Promise<void> {
  if (kv) {
    // Store for 24 hours
    await kv.put(`conv:${conv.id}`, JSON.stringify(conv), {
      expirationTtl: 86400,
    });
  } else {
    ephemeralStore.set(conv.id, conv);
    // Evict old entries to prevent unbounded growth
    if (ephemeralStore.size > 1000) {
      const firstKey = ephemeralStore.keys().next().value;
      if (firstKey !== undefined) {
        ephemeralStore.delete(firstKey);
      }
    }
  }
}

const OWNER_EMAIL_DEFAULT = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

const SYSTEM_PROMPT = `You are Aria, the friendly AI assistant for Blueprints & Bookkeeping, LLC — a premium remote financial services firm founded by Tea Larson-Hetrick in Roseburg, Oregon.

ABOUT THE FIRM:
- Founded and operated by Tea Larson-Hetrick
- Credentials: QuickBooks ProAdvisor Gold, Certified Ethical Hacker (CEH v12), Advanced Crypto Accounting Certified
- Intentionally capped at 20 active clients so every client gets focused, personalized attention
- Remote-first, serving businesses across the United States
- IMPORTANT: The firm does NOT offer tax preparation, tax filing, or tax advice — by design. This keeps Tea available to clients year-round instead of disappearing during tax season. If asked about taxes, gently explain this.

SERVICES & PRICING:

1. ADVANCED BOOKKEEPING (monthly retainer — the core service)
   - Essentials: starting at $500/month
     * Up to 2 business entities
     * Monthly bank reconciliation
     * Monthly financial reports (P&L, Balance Sheet)
     * Best for: solo operators, freelancers, small businesses
   - Growth: starting at $900/month
     * Up to 5 business entities
     * Everything in Essentials, plus:
     * Cash flow forecasting
     * KPI dashboard with trends
     * Quarterly strategy check-ins
     * Best for: growing businesses, multi-entity owners
   - Advanced: custom pricing (call for quote)
     * Unlimited entities
     * Multi-location support
     * Crypto asset accounting
     * SBA loan-ready financials
     * Best for: complex operations, investors, crypto businesses

2. BUSINESS PLANS (one-time project)
   - Startup Roadmap: starting at $2,500
     * Executive summary
     * Market analysis
     * 3-year financial projections
     * Best for: new businesses, early-stage startups
   - SBA / Investor Ready: starting at $4,000
     * Full lender/investor package
     * Pitch deck
     * Detailed financial model with scenario analysis
     * Best for: businesses seeking SBA loans or investor funding

3. DIGITAL HANDSHAKE (add-on only — cannot be purchased standalone)
   - Starting at $1,500
   - Professional web presence setup (domain, hosting, basic site)
   - Available exclusively as an add-on for existing bookkeeping or business plan clients

HOW PEOPLE CAN GET STARTED:

PATH 1 — SIGN UP ONLINE (best for: Essentials or Growth bookkeeping, ready to start now)
- They can sign up directly at: https://blueprintsandbookkeeping.com/pricing
- Secure Stripe checkout, then a short intake form
- Contracts sent automatically via Adobe Sign — no calls required

PATH 2 — ALREADY HAVE QUICKBOOKS?
- If they're already on QuickBooks Online, Tea connects directly to their existing company file
- They fill out an intake form at: https://blueprintsandbookkeeping.com/onboarding

PATH 3 — JUST LEAVE YOUR INFO (best for: not ready to commit, want a human to reach out)
- Offer to collect their name, email, and what they need — Tea will personally follow up within one business day
- You can also send them to: https://blueprintsandbookkeeping.com/contact

PATH 4 — BOOK A DISCOVERY CALL (best for: Advanced bookkeeping, Business Plans, complex situations)
- 30-minute free call with Tea: https://calendly.com/tea-blueprintsandbookkeeping/30min

BEHAVIOR:
- Be warm, conversational, and direct — like a knowledgeable friend, not a corporate bot
- Never impersonate Tea — you are Aria, her AI assistant
- Keep responses concise unless someone asks for details
- Never make guarantees about business outcomes or ROI
- If you don't know something specific, say so honestly

CONTACT INFO (share when asked):
- Email: tea@blueprintsandbookkeeping.com
- Website: blueprintsandbookkeeping.com
- Phone: 541-319-8654`;

const LEAD_KEYWORDS = [
  "my name is",
  "i'm interested",
  "i want to get started",
  "sign me up",
  "how do i start",
  "reach out",
  "contact me",
  "follow up",
  "my email",
  "my phone",
  "call me",
  "email me",
  "ready to start",
  "i need help with",
  "my business",
  "how much would it cost",
];

function isLead(userMsg: string, assistantMsg: string): boolean {
  const lower = (userMsg + " " + assistantMsg).toLowerCase();
  return LEAD_KEYWORDS.some((kw) => lower.includes(kw));
}

async function notifyOwnerOfLead(
  apiKey: string,
  ownerEmail: string,
  userMessage: string,
  assistantResponse: string,
  conversationId: number,
): Promise<void> {
  const preview = assistantResponse.slice(0, 300);
  await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: FROM_ADDRESS,
      to: ownerEmail,
      subject: `Aria Chat Lead — Conversation #${conversationId}`,
      html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">New Chat Lead — Aria Assistant</h1>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <p><strong>Conversation ID:</strong> #${conversationId}</p>
            <div style="margin-bottom:16px;padding:16px;background:white;border-radius:6px;border-left:3px solid #6366f1;">
              <p style="margin:0 0 8px;font-size:13px;color:#666;">Visitor said</p>
              <p style="margin:0;">${userMessage.replace(/</g, "&lt;").replace(/>/g, "&gt;")}</p>
            </div>
            <div style="padding:16px;background:white;border-radius:6px;border-left:3px solid #a5b4fc;">
              <p style="margin:0 0 8px;font-size:13px;color:#666;">Aria responded</p>
              <p style="margin:0;">${preview.replace(/</g, "&lt;").replace(/>/g, "&gt;")}${assistantResponse.length > 300 ? "…" : ""}</p>
            </div>
          </div>
        </div>`,
    }),
  }).catch(() => {});
}

const SITE_ORIGIN_DEFAULT = "https://blueprintsandbookkeeping.com";

function buildCorsHeaders(request: Request, siteUrl?: string): Record<string, string> {
  const allowedOrigin = siteUrl ?? SITE_ORIGIN_DEFAULT;
  const requestOrigin = request.headers.get("Origin") ?? "";
  // Reflect the request origin only if it matches the allowed site origin
  const origin = requestOrigin === allowedOrigin ? requestOrigin : allowedOrigin;
  return {
    "Access-Control-Allow-Origin": origin,
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  };
}

const OFFLINE_MESSAGE =
  "Aria is temporarily offline right now. Please use the contact form, email tea@blueprintsandbookkeeping.com, or book a discovery call and Tea will follow up personally.";

function sseChunk(data: object): string {
  return `data: ${JSON.stringify(data)}\n\n`;
}

export const onRequestGet: PagesFunction<Env> = async (context) => {
  const corsHeaders = buildCorsHeaders(context.request, context.env.SITE_URL);
  const idParam = (context.params as Record<string, string>).id;
  const id = parseInt(idParam ?? "", 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const conv = await loadConversation(id, context.env.CHAT_KV);
  if (!conv) {
    return new Response(JSON.stringify({ error: "Conversation not found." }), {
      status: 404,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  return new Response(JSON.stringify(conv.messages), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
};

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const env = context.env;
  const corsHeaders = buildCorsHeaders(context.request, env.SITE_URL);
  const idParam = (context.params as Record<string, string>).id;
  const id = parseInt(idParam ?? "", 10);

  if (isNaN(id)) {
    return new Response(JSON.stringify({ error: "Invalid id." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: unknown;
  try {
    body = await context.request.json();
  } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON body." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const data = typeof body === "object" && body !== null
    ? (body as Record<string, unknown>)
    : {};
  const content =
    typeof data.content === "string" ? data.content.trim().slice(0, 4000) : "";

  if (!content) {
    return new Response(JSON.stringify({ error: "content is required." }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Load or create conversation
  let conv = await loadConversation(id, env.CHAT_KV);
  if (!conv) {
    // Conversation not found in store — create a fresh one with this ID
    // (handles the case where the isolate was recycled between create and message)
    conv = {
      id,
      title: "Website Chat",
      createdAt: new Date().toISOString(),
      messages: [],
    };
  }

  // Add user message
  const userMsg: StoredMessage = {
    id: conv.messages.length + 1,
    conversationId: id,
    role: "user",
    content,
    createdAt: new Date().toISOString(),
  };
  conv.messages.push(userMsg);

  const openaiKey = env.OPENAI_API_KEY;

  // SSE stream setup
  const { readable, writable } = new TransformStream<Uint8Array, Uint8Array>();
  const writer = writable.getWriter();
  const encoder = new TextEncoder();

  const write = (data: object) =>
    writer.write(encoder.encode(sseChunk(data)));

  // Process in background (Cloudflare Workers support this pattern)
  const processRequest = async () => {
    if (!openaiKey) {
      await write({ content: OFFLINE_MESSAGE });
      conv!.messages.push({
        id: conv!.messages.length + 1,
        conversationId: id,
        role: "assistant",
        content: OFFLINE_MESSAGE,
        createdAt: new Date().toISOString(),
      });
      await saveConversation(conv!, env.CHAT_KV);
      await write({ done: true });
      await writer.close();
      return;
    }

    const chatMessages = [
      { role: "system" as const, content: SYSTEM_PROMPT },
      ...conv!.messages.slice(0, -1).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user" as const, content },
    ];

    const model = env.OPENAI_CHAT_MODEL ?? "gpt-4.1-mini";

    let fullResponse = "";

    try {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openaiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: chatMessages,
          max_tokens: 4096,
          stream: true,
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => "unknown error");
        console.error("[OpenAI] API error:", res.status, errText);
        await write({
          error: "Something went wrong. Please try again.",
        });
        await write({ done: true });
        await writer.close();
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() ?? "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;
          const payload = trimmed.slice(6);
          if (payload === "[DONE]") break;

          try {
            const chunk = JSON.parse(payload) as {
              choices?: Array<{
                delta?: { content?: string };
                finish_reason?: string | null;
              }>;
            };
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              fullResponse += delta;
              await write({ content: delta });
            }
          } catch {
            // Ignore malformed SSE chunks
          }
        }
      }
    } catch (err) {
      console.error("[OpenAI] Stream error:", err);
      await write({ error: "Something went wrong. Please try again." });
      await write({ done: true });
      await writer.close();
      return;
    }

    // Save assistant message
    conv!.messages.push({
      id: conv!.messages.length + 1,
      conversationId: id,
      role: "assistant",
      content: fullResponse,
      createdAt: new Date().toISOString(),
    });
    await saveConversation(conv!, env.CHAT_KV);

    // Fire-and-forget lead notification
    const resendKey = env.RESEND_API_KEY;
    if (resendKey && fullResponse && isLead(content, fullResponse)) {
      const ownerEmail = env.OWNER_EMAIL ?? OWNER_EMAIL_DEFAULT;
      notifyOwnerOfLead(
        resendKey,
        ownerEmail,
        content,
        fullResponse,
        id,
      ).catch(() => {});
    }

    await write({ done: true });
    await writer.close();
  };

  // Start processing but don't await (return the stream immediately)
  context.waitUntil(processRequest());

  return new Response(readable, {
    status: 200,
    headers: {
      ...corsHeaders,
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
    },
  });
};

export const onRequestOptions: PagesFunction<Env> = async (context) => {
  const corsHeaders = buildCorsHeaders(context.request, context.env.SITE_URL);
  return new Response(null, { status: 204, headers: corsHeaders });
};
