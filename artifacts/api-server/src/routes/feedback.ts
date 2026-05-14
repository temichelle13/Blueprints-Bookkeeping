import { Router, type IRouter } from "express";
import { Resend } from "resend";
import {
  createSubmissionRateLimiter,
  enforceMaxLength,
  honeypotProtection,
  turnstileProtection,
  validateEmailStrict,
  validateHttpUrlStrict,
  withSubmissionMonitoring,
} from "../middleware/public-submissions";

const router: IRouter = Router();

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

const OWNER_EMAIL = "tea@blueprintsandbookkeeping.com";
const FROM_ADDRESS =
  "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

const CATEGORIES: Record<string, string> = {
  bug: "Bug / Something Broken",
  suggestion: "Suggestion",
  content: "Content Issue",
  other: "Other",
};

const feedbackLimiter = createSubmissionRateLimiter({
  routeId: "feedback",
  windowMs: 10 * 60 * 1000,
  max: 12,
});

router.post(
  "/feedback",
  feedbackLimiter,
  honeypotProtection("feedback"),
  turnstileProtection({
    routeId: "feedback",
    required: true,
    action: "lead_form",
  }),
  withSubmissionMonitoring("feedback"),
  async (req, res): Promise<void> => {
    if (
      !enforceMaxLength("feedback", req, res, [
        { key: "name", max: 120 },
        { key: "email", max: 320 },
        { key: "page", max: 2048 },
        { key: "category", max: 40 },
        { key: "description", max: 3000, required: true },
      ])
    ) {
      return;
    }

    const { name, email, page, category, description } = req.body;

    if (
      !description ||
      typeof description !== "string" ||
      description.trim().length < 5
    ) {
      res
        .status(400)
        .json({ error: "Please describe the issue in at least a few words." });
      return;
    }

    const categoryLabel = CATEGORIES[category] ?? category ?? "Not specified";
    const nameSafe =
      typeof name === "string" && name.trim() ? name.trim() : "Anonymous";
    const emailSafe =
      typeof email === "string" && email.trim()
        ? validateEmailStrict(email)
        : null;
    if (typeof email === "string" && email.trim() && !emailSafe) {
      res.status(400).json({ error: "Please provide a valid email address." });
      return;
    }

    const pageSafeRaw =
      typeof page === "string" && page.trim() ? page.trim() : "Not specified";
    const pageSafe =
      pageSafeRaw !== "Not specified"
        ? validateHttpUrlStrict(pageSafeRaw)
        : null;

    if (pageSafeRaw !== "Not specified" && !pageSafe) {
      res.status(400).json({ error: "Please provide a valid page URL." });
      return;
    }

    const resend = getResend();
    if (resend) {
      await resend.emails
        .send({
          from: FROM_ADDRESS,
          to: OWNER_EMAIL,
          ...(emailSafe ? { replyTo: emailSafe } : {}),
          subject: `[Site Feedback] ${categoryLabel} — ${pageSafe ?? "Not specified"}`,
          html: `
        <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
          <div style="background:#4F46E5;padding:24px 32px;border-radius:8px 8px 0 0;">
            <h1 style="color:white;margin:0;font-size:20px;">Website Feedback</h1>
            <p style="color:rgba(255,255,255,0.8);margin:6px 0 0;font-size:14px;">${categoryLabel}</p>
          </div>
          <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
            <table style="width:100%;border-collapse:collapse;">
              <tr><td style="padding:8px 0;color:#666;font-size:14px;width:140px;">From</td><td style="padding:8px 0;font-weight:600;">${nameSafe}${emailSafe ? ` &lt;<a href="mailto:${emailSafe}" style="color:#6366f1;">${emailSafe}</a>&gt;` : ""}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Category</td><td style="padding:8px 0;">${categoryLabel}</td></tr>
              <tr><td style="padding:8px 0;color:#666;font-size:14px;">Page / Area</td><td style="padding:8px 0;">${pageSafe ?? "Not specified"}</td></tr>
            </table>
            <div style="margin-top:20px;padding:16px;background:white;border-radius:6px;border-left:3px solid #6366f1;">
              <p style="margin:0 0 8px;font-size:13px;color:#666;text-transform:uppercase;letter-spacing:0.05em;">Description</p>
              <p style="margin:0;line-height:1.6;white-space:pre-wrap;">${description.trim()}</p>
            </div>
            ${emailSafe ? `<p style="margin-top:24px;font-size:13px;color:#999;">Reply directly to this email to respond to ${nameSafe}.</p>` : ""}
          </div>
        </div>`,
        })
        .catch(() => {});
    }

    res
      .status(201)
      .json({ success: true, message: "Thanks for the feedback!" });
  },
);

export default router;
