import { Router, type IRouter } from "express";
import { db, contactInquiriesTable } from "@workspace/db";
import { SubmitContactFormBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/contact", async (req, res): Promise<void> => {
  const parsed = SubmitContactFormBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const data = parsed.data;

  const [inquiry] = await db
    .insert(contactInquiriesTable)
    .values({
      formType: data.formType,
      name: data.name,
      email: data.email,
      phone: data.phone ?? null,
      message: data.message ?? null,
      businessName: data.businessName ?? null,
      industry: data.industry ?? null,
      servicesInterested: data.servicesInterested ?? null,
      monthlyRevenueRange: data.monthlyRevenueRange ?? null,
      biggestChallenge: data.biggestChallenge ?? null,
      preferredContactMethod: data.preferredContactMethod ?? null,
    })
    .returning();

  res.status(201).json({
    success: true,
    message: "Thank you for your inquiry! We will be in touch within 48 hours.",
    id: inquiry.id,
  });
});

export default router;
