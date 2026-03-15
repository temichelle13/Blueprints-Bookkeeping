import { pgTable, text, serial, timestamp, integer } from "drizzle-orm/pg-core";

export const subscriptionsTable = pgTable("subscriptions", {
  id: serial("id").primaryKey(),
  stripeCustomerId: text("stripe_customer_id").notNull(),
  stripeSubscriptionId: text("stripe_subscription_id").notNull(),
  stripePriceId: text("stripe_price_id"),
  plan: text("plan").notNull(),
  billingInterval: text("billing_interval").notNull().default("monthly"),
  status: text("status").notNull().default("active"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  currentPeriodStart: timestamp("current_period_start", { withTimezone: true }),
  currentPeriodEnd: timestamp("current_period_end", { withTimezone: true }),
  canceledAt: timestamp("canceled_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const onboardingSubmissionsTable = pgTable("onboarding_submissions", {
  id: serial("id").primaryKey(),
  subscriptionId: integer("subscription_id"),
  stripeSessionId: text("stripe_session_id"),
  clientName: text("client_name").notNull(),
  clientEmail: text("client_email").notNull(),
  businessName: text("business_name").notNull(),
  ownerName: text("owner_name").notNull(),
  phone: text("phone"),
  einBusinessType: text("ein_business_type"),
  currentBookkeepingSoftware: text("current_bookkeeping_software"),
  notes: text("notes"),
  plan: text("plan"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Subscription = typeof subscriptionsTable.$inferSelect;
export type InsertSubscription = typeof subscriptionsTable.$inferInsert;
export type OnboardingSubmission = typeof onboardingSubmissionsTable.$inferSelect;
export type InsertOnboardingSubmission = typeof onboardingSubmissionsTable.$inferInsert;
