import mongoose, { Schema } from "mongoose";

export const SUPPRESSION_REASONS = [
  "unsubscribed",
  "bounced",
  "spam_complaint",
  "manual",
] as const;

export type SuppressionReason = (typeof SUPPRESSION_REASONS)[number];

export interface IEmailSuppression {
  email: string;
  reason: SuppressionReason;
  createdAt: Date;
}

const EmailSuppressionSchema = new Schema<IEmailSuppression>(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    reason: { type: String, required: true, enum: SUPPRESSION_REASONS },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export const EmailSuppressionModel =
  (mongoose.models["EmailSuppression"] as mongoose.Model<IEmailSuppression>) ||
  mongoose.model<IEmailSuppression>("EmailSuppression", EmailSuppressionSchema);

export type EmailSuppression = mongoose.HydratedDocument<IEmailSuppression>;
export type InsertEmailSuppression = Omit<IEmailSuppression, "createdAt">;
