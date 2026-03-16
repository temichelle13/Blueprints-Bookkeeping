import { Router, type IRouter, type Request, type Response, type NextFunction } from "express";
import { db, contactInquiriesTable, newsletterSubscribersTable, INQUIRY_STATUSES } from "@workspace/db";
import { desc, eq, sql, count } from "drizzle-orm";

const router: IRouter = Router();

function adminAuth(req: Request, res: Response, next: NextFunction): void {
  const token = req.headers["x-admin-token"];
  const expected = process.env["ADMIN_TOKEN"];

  if (!expected) {
    res.status(503).json({ error: "Admin access not configured. Set ADMIN_TOKEN environment variable." });
    return;
  }

  if (token !== expected) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  next();
}

router.use("/admin", adminAuth);

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

export default router;
