import { Router, type IRouter, type Request } from "express";
import { Webhook } from "svix";
import { addToSuppressionList } from "../lib/email-suppression";
import { logger } from "../lib/logger";

interface RawBodyRequest extends Request {
  rawBody?: Buffer;
}

const router: IRouter = Router();

router.post(
  "/webhooks/resend",
  async (req: RawBodyRequest, res): Promise<void> => {
    const webhookSecret = process.env["RESEND_WEBHOOK_SECRET"];

    if (!webhookSecret) {
      console.error(
        "[Resend Webhook] RESEND_WEBHOOK_SECRET not configured — rejecting request",
      );
      res.status(503).json({ error: "Webhook endpoint not configured" });
      return;
    }

    const svixId = req.headers["svix-id"] as string | undefined;
    const svixTimestamp = req.headers["svix-timestamp"] as string | undefined;
    const svixSignature = req.headers["svix-signature"] as string | undefined;

    if (!svixId || !svixTimestamp || !svixSignature) {
      console.warn("[Resend Webhook] Missing Svix headers — rejecting request");
      res.status(401).json({ error: "Missing webhook signature headers" });
      return;
    }

    try {
      const wh = new Webhook(webhookSecret);
      if (!req.rawBody) {
        console.warn(
          "[Resend Webhook] Raw body not available — cannot verify signature",
        );
        res
          .status(500)
          .json({ error: "Raw body not available for signature verification" });
        return;
      }
      const rawBody = req.rawBody.toString("utf8");
      wh.verify(rawBody, {
        "svix-id": svixId,
        "svix-timestamp": svixTimestamp,
        "svix-signature": svixSignature,
      });
    } catch (err) {
      console.warn(
        "[Resend Webhook] Signature verification failed:",
        err instanceof Error ? err.message : String(err),
      );
      res.status(401).json({ error: "Invalid webhook signature" });
      return;
    }

    const event = req.body;

    if (!event || !event.type) {
      res.status(400).json({ error: "Invalid webhook payload" });
      return;
    }

    try {
      const recipients: string[] = extractRecipients(event.data);
      const isNewsletterWelcome = hasNewsletterWelcomeTag(event.data);
      if (isNewsletterWelcome) {
        logger.info("Newsletter welcome provider event received", {
          eventType: event.type,
          recipients,
          providerMessageId: extractProviderMessageId(event.data),
        });
      }

      if (event.type === "email.bounced") {
        for (const email of recipients) {
          await addToSuppressionList(email, "bounced");
          logger.info("Added bounced email to suppression list", {
            email,
            source: "resend_webhook",
          });
        }
      } else if (event.type === "email.complained") {
        for (const email of recipients) {
          await addToSuppressionList(email, "spam_complaint");
          logger.info("Added spam complaint email to suppression list", {
            email,
            source: "resend_webhook",
          });
        }
      }

      res.status(200).json({ received: true });
    } catch (err) {
      console.error("[Resend Webhook] Error processing event:", err);
      res.status(500).json({ error: "Internal server error" });
    }
  },
);

function extractRecipients(data: Record<string, unknown>): string[] {
  if (!data) return [];

  if (Array.isArray(data.to)) {
    return data.to.filter((e: unknown) => typeof e === "string");
  }

  if (typeof data.email === "string") {
    return [data.email];
  }

  if (typeof data.to === "string") {
    return [data.to];
  }

  return [];
}

function hasNewsletterWelcomeTag(data: Record<string, unknown>): boolean {
  const tags = data["tags"];
  if (!Array.isArray(tags)) return false;

  return tags.some((tag) => {
    if (!tag || typeof tag !== "object") return false;
    const name = "name" in tag ? tag.name : undefined;
    const value = "value" in tag ? tag.value : undefined;
    return (
      (name === "flow" && value === "newsletter") ||
      (name === "template" && value === "welcome")
    );
  });
}

function extractProviderMessageId(
  data: Record<string, unknown>,
): string | undefined {
  if (typeof data["email_id"] === "string") {
    return data["email_id"];
  }
  if (typeof data["id"] === "string") {
    return data["id"];
  }
  return undefined;
}

export default router;
