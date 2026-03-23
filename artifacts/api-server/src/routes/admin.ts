import { Router, type IRouter } from "express";
import { db, contactInquiriesTable, newsletterSubscribersTable, emailSuppressionListTable, INQUIRY_STATUSES, SUPPRESSION_REASONS } from "@workspace/db";
import type { SuppressionReason } from "@workspace/db";
import { desc, eq, sql, count } from "drizzle-orm";
import { addToSuppressionList } from "../lib/email-suppression";
import { adminAuth } from "../middleware/admin-auth";

const router: IRouter = Router();

// Apply admin authentication to all routes in this router
router.use(adminAuth);

router.get("/admin/inquiries", async (_req, res): Promise<void> => {
  const inquiries = await db
    .select()
    .from(contactInquiriesTable)
    .orderBy(desc(contactInquiriesTable.createdAt));

  res.json(inquiries);
});

router.patch("/admin/inquiries/:id/status", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);
  const { status } = req.body;

  if (!INQUIRY_STATUSES.includes(status)) {
    res.status(400).json({ error: `Invalid status. Must be one of: ${INQUIRY_STATUSES.join(", ")}` });
    return;
  }

  const [updated] = await db
    .update(contactInquiriesTable)
    .set({ status })
    .where(eq(contactInquiriesTable.id, id))
    .returning();

  if (!updated) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }

  res.json(updated);
});

router.get("/admin/newsletter", async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(desc(newsletterSubscribersTable.subscribedAt));

  const activeCount = subscribers.filter((s) => s.active).length;
  const totalCount = subscribers.length;

  res.json({ subscribers, activeCount, totalCount });
});

router.get("/admin/newsletter/export", async (_req, res): Promise<void> => {
  const subscribers = await db
    .select()
    .from(newsletterSubscribersTable)
    .orderBy(desc(newsletterSubscribersTable.subscribedAt));

  const header = "id,email,signup_source,active,subscribed_at";
  const rows = subscribers.map(
    (s) => `${s.id},"${s.email}","${s.signupSource}",${s.active},"${s.subscribedAt?.toISOString() ?? ""}"`
  );
  const csv = [header, ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=newsletter_subscribers.csv");
  res.send(csv);
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [inquiryStats] = await db
    .select({ total: count() })
    .from(contactInquiriesTable);

  const statusCounts = await db
    .select({
      status: contactInquiriesTable.status,
      count: count(),
    })
    .from(contactInquiriesTable)
    .groupBy(contactInquiriesTable.status);

  const [subscriberStats] = await db
    .select({
      total: count(),
      active: sql<number>`count(*) filter (where ${newsletterSubscribersTable.active} = true)`,
    })
    .from(newsletterSubscribersTable);

  res.json({
    inquiries: {
      total: inquiryStats?.total ?? 0,
      byStatus: Object.fromEntries(statusCounts.map((s) => [s.status, s.count])),
    },
    newsletter: {
      total: subscriberStats?.total ?? 0,
      active: subscriberStats?.active ?? 0,
    },
  });
});

router.get("/admin/suppression", async (_req, res): Promise<void> => {
  const entries = await db
    .select()
    .from(emailSuppressionListTable)
    .orderBy(desc(emailSuppressionListTable.createdAt));

  res.json(entries);
});

router.post("/admin/suppression", async (req, res): Promise<void> => {
  const { email, reason } = req.body;

  if (!email || typeof email !== "string") {
    res.status(400).json({ error: "Email is required" });
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email.trim())) {
    res.status(400).json({ error: "Please provide a valid email address" });
    return;
  }

  const finalReason: SuppressionReason = SUPPRESSION_REASONS.includes(reason) ? reason : "manual";

  await addToSuppressionList(email, finalReason);

  const [entry] = await db
    .select()
    .from(emailSuppressionListTable)
    .where(eq(emailSuppressionListTable.email, email.trim().toLowerCase()))
    .limit(1);

  res.status(201).json(entry);
});

router.delete("/admin/suppression/:id", async (req, res): Promise<void> => {
  const id = parseInt(req.params.id, 10);

  if (isNaN(id)) {
    res.status(400).json({ error: "Invalid ID" });
    return;
  }

  const [deleted] = await db
    .delete(emailSuppressionListTable)
    .where(eq(emailSuppressionListTable.id, id))
    .returning();

  if (!deleted) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }

  res.json({ success: true, deleted });
});

export default router;
