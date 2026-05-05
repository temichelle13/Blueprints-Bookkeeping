import mongoose, { Schema, Types } from "mongoose";

export interface ISubscription {
  stripeCustomerId: string;
  stripeSubscriptionId: string;
  stripePriceId?: string | null;
  plan: string;
  billingInterval: string;
  status: string;
  clientName: string;
  clientEmail: string;
  currentPeriodStart?: Date | null;
  currentPeriodEnd?: Date | null;
  canceledAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const SubscriptionSchema = new Schema<ISubscription>(
  {
    stripeCustomerId: { type: String, required: true },
    stripeSubscriptionId: { type: String, required: true, unique: true },
    stripePriceId: { type: String, default: null },
    plan: { type: String, required: true },
    billingInterval: { type: String, default: "monthly" },
    status: { type: String, default: "active" },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    currentPeriodStart: { type: Date, default: null },
    currentPeriodEnd: { type: Date, default: null },
    canceledAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const SubscriptionModel =
  (mongoose.models["Subscription"] as mongoose.Model<ISubscription>) ||
  mongoose.model<ISubscription>("Subscription", SubscriptionSchema);

export type Subscription = mongoose.HydratedDocument<ISubscription>;
export type InsertSubscription = Omit<ISubscription, "createdAt" | "updatedAt" | "billingInterval" | "status"> &
  Partial<Pick<ISubscription, "billingInterval" | "status">>;

export interface IOnboardingSubmission {
  subscriptionId?: Types.ObjectId | null;
  stripeSessionId?: string | null;
  clientName: string;
  clientEmail: string;
  businessName: string;
  ownerName: string;
  phone?: string | null;
  einBusinessType?: string | null;
  currentBookkeepingSoftware?: string | null;
  notes?: string | null;
  plan?: string | null;
  businessState?: string | null;
  createdAt: Date;
}

const OnboardingSubmissionSchema = new Schema<IOnboardingSubmission>(
  {
    subscriptionId: { type: Schema.Types.ObjectId, ref: "Subscription", default: null },
    stripeSessionId: { type: String, default: null },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    phone: { type: String, default: null },
    einBusinessType: { type: String, default: null },
    currentBookkeepingSoftware: { type: String, default: null },
    notes: { type: String, default: null },
    plan: { type: String, default: null },
    businessState: { type: String, default: null },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export const OnboardingSubmissionModel =
  (mongoose.models["OnboardingSubmission"] as mongoose.Model<IOnboardingSubmission>) ||
  mongoose.model<IOnboardingSubmission>("OnboardingSubmission", OnboardingSubmissionSchema);

export type OnboardingSubmission = mongoose.HydratedDocument<IOnboardingSubmission>;
export type InsertOnboardingSubmission = Omit<IOnboardingSubmission, "createdAt">;
