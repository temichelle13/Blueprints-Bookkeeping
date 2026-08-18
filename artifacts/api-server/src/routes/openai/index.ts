import { Router, type IRouter } from "express";
import { db, pool } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { Resend } from "resend";
import {
  createOpenAiConversationLimiter,
  createOpenAiMessageLimiter,
  recordOpenAiRequestVolume,
  validateConversationMessageCap,
  validateOpenAiMessageContent,
} from "./guards";

const router: IRouter = Router();
const openAiConversationLimiter = createOpenAiConversationLimiter();
const openAiMessageLimiter = createOpenAiMessageLimiter();

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const CHAT_MODEL = process.env["OPENAI_CHAT_MODEL"] || "gpt-4.1-mini";
const CHAT_RESPONSE_TOKEN_LIMIT = 4096;
const USES_MAX_COMPLETION_TOKENS = /^o\d+(?:-|$)/.test(CHAT_MODEL);
const isOpenAiConfigured = Boolean(openai);

function hasOpenAiApiKey(): boolean {
  return Boolean(
    process.env["AI_INTEGRATIONS_OPENAI_API_KEY"] ||
    process.env["OPENAI_API_KEY"],
  );
}

async function getAriaReadiness() {
  let dbStatus: "ok" | "error" = "error";
  try {
    await pool.query("SELECT 1");
    dbStatus = "ok";
  } catch {
    dbStatus = "error";
  }

  const integrationStatus = isOpenAiConfigured ? "ok" : "missing";
  const envStatus = hasOpenAiApiKey() ? "ok" : "missing";
  const ready =
    integrationStatus === "ok" && envStatus === "ok" && dbStatus === "ok";

  return {
    status: ready ? "ok" : "degraded",
    ready,
    dependencies: {
      openai: integrationStatus,
      environment: envStatus,
      db: dbStatus,
    },
    timestamp: new Date().toISOString(),
  };
}

export const LEAD_KEYWORDS: readonly string[] = [
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
  "my number",
  "call me",
  "email me",
  "i'd like to",
  "id like to",
  "ready to start",
  "ready to move forward",
  "i need help with",
  "i run a",
  "my business",
  "how much would it cost",
  "what would it cost",
];

router.get("/openai/health", async (_req, res): Promise<void> => {
  const payload = await getAriaReadiness();
  res.status(payload.ready ? 200 : 503).json(payload);
});

export function isLeadMessage(
  userMessage: string,
  assistantResponse: string,
): boolean {
  const lowerUser = userMessage.toLowerCase();
  const lowerAssistant = assistantResponse.toLowerCase();

  return LEAD_KEYWORDS.some(
    (kw) => lowerUser.includes(kw) || lowerAssistant.includes(kw),
  );
}

function parseConversationId(value: string | string[] | undefined): number {
  if (Array.isArray(value)) {
    if (value.length !== 1) return NaN;
    return parseConversationId(value[0]);
  }
  if (value === undefined || !/^\d+$/.test(value)) return NaN;
  const n = Number.parseInt(value, 10);
  return Number.isSafeInteger(n) ? n : NaN;
}

const SYSTEM_PROMPT = `You are Aria, the friendly AI assistant for Blueprints & Bookkeeping, LLC — a premium remote bookkeeping and business planning firm founded by Tea Larson-Hetrick in Roseburg, Oregon.

ABOUT THE FIRM:
- Founded and operated by Tea Larson-Hetrick
- Credentials: QuickBooks ProAdvisor Gold, Certified Ethical Hacker (CEH v12), Intuit Cryptocurrency Tax Certified
- Intentionally capped at 20 active clients so every client gets focused, personalized attention
- Remote-first, serving businesses across the United States
- IMPORTANT: Keep professional scope accurate without over-emphasizing disclaimers. Do not claim Blueprints & Bookkeeping is a CPA firm, public accounting firm, law firm, auditor, investment adviser, Enrolled Agent, or unlimited tax representative. If asked about tax-related work, explain that business support may be available depending on the project, while website/chat content is not legal, investment, or individualized tax advice.

SERVICES & PRICING:

1. ADVANCED BOOKKEEPING (ongoing monthly service — one of the two core services)
   - Essentials: starting at $500/month, or starting at $5,400/year when annual billing is selected
     * Single entity
     * Up to 200 transactions/month
     * Monthly reconciliation and close
     * QuickBooks Online management
     * Monthly P&L and balance sheet
     * Email support
     * Best for: a single-entity business with straightforward transactions
   - Growth: starting at $900/month, or starting at $9,720/year when annual billing is selected
     * Up to 2 entities
     * Up to 600 transactions/month
     * Rule-based QBO automation
     * Niche reconciliation, including crypto, agriculture, and timber
     * Monthly financials plus cash flow report
     * Proactive advisory communication and priority response
     * Best for: growing businesses with higher volume, multiple accounts, or niche complexity
   - Advanced: custom pricing
     * 3+ entities or complex structures
     * Unlimited transaction volume
     * Intercompany and consolidated reporting
     * Historical cleanup included
     * Full suite of financial statements
     * Dedicated point of contact
     * Monthly strategy check-in
     * Best for: multi-entity structures, high-volume operations, and complex consolidations
   - A mandatory Technology & Security Surcharge of $50/month applies to all bookkeeping tiers.
   - Final monthly rate is based on transaction volume, number of entities, and niche complexity such as crypto, agriculture, multi-currency, or other specialized workflows. All quotes are flat-fee, not surprise hourly billing.

2. BUSINESS PLANS (project-based service — one of the two core services)
   - Startup Roadmap: starting at $2,500
     * 3-year financial forecast
     * Market overview and opportunity summary
     * Basic competitor landscape
     * Executive summary and narrative
     * Standard formatting
     * 1 revision round
     * Best for: early-stage businesses seeking internal clarity or initial bank conversations
   - Full Plan Package: starting at $4,000+
     * 5-year rigorous financial model
     * Professional plan formatting
     * Deep market research and analysis
     * Full competitor positioning
     * Burn rate and sensitivity analysis
     * Executive summary, narrative, and appendix
     * 2 revision rounds
     * Best for: comprehensive, in-depth business plans with detailed financial modeling, market research, and full strategic narrative
   - Most business plans are delivered within 2–4 weeks from a completed onboarding call. Rush timelines may be available and should be discussed on a discovery call.

3. THE DIGITAL HANDSHAKE (add-on only — never a standalone or core service)
   - $1,500–$3,500+
   - A custom static website delivery format for packaging a business plan as a polished web presence
   - Available only alongside a Business Plan engagement, not as a standalone website service

GIVING ESTIMATES:
When someone describes their situation, give a helpful ballpark based on:
- Number of entities (single entity = Essentials, up to 2 entities = Growth, 3+ entities or complex structures = Advanced)
- Transaction volume (up to 200/month = Essentials, up to 600/month = Growth, unlimited or high-volume = Advanced)
- Whether they have niche complexity such as crypto, agriculture, timber, multi-currency, or complex reconciliation needs
- Whether they need a Startup Roadmap or a Full Plan Package
Always use "starting at" phrasing, mention the $50/month Technology & Security Surcharge for bookkeeping, and note that final pricing is confirmed once Tea reviews the situation. Do not present rates as guaranteed flat/fixed prices.

HOW PEOPLE CAN GET STARTED — keep guidance aligned with https://blueprintsandbookkeeping.com/get-started:

There are four ways to get started. Match the recommendation to what they describe:

PATH 1 — BOOK A CALL (best for: new prospects who want to talk through fit, pricing, scope, or next steps)
- Send them to: https://blueprintsandbookkeeping.com/get-started or https://blueprintsandbookkeeping.com/schedule
- The /schedule page embeds Calendly for the standard 30-minute introductory/discovery call
- The direct Calendly URL is: https://calendly.com/tea-blueprintsandbookkeeping/30min
- Recommend this for Advanced bookkeeping, Business Plans, complex or multi-entity situations, or anyone who is not sure which plan fits

PATH 2 — VIDEO CHAT (best for: people who specifically prefer a direct video-call booking link)
- Send them to the direct 30-minute Calendly link: https://calendly.com/tea-blueprintsandbookkeeping/30min
- This is the same standard non-emergency discovery/introductory scheduling flow

PATH 3 — EMERGENCY / EXPEDITED REQUEST (best for: urgent lender, investor, filing-pressure, or time-sensitive review needs)
- Send them to: https://calendly.com/tea-blueprintsandbookkeeping/emergency-or-other-expedited-request
- This is a 15-minute emergency/expedited slot and may be used by clients or non-clients
- Do not present it as tax advice, tax filing help, or tax planning; keep the tax-services boundary clear

PATH 4 — ADD ME AS YOUR ACCOUNTANT (best for: existing QuickBooks Online users who want Tea to review and possibly work in their QBO file)
- Send them to: https://blueprintsandbookkeeping.com/get-started and choose "Add Me as Your Accountant"
- Current site flow starts intake through the contact path for bookkeeping intent, then Tea reviews the request before accepting any QBO accountant invitation
- If they ask how to invite Tea in QBO: open QuickBooks Online, go to Manage users or Users, choose the accountant/accounting professional invitation option, enter tea@blueprintsandbookkeeping.com, and send the invitation
- Make clear that Tea accepts the invitation only after initial intake, review, agreement on scope/costs, and contracts as applicable

IMPORTANT — Do not claim clients can complete immediate self-service signup, Stripe checkout, or no-call automated onboarding from pricing unless the website explicitly offers that in the current flow. Current pricing CTAs route toward contact/scheduling and say payment/invoicing options are confirmed during onboarding.

CLIENT PORTAL / DOCUMENTS (for existing clients):
- Do not send clients to a website upload portal
- If documents are needed, tell them Tea will provide secure file-sharing instructions separately
- Contracts may be handled through Adobe Acrobat Sign / Adobe Sign where applicable
- QuickBooks is where Tea does the actual bookkeeping work — in the client's account after approved access

LEAD CAPTURE — when someone wants Tea to reach out:
1. Ask for: name, email, business type, and what they're looking for
2. Tell them Tea will follow up within one business day
3. Their info will be sent to Tea automatically
4. They can also use: https://blueprintsandbookkeeping.com/contact

BEHAVIOR:
- Be warm, conversational, and direct — like a knowledgeable friend, not a corporate bot
- Never impersonate Tea — you are Aria, her AI assistant
- Keep responses concise unless someone asks for details
- Present options as choices, not a funnel — respect that people know what they want
- If someone says "I just want to get started" — direct them to /get-started
- If someone says "I want pricing" — direct them to /pricing and summarize the current starting-at tiers accurately
- If someone says "I already use QuickBooks" — direct them to /get-started and the "Add Me as Your Accountant" path
- If someone says "just have someone reach out" — collect their info right now in the chat
- Never make guarantees about business outcomes, funding, lending approval, ROI, tax results, or compliance outcomes
- If you don't know something specific, say so honestly and offer the most relevant next step

CONTACT INFO (share when asked):
- Email: tea@blueprintsandbookkeeping.com
- Website: blueprintsandbookkeeping.com
- Phone: 541-319-8654`;

router.post(
  "/openai/conversations",
  openAiConversationLimiter,
  async (req, res): Promise<void> => {
    recordOpenAiRequestVolume({ routeId: "conversation_create", req });
    const { title } = req.body;
    if (!title || typeof title !== "string") {
      res.status(400).json({ error: "title is required" });
      return;
    }

    const [conv] = await db.insert(conversations).values({ title }).returning();

    if (!conv) {
      res.status(500).json({ error: "Failed to create conversation" });
      return;
    }

    res.status(201).json({
      id: conv.id,
      title: conv.title,
      createdAt: conv.createdAt,
    });
  },
);

router.get("/openai/conversations", async (_req, res): Promise<void> => {
  const allConversations = await db.select().from(conversations);

  res.json(
    allConversations.map((conversation) => ({
      id: conversation.id,
      title: conversation.title,
      createdAt: conversation.createdAt,
    })),
  );
});

router.get("/openai/conversations/:id", async (req, res): Promise<void> => {
  const id = parseConversationId(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [conv] = await db
    .select()
    .from(conversations)
    .where(eq(conversations.id, id));

  if (!conv) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  const msgs = await db
    .select()
    .from(messages)
    .where(eq(messages.conversationId, id));

  res.json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt,
    messages: msgs.map((m) => ({
      id: m.id,
      conversationId: m.conversationId,
      role: m.role,
      content: m.content,
      createdAt: m.createdAt,
    })),
  });
});

router.delete("/openai/conversations/:id", async (req, res): Promise<void> => {
  const id = parseConversationId(req.params.id);
  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid id" });
    return;
  }

  const [deletedConversation] = await db
    .delete(conversations)
    .where(eq(conversations.id, id))
    .returning({ id: conversations.id });

  if (!deletedConversation) {
    res.status(404).json({ error: "Conversation not found" });
    return;
  }

  res.status(204).send();
});

router.get(
  "/openai/conversations/:id/messages",
  async (req, res): Promise<void> => {
    const id = parseConversationId(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const [conv] = await db
      .select({ id: conversations.id })
      .from(conversations)
      .where(eq(conversations.id, id));

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const convMessages = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id));

    res.json(
      convMessages.map((message) => ({
        id: message.id,
        conversationId: message.conversationId,
        role: message.role,
        content: message.content,
        createdAt: message.createdAt,
      })),
    );
  },
);

router.post(
  "/openai/conversations/:id/messages",
  openAiMessageLimiter,
  async (req, res): Promise<void> => {
    const id = parseConversationId(req.params.id);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const { content } = req.body;
    const messageValidationError = validateOpenAiMessageContent(content);
    if (messageValidationError) {
      res.status(400).json(messageValidationError);
      return;
    }

    const userContent = content as string;

    const [conv] = await db
      .select()
      .from(conversations)
      .where(eq(conversations.id, id));

    if (!conv) {
      res.status(404).json({ error: "Conversation not found" });
      return;
    }

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id));

    recordOpenAiRequestVolume({
      routeId: "message_send",
      req,
      conversationId: id,
    });

    const capError = validateConversationMessageCap(history.length);
    if (capError) {
      res.status(429).json(capError);
      return;
    }

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content: userContent,
    });

    history.push({
      id: -1,
      conversationId: id,
      role: "user",
      content: userContent,
      createdAt: new Date(),
    });

    const chatMessages = history.map((m) => ({
      role: m.role as "user" | "assistant" | "system",
      content: m.content,
    }));

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    let fullResponse = "";

    if (!isOpenAiConfigured || !openai) {
      const fallback =
        "Aria is temporarily offline right now. Please use the contact form, email tea@blueprintsandbookkeeping.com, or book a discovery call and Tea will follow up personally.";
      res.write(`data: ${JSON.stringify({ content: fallback })}

`);
      await db.insert(messages).values({
        conversationId: id,
        role: "assistant",
        content: fallback,
      });
      res.write(`data: ${JSON.stringify({ done: true })}

`);
      res.end();
      return;
    }

    try {
      const stream = await openai.chat.completions.create({
        model: CHAT_MODEL,
        ...(USES_MAX_COMPLETION_TOKENS
          ? { max_completion_tokens: CHAT_RESPONSE_TOKEN_LIMIT }
          : { max_tokens: CHAT_RESPONSE_TOKEN_LIMIT }),
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...chatMessages],
        stream: true,
      });

      for await (const chunk of stream) {
        const delta = chunk.choices[0]?.delta?.content;
        if (delta) {
          fullResponse += delta;
          res.write(`data: ${JSON.stringify({ content: delta })}\n\n`);
        }
      }

      await db.insert(messages).values({
        conversationId: id,
        role: "assistant",
        content: fullResponse,
      });

      await checkAndNotifyTea(userContent, fullResponse, id);

      res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    } catch (err) {
      console.error("Chat error:", err);
      res.write(
        `data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\n`,
      );
    }

    res.end();
  },
);

async function checkAndNotifyTea(
  userMessage: string,
  assistantResponse: string,
  conversationId: number,
): Promise<void> {
  const isLead = isLeadMessage(userMessage, assistantResponse);

  if (!isLead) return;

  const resend = getResend();
  if (!resend) return;

  const preview = assistantResponse.slice(0, 300);

  await resend.emails
    .send({
      from: FROM_ADDRESS,
      to: OWNER_EMAIL,
      subject: `Aria Chat Lead — Conversation #${conversationId}`,
      html: `
      <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
        <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
          <h1 style="color:white;margin:0;font-size:20px;">New Chat Lead — Aria Assistant</h1>
        </div>
        <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
          <p style="margin:0 0 16px;"><strong>Conversation ID:</strong> #${conversationId}</p>
          <div style="margin-bottom:16px;padding:16px;background:white;border-radius:6px;border-left:3px solid #6366f1;">
            <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Visitor said</p>
            <p style="margin:0;line-height:1.6;">${userMessage}</p>
          </div>
          <div style="padding:16px;background:white;border-radius:6px;border-left:3px solid #a5b4fc;">
            <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Aria responded</p>
            <p style="margin:0;line-height:1.6;">${preview}${assistantResponse.length > 300 ? "…" : ""}</p>
          </div>
          <p style="margin-top:24px;font-size:13px;color:#999;">This visitor appears to be interested in your services. Consider reaching out directly.</p>
        </div>
      </div>`,
    })
    .catch(() => {});
}

export default router;
