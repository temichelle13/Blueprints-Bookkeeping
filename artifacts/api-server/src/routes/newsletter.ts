import { Router, type IRouter } from "express";
import { db, newsletterSubscribersTable } from "@workspace/db";
import { SubscribeNewsletterBody, UnsubscribeNewsletterBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_EMAIL_LENGTH = 320;

function isValidEmail(email: string): boolean {
  return email.length <= MAX_EMAIL_LENGTH && EMAIL_RE.test(email);
}

const router: IRouter = Router();

router.post("/newsletter/subscribe", async (req, res): Promise<void> => {
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
    if (!existing[0].active) {
      await db
        .update(newsletterSubscribersTable)
        .set({ active: true, signupSource })
        .where(eq(newsletterSubscribersTable.email, email));
    }
    res.status(201).json({
      success: true,
      message: "You're subscribed! Thank you for signing up.",
    });
    return;
  }

  await db.insert(newsletterSubscribersTable).values({
    email,
    signupSource,
  });

  res.status(201).json({
    success: true,
    message: "You're subscribed! Thank you for signing up.",
  });
});

router.post("/newsletter/unsubscribe", async (req, res): Promise<void> => {
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

  res.status(200).json({
    success: true,
    message: "You have been unsubscribed. We're sorry to see you go.",
  });
});

export default router;
