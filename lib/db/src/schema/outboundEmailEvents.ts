import {
  pgTable,
  serial,
  integer,
  text,
  timestamp,
  jsonb,
  index,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { contactInquiriesTable } from "./contactInquiries";

export const OUTBOUND_EMAIL_EVENT_STATUSES = [
  "queued",
  "sent",
  "failed",
] as const;
export type OutboundEmailEventStatus =
  (typeof OUTBOUND_EMAIL_EVENT_STATUSES)[number];

export const OUTBOUND_EMAIL_EVENT_TYPES = [
  "owner_notification",
  "client_confirmation",
] as const;
export type OutboundEmailEventType =
  (typeof OUTBOUND_EMAIL_EVENT_TYPES)[number];

export const outboundEmailEventsTable = pgTable(
  "outbound_email_events",
  {
    id: serial("id").primaryKey(),
    inquiryId: integer("inquiry_id")
      .notNull()
      .references(() => contactInquiriesTable.id, { onDelete: "cascade" }),
    eventType: text("event_type").$type<OutboundEmailEventType>().notNull(),
    recipientEmail: text("recipient_email").notNull(),
    providerMessageId: text("provider_message_id"),
    status: text("status")
      .$type<OutboundEmailEventStatus>()
      .notNull()
      .default("queued"),
    attemptCount: integer("attempt_count").notNull().default(0),
    maxAttempts: integer("max_attempts").notNull().default(3),
    nextAttemptAt: timestamp("next_attempt_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    sentAt: timestamp("sent_at", { withTimezone: true }),
    errorPayload: jsonb("error_payload"),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
  },
  (table) => ({
    inquiryIdIdx: index("outbound_email_events_inquiry_id_idx").on(
      table.inquiryId,
    ),
    statusNextAttemptIdx: index(
      "outbound_email_events_status_next_attempt_idx",
    ).on(table.status, table.nextAttemptAt),
    typeStatusIdx: index("outbound_email_events_type_status_idx").on(
      table.eventType,
      table.status,
    ),
  }),
);

export const insertOutboundEmailEventSchema = createInsertSchema(
  outboundEmailEventsTable,
).omit({ id: true, createdAt: true, updatedAt: true }) as any;

export type InsertOutboundEmailEvent = z.infer<
  typeof insertOutboundEmailEventSchema
>;
export type OutboundEmailEvent = typeof outboundEmailEventsTable.$inferSelect;
