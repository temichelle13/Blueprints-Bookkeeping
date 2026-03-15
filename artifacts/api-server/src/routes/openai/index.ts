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
const FROM_ADDRESS = "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

const SYSTEM_PROMPT = `You are Aria, the friendly AI assistant for Blueprints & Bookkeeping, LLC — a premium remote financial services firm founded by Tea Larson-Hetrick in Roseburg, Oregon.

ABOUT THE FIRM:
- Founded and operated by Tea Larson-Hetrick
- Credentials: QuickBooks ProAdvisor Gold, Certified Ethical Hacker (CEH v12), Advanced Crypto Accounting Certified, Oregon Remote Online Notary (RON)
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
Always note: "Final pricing is confirmed after a free discovery call where we can look at your books together."

SCHEDULING:
- Free 30-minute discovery calls are available at: https://calendly.com/tea-blueprintsandbookkeeping/30min
- When someone expresses interest in getting started, offer them this link.
- You can also suggest they fill out the contact form at https://blueprintsandbookkeeping.com/contact

LEAD CAPTURE & NOTIFYING TEA:
When someone is clearly interested in services or ready to move forward:
1. Offer to have Tea reach out by collecting: name, email, phone (optional), business type, and what they need
2. Confirm you'll pass their info to Tea and she'll follow up within one business day
3. Use the notify_tea function to send Tea an email with the lead details

BEHAVIOR:
- Be warm, conversational, and direct — like a knowledgeable friend, not a corporate bot
- Never impersonate Tea — you are Aria, her AI assistant
- Keep responses concise unless someone asks for details
- Lead with the most relevant info, don't dump everything at once
- If you don't know something specific, say so and offer to have Tea follow up
- Never make guarantees about business outcomes or ROI
- Always validate that running a business is hard and that having clean books makes everything easier

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

  const [conv] = await db
    .insert(conversations)
    .values({ title })
    .returning();

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

router.post("/openai/conversations/:id/messages", async (req, res): Promise<void> => {
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

  try {
    const stream = await openai.chat.completions.create({
      model: "gpt-5.2",
      max_completion_tokens: 8192,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...chatMessages,
      ],
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
    res.write(`data: ${JSON.stringify({ error: "Something went wrong. Please try again." })}\n\n`);
  }

  res.end();
});

async function checkAndNotifyTea(
  userMessage: string,
  assistantResponse: string,
  conversationId: number
): Promise<void> {
  const lowerUser = userMessage.toLowerCase();
  const lowerAssistant = assistantResponse.toLowerCase();

  const leadKeywords = [
    "my name is", "i'm interested", "i want to get started", "sign me up",
    "how do i start", "reach out", "contact me", "follow up", "my email",
    "my phone", "my number", "call me", "email me", "i'd like to", "id like to",
    "ready to start", "ready to move forward", "i need help with", "i run a",
    "my business", "how much would it cost", "what would it cost",
  ];

  const isLead = leadKeywords.some(
    (kw) => lowerUser.includes(kw) || lowerAssistant.includes(kw)
  );

  if (!isLead) return;

  const resend = getResend();
  if (!resend) return;

  const preview = assistantResponse.slice(0, 300);

  await resend.emails.send({
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
  }).catch(() => {});
}

export default router;
