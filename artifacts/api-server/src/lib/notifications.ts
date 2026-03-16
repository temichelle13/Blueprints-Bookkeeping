import { Resend } from "resend";
import type { Booking } from "@workspace/db";

const OWNER_EMAIL = process.env["OWNER_EMAIL"] || "tea@blueprintsandbookkeeping.com";
const OWNER_PHONE = process.env["OWNER_PHONE_NUMBER"] || "";
const FROM_ADDRESS = "Blueprints & Bookkeeping <noreply@blueprintsandbookkeeping.com>";

function getResend(): Resend | null {
  const key = process.env["RESEND_API_KEY"];
  if (!key) return null;
  return new Resend(key);
}

function formatDate(date: Date): string {
  return date.toLocaleString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function meetingTypeLabel(type: string): string {
  switch (type) {
    case "video": return "Video Call";
    case "phone": return "Phone Call";
    case "async": return "Document-Only (Async)";
    default: return type;
  }
}

export async function sendBookingNotifications(
  booking: Booking,
  eventType: "created" | "rescheduled" | "cancelled"
): Promise<void> {
  const promises: Promise<void>[] = [];

  promises.push(sendOwnerEmail(booking, eventType));
  promises.push(sendOwnerSms(booking, eventType));

  const results = await Promise.allSettled(promises);
  for (const result of results) {
    if (result.status === "rejected") {
      console.error("Notification failed (non-blocking):", result.reason);
    }
  }
}

async function sendOwnerEmail(
  booking: Booking,
  eventType: "created" | "rescheduled" | "cancelled"
): Promise<void> {
  const resend = getResend();
  if (!resend) {
    console.log("Resend not configured — skipping owner email notification");
    return;
  }

  const subjectMap = {
    created: `New Booking: ${booking.clientName} — ${meetingTypeLabel(booking.meetingType)}`,
    rescheduled: `Rescheduled: ${booking.clientName} — ${meetingTypeLabel(booking.meetingType)}`,
    cancelled: `Cancelled: ${booking.clientName} — ${meetingTypeLabel(booking.meetingType)}`,
  };

  const statusColor = {
    created: "#22c55e",
    rescheduled: "#f59e0b",
    cancelled: "#ef4444",
  };

  const html = `
    <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:0 auto;color:#1a1a2e;">
      <div style="background:${statusColor[eventType]};padding:24px 32px;border-radius:8px 8px 0 0;">
        <h1 style="color:white;margin:0;font-size:20px;">Booking ${eventType.charAt(0).toUpperCase() + eventType.slice(1)}</h1>
      </div>
      <div style="background:#f8f9ff;padding:32px;border-radius:0 0 8px 8px;border:1px solid #e2e5f0;">
        <table style="width:100%;border-collapse:collapse;">
          <tr><td style="padding:8px 0;color:#666;font-size:14px;width:140px;">Client</td><td style="padding:8px 0;font-weight:600;">${booking.clientName}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Email</td><td style="padding:8px 0;"><a href="mailto:${booking.clientEmail}" style="color:#6366f1;">${booking.clientEmail}</a></td></tr>
          ${booking.clientPhone ? `<tr><td style="padding:8px 0;color:#666;font-size:14px;">Phone</td><td style="padding:8px 0;">${booking.clientPhone}</td></tr>` : ""}
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Meeting Type</td><td style="padding:8px 0;font-weight:600;">${meetingTypeLabel(booking.meetingType)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">When</td><td style="padding:8px 0;">${formatDate(booking.startTime)} — ${formatDate(booking.endTime)}</td></tr>
          <tr><td style="padding:8px 0;color:#666;font-size:14px;">Status</td><td style="padding:8px 0;font-weight:600;color:${statusColor[eventType]};">${booking.status.toUpperCase()}</td></tr>
        </table>
      </div>
    </div>`;

  await resend.emails.send({
    from: FROM_ADDRESS,
    to: OWNER_EMAIL,
    replyTo: booking.clientEmail,
    subject: subjectMap[eventType],
    html,
  });
}

async function sendOwnerSms(
  booking: Booking,
  eventType: "created" | "rescheduled" | "cancelled"
): Promise<void> {
  const accountSid = process.env["TWILIO_ACCOUNT_SID"];
  const authToken = process.env["TWILIO_AUTH_TOKEN"];
  const fromNumber = process.env["TWILIO_FROM_NUMBER"];

  if (!accountSid || !authToken || !fromNumber || !OWNER_PHONE) {
    console.log("Twilio not configured — skipping SMS notification");
    return;
  }

  const actionMap = {
    created: "New booking",
    rescheduled: "Rescheduled",
    cancelled: "Cancelled",
  };

  const body = `${actionMap[eventType]}: ${booking.clientName} — ${meetingTypeLabel(booking.meetingType)} on ${formatDate(booking.startTime)}`;

  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;
  const params = new URLSearchParams({
    To: OWNER_PHONE,
    From: fromNumber,
    Body: body,
  });

  const response = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params.toString(),
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Twilio SMS failed: ${response.status} — ${text}`);
  }
}
