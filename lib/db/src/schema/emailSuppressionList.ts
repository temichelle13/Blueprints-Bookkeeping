import { pgTable, text, serial, timestamp, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const SUPPRESSION_REASONS = ["unsubscribed", "bounced", "spam_complaint", "manual"] as const;
export type SuppressionReason = (typeof SUPPRESSION_REASONS)[number];

export const suppressionReasonEnum = pgEnum("suppression_reason", SUPPRESSION_REASONS);

export const emailSuppressionListTable = pgTable("email_suppression_list", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  reason: suppressionReasonEnum("reason").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertEmailSuppressionSchema = createInsertSchema(emailSuppressionListTable).omit({ id: true, createdAt: true });
export type InsertEmailSuppression = z.infer<typeof insertEmailSuppressionSchema>;
export type EmailSuppression = typeof emailSuppressionListTable.$inferSelect;
