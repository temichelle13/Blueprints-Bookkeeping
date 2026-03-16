import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";

export const stateNexusRulesTable = pgTable("state_nexus_rules", {
  id: serial("id").primaryKey(),
  stateCode: text("state_code").notNull().unique(),
  stateName: text("state_name").notNull(),
  foreignQualificationThreshold: integer("foreign_qualification_threshold").notNull().default(10),
  bookkeepingLicenseRequired: boolean("bookkeeping_license_required").notNull().default(false),
  bookkeepingLicenseNotes: text("bookkeeping_license_notes"),
  authorityName: text("authority_name"),
  authorityUrl: text("authority_url"),
  notes: text("notes"),
  warningThresholdPercent: integer("warning_threshold_percent").notNull().default(70),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const nexusNotificationsLogTable = pgTable("nexus_notifications_log", {
  id: serial("id").primaryKey(),
  stateCode: text("state_code").notNull(),
  notificationType: text("notification_type").notNull(),
  clientCount: integer("client_count").notNull(),
  threshold: integer("threshold").notNull(),
  sentAt: timestamp("sent_at", { withTimezone: true }).notNull().defaultNow(),
});

export type StateNexusRule = typeof stateNexusRulesTable.$inferSelect;
export type InsertStateNexusRule = typeof stateNexusRulesTable.$inferInsert;
export type NexusNotificationLog = typeof nexusNotificationsLogTable.$inferSelect;
export type InsertNexusNotificationLog = typeof nexusNotificationsLogTable.$inferInsert;
