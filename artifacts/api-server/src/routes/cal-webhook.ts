import { Router, type IRouter } from "express";
import crypto from "crypto";
import { db, bookingsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { sendBookingNotifications } from "../lib/notifications";

const router: IRouter = Router();

function verifyCalSignature(rawBody: Buffer, signature: string | undefined): { valid: boolean; reason?: string } {
  const secret = process.env["CAL_WEBHOOK_SECRET"];
  if (!secret) {
    console.error("CAL_WEBHOOK_SECRET not set — rejecting webhook (fail-closed)");
    return { valid: false, reason: "Webhook secret not configured" };
  }
  if (!signature) {
    return { valid: false, reason: "Missing signature header" };
  }

  const expected = crypto
    .createHmac("sha256", secret)
    .update(rawBody)
    .digest("hex");

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (sigBuffer.length !== expectedBuffer.length) {
    return { valid: false, reason: "Signature length mismatch" };
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return { valid: false, reason: "Signature mismatch" };
  }

  return { valid: true };
}

const VALID_TRIGGER_EVENTS = new Set(["BOOKING_CREATED", "BOOKING_RESCHEDULED", "BOOKING_CANCELLED"]);

function inferMeetingType(payload: Record<string, unknown>): "video" | "phone" | "async" {
  const title = (
    (payload.title as string) ||
    (payload.eventTitle as string) ||
    ""
  ).toLowerCase();

  if (title.includes("video")) return "video";
  if (title.includes("phone")) return "phone";
  if (title.includes("async") || title.includes("document")) return "async";
  return "video";
}

router.post("/webhooks/cal", async (req, res): Promise<void> => {
  try {
    const rawBody = (req as unknown as { rawBody?: Buffer }).rawBody;
    const signature = req.headers["x-cal-signature-256"] as string | undefined;

    if (rawBody) {
      const verification = verifyCalSignature(rawBody, signature);
      if (!verification.valid) {
        console.warn(`Cal webhook rejected: ${verification.reason}`);
        res.status(401).json({ error: "Invalid signature" });
        return;
      }
    } else if (process.env["CAL_WEBHOOK_SECRET"]) {
      console.error("Cal webhook: raw body not available for signature verification");
      res.status(401).json({ error: "Cannot verify signature" });
      return;
    }

    const body = req.body;
    const triggerEvent = body.triggerEvent as string;

    if (!triggerEvent || !VALID_TRIGGER_EVENTS.has(triggerEvent)) {
      res.status(400).json({ error: `Unsupported or missing triggerEvent: ${triggerEvent}` });
      return;
    }

    const payload = body.payload as Record<string, unknown>;

    if (!payload) {
      res.status(400).json({ error: "Missing payload" });
      return;
    }

    const bookingUid = (payload.uid as string) || (payload.bookingId as string) || "";
    if (!bookingUid) {
      res.status(400).json({ error: "Missing booking UID" });
      return;
    }

    const attendees = (payload.attendees as Array<Record<string, string>>) || [];
    const firstAttendee = attendees[0] || {};

    const clientName = firstAttendee.name || (payload.name as string) || "Unknown";
    const clientEmail = firstAttendee.email || (payload.email as string) || "";
    const clientPhone = firstAttendee.phone || (payload.phone as string) || null;

    const startTime = new Date((payload.startTime as string) || (payload.start_time as string) || new Date().toISOString());
    const endTime = new Date((payload.endTime as string) || (payload.end_time as string) || new Date().toISOString());

    const meetingType = inferMeetingType(payload);
    const calEventTypeId = String(payload.eventTypeId || payload.eventType || "");

    let eventType: "created" | "rescheduled" | "cancelled";
    let status: "confirmed" | "cancelled" | "rescheduled";

    if (triggerEvent === "BOOKING_CANCELLED") {
      eventType = "cancelled";
      status = "cancelled";
    } else if (triggerEvent === "BOOKING_RESCHEDULED") {
      eventType = "rescheduled";
      status = "rescheduled";
    } else {
      eventType = "created";
      status = "confirmed";
    }

    const existing = await db.query.bookingsTable.findFirst({
      where: eq(bookingsTable.calBookingId, bookingUid),
    });

    let booking;

    if (existing) {
      const [updated] = await db
        .update(bookingsTable)
        .set({
          clientName,
          clientEmail,
          clientPhone,
          meetingType,
          startTime,
          endTime,
          status,
          rawPayload: body,
          updatedAt: new Date(),
        })
        .where(eq(bookingsTable.calBookingId, bookingUid))
        .returning();
      booking = updated;
    } else {
      const [inserted] = await db
        .insert(bookingsTable)
        .values({
          calBookingId: bookingUid,
          calEventTypeId,
          clientName,
          clientEmail,
          clientPhone,
          meetingType,
          startTime,
          endTime,
          status,
          rawPayload: body,
        })
        .returning();
      booking = inserted;
    }

    sendBookingNotifications(booking, eventType).catch((err) => {
      console.error("Notification dispatch error (non-blocking):", err);
    });

    res.status(200).json({ success: true, bookingId: booking.id });
  } catch (err) {
    console.error("Cal.com webhook error:", err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
