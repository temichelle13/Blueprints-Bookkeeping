import mongoose, { Schema } from "mongoose";

export const BOOKING_MEETING_TYPES = ["video", "phone", "async"] as const;
export const BOOKING_STATUSES = ["confirmed", "cancelled", "rescheduled"] as const;

export type BookingMeetingType = (typeof BOOKING_MEETING_TYPES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface IBooking {
  calBookingId: string;
  calEventTypeId?: number | null;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  meetingType: BookingMeetingType;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  rawPayload?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    calBookingId: { type: String, required: true, unique: true },
    calEventTypeId: { type: Number, default: null },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, default: null },
    meetingType: { type: String, required: true, enum: BOOKING_MEETING_TYPES },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, default: "confirmed", enum: BOOKING_STATUSES },
    rawPayload: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const BookingModel =
  (mongoose.models["Booking"] as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export type Booking = mongoose.HydratedDocument<IBooking>;
export type InsertBooking = Omit<IBooking, "createdAt" | "updatedAt" | "status"> &
  Partial<Pick<IBooking, "status">>;
