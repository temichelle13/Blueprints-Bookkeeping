import {
  pgTable,
  text,
  serial,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const newsletterSubscribersTable = pgTable("newsletter_subscribers", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  signupSource: text("signup_source").notNull(),
  active: boolean("active").notNull().default(true),
  unsubscribeToken: uuid("unsubscribe_token")
    .notNull()
    .unique()
    .defaultRandom(),
  subscribedAt: timestamp("subscribed_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export const insertNewsletterSubscriberSchema = createInsertSchema(
  newsletterSubscribersTable,
).omit({
  id: true,
  subscribedAt: true,
  active: true,
  unsubscribeToken: true,
}) as any;
export type InsertNewsletterSubscriber = z.infer<
  typeof insertNewsletterSubscriberSchema
>;
export type NewsletterSubscriber =
  typeof newsletterSubscribersTable.$inferSelect;
