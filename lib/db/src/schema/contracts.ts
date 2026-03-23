import { pgTable, text, serial, timestamp, integer, jsonb, boolean, index } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { z } from "zod";
import { contactInquiriesTable } from "./contactInquiries";

export const contractTemplatesTable = pgTable("contract_templates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  contractType: text("contract_type").notNull(),
  adobeTemplateId: text("adobe_template_id"),
  triggerCondition: text("trigger_condition").notNull(),
  description: text("description"),
  prefillFields: jsonb("prefill_fields").$type<string[]>(),
  active: boolean("active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  contractTypeIdx: index("contract_templates_contract_type_idx").on(table.contractType),
  activeIdx: index("contract_templates_active_idx").on(table.active),
}));

export const contractsTable = pgTable("contracts", {
  id: serial("id").primaryKey(),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  contractType: text("contract_type").notNull(),
  templateId: integer("template_id").references(() => contractTemplatesTable.id),
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
  contactInquiryId: integer("contact_inquiry_id").references(() => contactInquiriesTable.id),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
}, (table) => ({
  clientEmailIdx: index("contracts_client_email_idx").on(table.clientEmail),
  statusIdx: index("contracts_status_idx").on(table.status),
  templateIdIdx: index("contracts_template_id_idx").on(table.templateId),
  contactInquiryIdIdx: index("contracts_contact_inquiry_id_idx").on(table.contactInquiryId),
}));

// Define relations for better type safety and query building
export const contractTemplatesRelations = relations(contractTemplatesTable, ({ many }) => ({
  contracts: many(contractsTable),
}));

export const contractsRelations = relations(contractsTable, ({ one }) => ({
  template: one(contractTemplatesTable, {
    fields: [contractsTable.templateId],
    references: [contractTemplatesTable.id],
  }),
  contactInquiry: one(contactInquiriesTable, {
    fields: [contractsTable.contactInquiryId],
    references: [contactInquiriesTable.id],
  }),
}));

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
