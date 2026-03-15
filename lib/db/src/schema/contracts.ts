import { pgTable, text, serial, timestamp, integer, jsonb } from "drizzle-orm/pg-core";
import { z } from "zod/v4";

export const contractTemplatesTable = pgTable("contract_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contractType: text("contract_type").notNull(),
  adobeTemplateId: text("adobe_template_id"),
  triggerCondition: text("trigger_condition").notNull(),
  description: text("description"),
  prefillFields: jsonb("prefill_fields").$type<string[]>(),
  active: text("active").notNull().default("true"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contractsTable = pgTable("contracts", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  contractType: text("contract_type").notNull(),
  templateId: integer("template_id"),
  adobeAgreementId: text("adobe_agreement_id"),
  status: text("status").notNull().default("draft"),
  serviceType: text("service_type"),
  pricingTier: text("pricing_tier"),
  startDate: text("start_date"),
  sentAt: timestamp("sent_at", { withTimezone: true }),
  signedAt: timestamp("signed_at", { withTimezone: true }),
  expiredAt: timestamp("expired_at", { withTimezone: true }),
  signedDocumentUrl: text("signed_document_url"),
  remindersSent: integer("reminders_sent").notNull().default(0),
  lastReminderAt: timestamp("last_reminder_at", { withTimezone: true }),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  contactInquiryId: integer("contact_inquiry_id"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const contractTypeEnum = z.enum([
  "engagement_letter",
  "mutual_nda",
  "data_processing_agreement",
  "scope_change",
]);

export const contractStatusEnum = z.enum([
  "draft",
  "sent",
  "viewed",
  "signed",
  "expired",
  "cancelled",
]);

export const triggerConditionEnum = z.enum([
  "service_booking",
  "discovery_call",
  "recurring_client",
  "manual",
]);

export type ContractTemplate = typeof contractTemplatesTable.$inferSelect;
export type InsertContractTemplate = typeof contractTemplatesTable.$inferInsert;
export type Contract = typeof contractsTable.$inferSelect;
export type InsertContract = typeof contractsTable.$inferInsert;
