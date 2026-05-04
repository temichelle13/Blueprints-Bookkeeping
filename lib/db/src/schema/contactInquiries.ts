import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const INQUIRY_STATUSES = [
  "New",
  "Contacted",
  "In Progress",
  "Closed",
  "Archived",
] as const;
export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export const contactInquiriesTable = pgTable("contact_inquiries", {
  id: serial("id").primaryKey(),
  formType: text("form_type").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  message: text("message"),
  businessName: text("business_name"),
  industry: text("industry"),
  servicesInterested: text("services_interested").array(),
  monthlyRevenueRange: text("monthly_revenue_range"),
  biggestChallenge: text("biggest_challenge"),
  preferredContactMethod: text("preferred_contact_method"),
  emailConsent: boolean("email_consent").notNull().default(false),
  emailConsentCapturedAt: timestamp("email_consent_captured_at", {
    withTimezone: true,
  }),
  emailConsentSource: text("email_consent_source"),
  smsConsent: boolean("sms_consent").notNull().default(false),
  consentTimestamp: timestamp("consent_timestamp", { withTimezone: true })
    .notNull()
    .defaultNow(),
  consentTextVersion: text("consent_text_version")
    .notNull()
    .default("legacy-unknown"),
  requestIp: text("request_ip").notNull().default("unknown"),
  userAgent: text("user_agent").notNull().default("unknown"),
  consentSourcePage: text("consent_source_page").notNull().default("/contact"),
  status: text("status").notNull().default("New"),
  createdAt: timestamp("created_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertContactInquirySchema = createInsertSchema(
  contactInquiriesTable,
).omit({ id: true, createdAt: true }) as any;
export type InsertContactInquiry = z.infer<typeof insertContactInquirySchema>;
export type ContactInquiry = typeof contactInquiriesTable.$inferSelect;
