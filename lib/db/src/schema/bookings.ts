import {
  pgTable,
  text,
  serial,
  timestamp,
  jsonb,
  pgEnum,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const meetingTypeEnum = pgEnum("meeting_type", [
  "video",
  "phone",
  "async",
]);
export const bookingStatusEnum = pgEnum("booking_status", [
  "confirmed",
  "cancelled",
  "rescheduled",
]);

export const bookingsTable = pgTable("bookings", {
  id: serial("id").primaryKey(),
  calBookingId: text("cal_booking_id").unique().notNull(),
  calEventTypeId: text("cal_event_type_id"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  clientPhone: text("client_phone"),
  meetingType: meetingTypeEnum("meeting_type").notNull(),
  startTime: timestamp("start_time", { withTimezone: true }).notNull(),
  endTime: timestamp("end_time", { withTimezone: true }).notNull(),
  status: bookingStatusEnum("status").notNull().default("confirmed"),
  rawPayload: jsonb("raw_payload"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertBookingSchema = createInsertSchema(bookingsTable).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
}) as any;
export type InsertBooking = z.infer<typeof insertBookingSchema>;
export type Booking = typeof bookingsTable.$inferSelect;
