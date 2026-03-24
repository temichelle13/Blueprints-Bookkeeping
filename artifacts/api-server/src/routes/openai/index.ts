import { Router, type IRouter } from "express";
import { db } from "@workspace/db";
import { conversations, messages } from "@workspace/db";
import { eq } from "drizzle-orm";
import { openai } from "@workspace/integrations-openai-ai-server";
import { Resend } from "resend";

const router: IRouter = Router();

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const CHAT_MODEL = process.env["OPENAI_CHAT_MODEL"] || "gpt-4.1-mini";
const isOpenAiConfigured = Boolean(openai);

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

GIVING ESTIMATES:
When someone describes their situation, give a helpful ballpark based on:
- Number of entities (more = higher tier)
- Whether they have crypto assets (Advanced tier)
- Whether they need SBA/investor-ready financials (Business Plans: SBA/Investor Ready)
- Complexity of their operations
Always note that final pricing is confirmed once Tea reviews the books, but give them a real range so they can plan.

HOW PEOPLE CAN GET STARTED — offer the RIGHT path for their situation:

There are four ways to get started. Match the recommendation to what they describe:

PATH 1 — SIGN UP ONLINE (best for: Essentials or Growth bookkeeping, ready to start now)
- They can sign up directly at: https://blueprintsandbookkeeping.com/pricing
- Secure Stripe checkout, then a short intake form
- Contracts sent automatically via Adobe Sign — no calls required
- Full onboarding done in a single website visit
- Recommend this when someone knows they want Essentials or Growth and is ready to move

PATH 2 — ALREADY HAVE QUICKBOOKS? (best for: existing QBO users)
- If they're already on QuickBooks Online, Tea connects directly to their existing company file — no migration
- They fill out an intake form at: https://blueprintsandbookkeeping.com/onboarding
- Tea then sends a QuickBooks accountant invitation — they accept it in their QBO account (takes 2 minutes)
- Then contracts are sent via Adobe Sign
- Recommend this when someone mentions they already have QuickBooks set up

PATH 3 — JUST LEAVE YOUR INFO (best for: not ready to commit, want a human to reach out)
- Offer to collect their name, email, and what they need — Tea will personally follow up within one business day
- No call required. No commitment. They can describe their situation in a few sentences and Tea will respond.
- Use this when someone wants more info before deciding, or prefers not to book a call
- You can also send them to: https://blueprintsandbookkeeping.com/contact

PATH 4 — BOOK A DISCOVERY CALL (best for: Advanced bookkeeping, Business Plans, complex or multi-entity situations)
- 30-minute free call with Tea: https://calendly.com/tea-blueprintsandbookkeeping/30min
- Best when the situation is complex: multiple entities, crypto, SBA loan, or a custom business plan
- Recommend this when Essentials/Growth clearly won't cover their needs

IMPORTANT — NEVER push a discovery call as the only option. Most people can start without a call. 
Default to PATH 1 (sign up online) or PATH 3 (leave info) for simple situations. Reserve PATH 4 for complex cases.

CLIENT PORTAL (for existing clients):
- Do not send clients to a website upload portal
- If documents are needed, tell them Tea will provide secure file-sharing instructions separately
- Contracts are signed via Adobe Acrobat Sign (sent automatically after onboarding)
- QuickBooks is where Tea does the actual bookkeeping work — in their account

LEAD CAPTURE — when someone wants Tea to reach out:
1. Ask for: name, email, business type, and what they're looking for
2. Tell them Tea will follow up within one business day
3. Their info will be sent to Tea automatically

BEHAVIOR:
- Be warm, conversational, and direct — like a knowledgeable friend, not a corporate bot
- Never impersonate Tea — you are Aria, her AI assistant
- Keep responses concise unless someone asks for details
- Present options as choices, not a funnel — respect that people know what they want
- If someone says "I just want to sign up" — direct them to /pricing immediately
- If someone says "I already use QuickBooks" — direct them to /onboarding immediately
- If someone says "just have someone reach out" — collect their info right now in the chat
- Never make guarantees about business outcomes or ROI
- If you don't know something specific, say so honestly

CONTACT INFO (share when asked):
- Email: tea@blueprintsandbookkeeping.com
- Website: blueprintsandbookkeeping.com
- Phone: 541-319-8654`;

router.post("/openai/conversations", async (req, res): Promise<void> => {
  const { title } = req.body;
  if (!title || typeof title !== "string") {
    res.status(400).json({ error: "title is required" });
    return;
  }

  const [conv] = await db.insert(conversations).values({ title }).returning();

  res.status(201).json({
    id: conv.id,
    title: conv.title,
    createdAt: conv.createdAt,
  });
});

router.get("/openai/conversations/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
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

router.post(
  "/openai/conversations/:id/messages",
  async (req, res): Promise<void> => {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "Invalid id" });
      return;
    }

    const { content } = req.body;
    if (!content || typeof content !== "string") {
      res.status(400).json({ error: "content is required" });
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

    await db.insert(messages).values({
      conversationId: id,
      role: "user",
      content,
    });

    const history = await db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, id));

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
        max_completion_tokens: 4096,
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

      await checkAndNotifyTea(content, fullResponse, id);

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
  const lowerUser = userMessage.toLowerCase();
  const lowerAssistant = assistantResponse.toLowerCase();

  const leadKeywords = [
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

  const isLead = leadKeywords.some(
    (kw) => lowerUser.includes(kw) || lowerAssistant.includes(kw),
  );

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
