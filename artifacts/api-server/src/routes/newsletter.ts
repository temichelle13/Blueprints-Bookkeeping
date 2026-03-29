import { Router, type IRouter } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";
import {
  SubscribeNewsletterBody,
  UnsubscribeNewsletterBody,
} from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { Resend } from "resend";
import {
  isEmailSuppressed,
  addToSuppressionList,
} from "../lib/email-suppression";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

type UnsubscribeByTokenResult =
  | { status: 200; body: { success: true; message: string } }
  | { status: 400; body: { error: string } }
  | { status: 404; body: { error: string } };

async function unsubscribeByToken(
  token: unknown,
): Promise<UnsubscribeByTokenResult> {
  if (!token || typeof token !== "string") {
    return { status: 400, body: { error: "Missing or invalid token." } };
  }
  if (!UUID_RE.test(token)) {
    return { status: 400, body: { error: "Invalid token format." } };
  }

  const rows = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.unsubscribeToken, token))
    .limit(1);

  if (rows.length === 0) {
    return { status: 404, body: { error: "Subscriber not found." } };
  }

  await db
    .update(newsletterSubscribersTable)
    .set({ active: false })
    .where(eq(newsletterSubscribersTable.unsubscribeToken, token));

  await addToSuppressionList(rows[0]!.email, "unsubscribed");

  return {
    status: 200,
    body: {
      success: true,
      message: "You have been unsubscribed. We're sorry to see you go.",
    },
  };
}

function buildWelcomeEmail(unsubscribeToken: string): {
  html: string;
  headers: Record<string, string>;
} {
  const unsubscribePageUrl = `https://blueprintsandbookkeeping.com/unsubscribe?token=${unsubscribeToken}`;
  const unsubscribeApiUrl = `https://blueprintsandbookkeeping.com/api/newsletter/unsubscribe?token=${unsubscribeToken}`;
  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
      <div style="background:#6366f1;padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">Welcome to Blueprints & Bookkeeping</h1>
      </div>
      <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
        <p>Hi there,</p>
        <p>Thanks for subscribing. You're on the list for founder-focused bookkeeping insights, business planning guidance, and practical updates from Blueprints &amp; Bookkeeping.</p>
        <p>I'm Tea — founder of Blueprints & Bookkeeping LLC. I specialize in advanced bookkeeping and business planning for small businesses and growing teams.</p>
        <p>What to expect from this newsletter:</p>
        <ul style="line-height:1.8;">
          <li>Practical financial insights for founders and small business owners</li>
          <li>Real talk on bookkeeping systems, cash flow, and business planning</li>
          <li>No fluff. No tax advice. Just actionable guidance.</li>
        </ul>
        <p>If you have a question or want to talk about your business, you can <a href="https://blueprintsandbookkeeping.com/schedule" style="color:#6366f1;">book a free discovery call</a> anytime.</p>
        <p>Talk soon,</p>
        <p style="font-weight:600;">Tea Larson-Hetrick<br><span style="font-weight:normal;color:#666;">Blueprints & Bookkeeping LLC · Roseburg, Oregon</span></p>
        <hr style="border:none;border-top:1px solid #e2e5f0;margin:24px 0;">
        <p style="font-size:12px;color:#999;">You're receiving this because you signed up at blueprintsandbookkeeping.com. <a href="${unsubscribePageUrl}" style="color:#6366f1;">Unsubscribe anytime.</a></p>
      </div>
    </div>`;
  return {
    html,
    headers: {
      "List-Unsubscribe": `<${unsubscribeApiUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

async function sendWelcomeEmail(
  resend: Resend,
  email: string,
  unsubscribeToken: string,
): Promise<void> {
  const { html, headers } = buildWelcomeEmail(unsubscribeToken);
  await resend.emails
    .send({
      from: FROM_ADDRESS,
      to: email,
      subject: "Welcome to Blueprints & Bookkeeping",
      html,
      headers,
    })
    .catch((err: unknown) => {
      console.error(
        "[Resend] Welcome email failed for",
        email,
        "—",
        err instanceof Error ? err.message : String(err),
      );
    });
}

const router: IRouter = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
  if (req.body?.website) {
    res.status(201).json({
      success: true,
      message: "You're subscribed! Thank you for signing up.",
    });
    return;
  }

  const parsed = SubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { signupSource } = parsed.data;
  const email = parsed.data.email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  const existing = await db
    .select()
    .from(newsletterSubscribersTable)
    .where(eq(newsletterSubscribersTable.email, email))
    .limit(1);

  if (existing.length > 0) {
    const existingEntry = existing[0]!;
    if (!existingEntry.active) {
      await db
        .update(newsletterSubscribersTable)
        .set({ active: true, signupSource })
        .where(eq(newsletterSubscribersTable.email, email));

      const suppressed = await isEmailSuppressed(email);
      if (suppressed) {
        console.warn(
          "[Newsletter] Skipping welcome email for reactivated subscriber — address is suppressed:",
          email,
        );
      } else {
        const resend = getResend();
        if (resend) {
          await sendWelcomeEmail(resend, email, existingEntry.unsubscribeToken);
        }
      }
    }
    res.status(201).json({
      success: true,
      message: "You're subscribed! Thank you for signing up.",
    });
    return;
  }

  const [inserted] = await db
    .insert(newsletterSubscribersTable)
    .values({
      email,
      signupSource,
    })
    .returning({
      unsubscribeToken: newsletterSubscribersTable.unsubscribeToken,
    });

  const suppressed = await isEmailSuppressed(email);
  if (suppressed) {
    console.warn(
      "[Newsletter] Skipping welcome email — address is suppressed:",
      email,
    );
    res.status(201).json({
      success: true,
      message: "You're subscribed! Thank you for signing up.",
    });
    return;
  }

  const resend = getResend();
  if (resend && inserted) {
    await sendWelcomeEmail(resend, email, inserted.unsubscribeToken);
  } else {
    console.warn(
      "[Newsletter] RESEND_API_KEY not set — skipping welcome email for",
      email,
    );
  }

  res.status(201).json({
    success: true,
    message: "You're subscribed! Thank you for signing up.",
  });
});

router.get("/newsletter/unsubscribe", async (req, res): Promise<void> => {
  const result = await unsubscribeByToken(req.query.token);
  res.status(result.status).json(result.body);
});

router.post("/newsletter/unsubscribe", async (req, res): Promise<void> => {
  if (req.query.token) {
    const result = await unsubscribeByToken(req.query.token);
    res.status(result.status).json(result.body);
    return;
  }

  const parsed = UnsubscribeNewsletterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const email = parsed.data.email.trim().toLowerCase();

  if (!isValidEmail(email)) {
    res.status(400).json({ error: "Please provide a valid email address." });
    return;
  }

  await db
    .update(newsletterSubscribersTable)
    .set({ active: false })
    .where(eq(newsletterSubscribersTable.email, email));

  await addToSuppressionList(email, "unsubscribed");

  res.status(200).json({
    success: true,
    message: "You have been unsubscribed. We're sorry to see you go.",
  });
});

export default router;
