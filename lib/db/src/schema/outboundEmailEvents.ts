import mongoose, { Schema, Types } from "mongoose";

export const OUTBOUND_EMAIL_EVENT_TYPES = [
  "owner_notification",
  "client_confirmation",
] as const;

export const OUTBOUND_EMAIL_EVENT_STATUSES = [
  "queued",
  "sending",
  "sent",
  "failed",
] as const;

export type OutboundEmailEventType = (typeof OUTBOUND_EMAIL_EVENT_TYPES)[number];
export type OutboundEmailEventStatus = (typeof OUTBOUND_EMAIL_EVENT_STATUSES)[number];

export interface IOutboundEmailEvent {
  inquiryId: Types.ObjectId;
  eventType: OutboundEmailEventType;
  recipientEmail: string;
  providerMessageId?: string | null;
  status: OutboundEmailEventStatus;
  attemptCount: number;
  maxAttempts: number;
  nextAttemptAt: Date;
  sentAt?: Date | null;
  emailPayload?: Record<string, unknown> | null;
  errorPayload?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const OutboundEmailEventSchema = new Schema<IOutboundEmailEvent>(
  {
    inquiryId: { type: Schema.Types.ObjectId, ref: "ContactInquiry", required: true, index: true },
    eventType: { type: String, required: true, enum: OUTBOUND_EMAIL_EVENT_TYPES },
    recipientEmail: { type: String, required: true },
    providerMessageId: { type: String, default: null },
    status: { type: String, default: "queued", enum: OUTBOUND_EMAIL_EVENT_STATUSES, index: true },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    nextAttemptAt: { type: Date, required: true, default: () => new Date(), index: true },
    sentAt: { type: Date, default: null },
    emailPayload: { type: Schema.Types.Mixed, default: null },
    errorPayload: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const OutboundEmailEventModel =
  (mongoose.models["OutboundEmailEvent"] as mongoose.Model<IOutboundEmailEvent>) ||
  mongoose.model<IOutboundEmailEvent>("OutboundEmailEvent", OutboundEmailEventSchema);

export type OutboundEmailEvent = mongoose.HydratedDocument<IOutboundEmailEvent>;
export type InsertOutboundEmailEvent = Omit<IOutboundEmailEvent, "createdAt" | "updatedAt" | "status" | "attemptCount" | "maxAttempts" | "nextAttemptAt"> &
  Partial<Pick<IOutboundEmailEvent, "status" | "attemptCount" | "maxAttempts" | "nextAttemptAt">>;
