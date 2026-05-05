import { Router, type IRouter } from "express";
import {
  ContactInquiryModel,
  NewsletterSubscriberModel,
  EmailSuppressionModel,
  INQUIRY_STATUSES,
  SUPPRESSION_REASONS,
} from "@workspace/db";
import type { SuppressionReason } from "@workspace/db";
import { addToSuppressionList } from "../lib/email-suppression";
import { getSchedulerHealth } from "../lib/scheduler-health";
import { getOutboundEmailAdminCounts } from "../lib/outbound-email-events";
import { adminAuth } from "../middleware/admin-auth";

const router: IRouter = Router();

// Apply admin authentication to all routes in this router
router.use(adminAuth);

router.get("/admin/inquiries", async (_req, res): Promise<void> => {
  const inquiries = await ContactInquiryModel.find()
    .sort({ createdAt: -1 })
    .lean();

  res.json(inquiries);
});

router.patch("/admin/inquiries/:id/status", async (req, res): Promise<void> => {
  const id = req.params.id;
  const { status } = req.body;

  if (!INQUIRY_STATUSES.includes(status)) {
    res.status(400).json({
      error: `Invalid status. Must be one of: ${INQUIRY_STATUSES.join(", ")}`,
    });
    return;
  }

  const updated = await ContactInquiryModel.findByIdAndUpdate(
    id,
    { status },
    { new: true },
  ).lean();

  if (!updated) {
    res.status(404).json({ error: "Inquiry not found" });
    return;
  }

  res.json(updated);
});

router.get("/admin/newsletter", async (_req, res): Promise<void> => {
  const subscribers = await NewsletterSubscriberModel.find()
    .sort({ subscribedAt: -1 })
    .lean();

  const activeCount = subscribers.filter((s) => s.active).length;
  const totalCount = subscribers.length;

  res.json({ subscribers, activeCount, totalCount });
});

router.get("/admin/newsletter/export", async (_req, res): Promise<void> => {
  const subscribers = await NewsletterSubscriberModel.find()
    .sort({ subscribedAt: -1 })
    .lean();

  const header = "id,email,signup_source,active,subscribed_at";
  const rows = subscribers.map(
    (s) =>
      `${String(s._id)},"${s.email}","${s.signupSource}",${s.active},"${s.subscribedAt?.toISOString() ?? ""}"`,
  );
  const csv = [header, ...rows].join("\n");

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=newsletter_subscribers.csv",
  );
  res.send(csv);
});

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const totalInquiries = await ContactInquiryModel.countDocuments();
  const statusAgg = await ContactInquiryModel.aggregate<{
    _id: string;
    count: number;
  }>([{ $group: { _id: "$status", count: { $sum: 1 } } }]);

  const totalSubscribers = await NewsletterSubscriberModel.countDocuments();
  const activeSubscribers = await NewsletterSubscriberModel.countDocuments({
    active: true,
  });

  const emailDelivery = await getOutboundEmailAdminCounts();

  res.json({
    inquiries: {
      total: totalInquiries,
      byStatus: Object.fromEntries(statusAgg.map((s) => [s._id, s.count])),
    },
    newsletter: {
      total: totalSubscribers,
      active: activeSubscribers,
    },
    emailDelivery,
    schedulers: getSchedulerHealth(),
  });
});

router.get("/admin/suppression", async (_req, res): Promise<void> => {
  const entries = await EmailSuppressionModel.find()
    .sort({ createdAt: -1 })
    .lean();

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

  const finalReason: SuppressionReason = SUPPRESSION_REASONS.includes(reason)
    ? reason
    : "manual";

  await addToSuppressionList(email, finalReason);

  const entry = await EmailSuppressionModel.findOne({
    email: email.trim().toLowerCase(),
  }).lean();

  res.status(201).json(entry);
});

router.delete("/admin/suppression/:id", async (req, res): Promise<void> => {
  const id = req.params.id;

  const deleted = await EmailSuppressionModel.findByIdAndDelete(id).lean();

  if (!deleted) {
    res.status(404).json({ error: "Entry not found" });
    return;
  }

  res.json({ success: true, deleted });
});

export default router;
