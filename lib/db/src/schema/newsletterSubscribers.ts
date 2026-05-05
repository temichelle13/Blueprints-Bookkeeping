import mongoose, { Schema } from "mongoose";
import { randomUUID } from "crypto";

export interface INewsletterSubscriber {
  email: string;
  signupSource: string;
  active: boolean;
  unsubscribeToken: string;
  subscribedAt: Date;
}

const NewsletterSubscriberSchema = new Schema<INewsletterSubscriber>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    signupSource: { type: String, required: true },
    active: { type: Boolean, default: true },
    unsubscribeToken: {
      type: String,
      required: true,
      unique: true,
      default: () => randomUUID(),
    },
    subscribedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

export const NewsletterSubscriberModel =
  (mongoose.models["NewsletterSubscriber"] as mongoose.Model<INewsletterSubscriber>) ||
  mongoose.model<INewsletterSubscriber>("NewsletterSubscriber", NewsletterSubscriberSchema);

export type NewsletterSubscriber = mongoose.HydratedDocument<INewsletterSubscriber>;
export type InsertNewsletterSubscriber = Omit<INewsletterSubscriber, "active" | "unsubscribeToken" | "subscribedAt"> &
  Partial<Pick<INewsletterSubscriber, "active" | "unsubscribeToken" | "subscribedAt">>;
