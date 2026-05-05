import { writeFileSync } from "fs";
import { join } from "path";

const schemaDir = "lib/db/src/schema";

const files = {
  "newsletterSubscribers.ts": `import mongoose, { Schema } from "mongoose";
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
`,

  "emailSuppressionList.ts": `import mongoose, { Schema } from "mongoose";

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
`,

  "conversations.ts": `import mongoose, { Schema } from "mongoose";

export interface IConversation {
  title: string;
  visitorIp?: string | null;
  leadCaptured: boolean;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    title: { type: String, required: true },
    visitorIp: { type: String, default: null },
    leadCaptured: { type: Boolean, default: false },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export const ConversationModel =
  (mongoose.models["Conversation"] as mongoose.Model<IConversation>) ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);

export type Conversation = mongoose.HydratedDocument<IConversation>;
export type InsertConversation = Omit<IConversation, "createdAt" | "leadCaptured"> &
  Partial<Pick<IConversation, "leadCaptured">>;
`,

  "messages.ts": `import mongoose, { Schema, Types } from "mongoose";

export interface IMessage {
  conversationId: Types.ObjectId;
  role: string;
  content: string;
  createdAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    conversationId: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
      index: true,
    },
    role: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export const MessageModel =
  (mongoose.models["Message"] as mongoose.Model<IMessage>) ||
  mongoose.model<IMessage>("Message", MessageSchema);

export type Message = mongoose.HydratedDocument<IMessage>;
export type InsertMessage = Omit<IMessage, "createdAt">;
`,

  "contracts.ts": `import mongoose, { Schema, Types } from "mongoose";
import { z } from "zod";

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

export type ContractType = z.infer<typeof contractTypeEnum>;
export type ContractStatus = z.infer<typeof contractStatusEnum>;
export type TriggerCondition = z.infer<typeof triggerConditionEnum>;

export interface IContractTemplate {
  name: string;
  contractType: string;
  adobeTemplateId?: string | null;
  triggerCondition: string;
  description?: string | null;
  prefillFields?: string[] | null;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ContractTemplateSchema = new Schema<IContractTemplate>(
  {
    name: { type: String, required: true },
    contractType: { type: String, required: true },
    adobeTemplateId: { type: String, default: null },
    triggerCondition: { type: String, required: true },
    description: { type: String, default: null },
    prefillFields: { type: [String], default: null },
    active: { type: Boolean, default: true },
  },
  { timestamps: true },
);

export const ContractTemplateModel =
  (mongoose.models["ContractTemplate"] as mongoose.Model<IContractTemplate>) ||
  mongoose.model<IContractTemplate>("ContractTemplate", ContractTemplateSchema);

export type ContractTemplate = mongoose.HydratedDocument<IContractTemplate>;
export type InsertContractTemplate = Omit<IContractTemplate, "createdAt" | "updatedAt" | "active"> &
  Partial<Pick<IContractTemplate, "active">>;

export interface IContract {
  clientName: string;
  clientEmail: string;
  contractType: string;
  templateId?: Types.ObjectId | null;
  adobeAgreementId?: string | null;
  status: string;
  serviceType?: string | null;
  pricingTier?: string | null;
  startDate?: Date | null;
  sentAt?: Date | null;
  signedAt?: Date | null;
  expiredAt?: Date | null;
  signedDocumentUrl?: string | null;
  remindersSent: number;
  lastReminderAt?: Date | null;
  metadata?: Record<string, unknown> | null;
  contactInquiryId?: Types.ObjectId | null;
  createdAt: Date;
  updatedAt: Date;
}

const ContractSchema = new Schema<IContract>(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    contractType: { type: String, required: true },
    templateId: { type: Schema.Types.ObjectId, ref: "ContractTemplate", default: null },
    adobeAgreementId: { type: String, default: null },
    status: { type: String, default: "draft" },
    serviceType: { type: String, default: null },
    pricingTier: { type: String, default: null },
    startDate: { type: Date, default: null },
    sentAt: { type: Date, default: null },
    signedAt: { type: Date, default: null },
    expiredAt: { type: Date, default: null },
    signedDocumentUrl: { type: String, default: null },
    remindersSent: { type: Number, default: 0 },
    lastReminderAt: { type: Date, default: null },
    metadata: { type: Schema.Types.Mixed, default: null },
    contactInquiryId: { type: Schema.Types.ObjectId, ref: "ContactInquiry", default: null },
  },
  { timestamps: true },
);

export const ContractModel =
  (mongoose.models["Contract"] as mongoose.Model<IContract>) ||
  mongoose.model<IContract>("Contract", ContractSchema);

export type Contract = mongoose.HydratedDocument<IContract>;
export type InsertContract = Omit<IContract, "createdAt" | "updatedAt" | "remindersSent" | "status"> &
  Partial<Pick<IContract, "remindersSent" | "status">>;
`,

  "subscriptions.ts": `import mongoose, { Schema, Types } from "mongoose";

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
`,

  "clientDocuments.ts": `import mongoose, { Schema } from "mongoose";

export interface IClientDocument {
  clientName: string;
  clientEmail: string;
  fileName: string;
  originalName: string;
  fileSize: number;
  mimeType: string;
  storagePath: string;
  uploadedAt: Date;
}

const ClientDocumentSchema = new Schema<IClientDocument>(
  {
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    fileName: { type: String, required: true },
    originalName: { type: String, required: true },
    fileSize: { type: Number, required: true },
    mimeType: { type: String, required: true },
    storagePath: { type: String, required: true },
    uploadedAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

export const ClientDocumentModel =
  (mongoose.models["ClientDocument"] as mongoose.Model<IClientDocument>) ||
  mongoose.model<IClientDocument>("ClientDocument", ClientDocumentSchema);

export type ClientDocument = mongoose.HydratedDocument<IClientDocument>;
export type InsertClientDocument = Omit<IClientDocument, "uploadedAt"> & Partial<Pick<IClientDocument, "uploadedAt">>;
`,

  "bookings.ts": `import mongoose, { Schema } from "mongoose";

export const BOOKING_MEETING_TYPES = ["video", "phone", "async"] as const;
export const BOOKING_STATUSES = ["confirmed", "cancelled", "rescheduled"] as const;

export type BookingMeetingType = (typeof BOOKING_MEETING_TYPES)[number];
export type BookingStatus = (typeof BOOKING_STATUSES)[number];

export interface IBooking {
  calBookingId: string;
  calEventTypeId?: number | null;
  clientName: string;
  clientEmail: string;
  clientPhone?: string | null;
  meetingType: BookingMeetingType;
  startTime: Date;
  endTime: Date;
  status: BookingStatus;
  rawPayload?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const BookingSchema = new Schema<IBooking>(
  {
    calBookingId: { type: String, required: true, unique: true },
    calEventTypeId: { type: Number, default: null },
    clientName: { type: String, required: true },
    clientEmail: { type: String, required: true },
    clientPhone: { type: String, default: null },
    meetingType: { type: String, required: true, enum: BOOKING_MEETING_TYPES },
    startTime: { type: Date, required: true },
    endTime: { type: Date, required: true },
    status: { type: String, default: "confirmed", enum: BOOKING_STATUSES },
    rawPayload: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const BookingModel =
  (mongoose.models["Booking"] as mongoose.Model<IBooking>) ||
  mongoose.model<IBooking>("Booking", BookingSchema);

export type Booking = mongoose.HydratedDocument<IBooking>;
export type InsertBooking = Omit<IBooking, "createdAt" | "updatedAt" | "status"> &
  Partial<Pick<IBooking, "status">>;
`,

  "stateNexus.ts": `import mongoose, { Schema } from "mongoose";

export interface IStateNexusRule {
  stateCode: string;
  stateName: string;
  foreignQualificationThreshold: number;
  bookkeepingLicenseRequired: boolean;
  bookkeepingLicenseNotes?: string | null;
  authorityName?: string | null;
  authorityUrl?: string | null;
  notes?: string | null;
  warningThresholdPercent: number;
  createdAt: Date;
  updatedAt: Date;
}

const StateNexusRuleSchema = new Schema<IStateNexusRule>(
  {
    stateCode: { type: String, required: true, unique: true },
    stateName: { type: String, required: true },
    foreignQualificationThreshold: { type: Number, default: 10 },
    bookkeepingLicenseRequired: { type: Boolean, default: false },
    bookkeepingLicenseNotes: { type: String, default: null },
    authorityName: { type: String, default: null },
    authorityUrl: { type: String, default: null },
    notes: { type: String, default: null },
    warningThresholdPercent: { type: Number, default: 70 },
  },
  { timestamps: true },
);

export const StateNexusRuleModel =
  (mongoose.models["StateNexusRule"] as mongoose.Model<IStateNexusRule>) ||
  mongoose.model<IStateNexusRule>("StateNexusRule", StateNexusRuleSchema);

export type StateNexusRule = mongoose.HydratedDocument<IStateNexusRule>;
export type InsertStateNexusRule = Omit<IStateNexusRule, "createdAt" | "updatedAt" | "foreignQualificationThreshold" | "bookkeepingLicenseRequired" | "warningThresholdPercent"> &
  Partial<Pick<IStateNexusRule, "foreignQualificationThreshold" | "bookkeepingLicenseRequired" | "warningThresholdPercent">>;

export interface INexusNotificationLog {
  stateCode: string;
  notificationType: string;
  clientCount: number;
  threshold: number;
  sentAt: Date;
}

const NexusNotificationLogSchema = new Schema<INexusNotificationLog>(
  {
    stateCode: { type: String, required: true },
    notificationType: { type: String, required: true },
    clientCount: { type: Number, required: true },
    threshold: { type: Number, required: true },
    sentAt: { type: Date, default: () => new Date() },
  },
  { timestamps: false },
);

export const NexusNotificationLogModel =
  (mongoose.models["NexusNotificationLog"] as mongoose.Model<INexusNotificationLog>) ||
  mongoose.model<INexusNotificationLog>("NexusNotificationLog", NexusNotificationLogSchema);

export type NexusNotificationLog = mongoose.HydratedDocument<INexusNotificationLog>;
export type InsertNexusNotificationLog = Omit<INexusNotificationLog, "sentAt"> & Partial<Pick<INexusNotificationLog, "sentAt">>;
`,

  "outboundEmailEvents.ts": `import mongoose, { Schema, Types } from "mongoose";

export const OUTBOUND_EMAIL_EVENT_TYPES = [
  "owner_notification",
  "client_confirmation",
] as const;

export const OUTBOUND_EMAIL_EVENT_STATUSES = [
  "queued",
  "sending",
  "sent",
  "failed",
] as const;

export type OutboundEmailEventType = (typeof OUTBOUND_EMAIL_EVENT_TYPES)[number];
export type OutboundEmailEventStatus = (typeof OUTBOUND_EMAIL_EVENT_STATUSES)[number];

export interface IOutboundEmailEvent {
  inquiryId: Types.ObjectId;
  eventType: OutboundEmailEventType;
  recipientEmail: string;
  providerMessageId?: string | null;
  status: OutboundEmailEventStatus;
  attemptCount: number;
  maxAttempts: number;
  nextAttemptAt: Date;
  sentAt?: Date | null;
  emailPayload?: Record<string, unknown> | null;
  errorPayload?: Record<string, unknown> | null;
  createdAt: Date;
  updatedAt: Date;
}

const OutboundEmailEventSchema = new Schema<IOutboundEmailEvent>(
  {
    inquiryId: { type: Schema.Types.ObjectId, ref: "ContactInquiry", required: true, index: true },
    eventType: { type: String, required: true, enum: OUTBOUND_EMAIL_EVENT_TYPES },
    recipientEmail: { type: String, required: true },
    providerMessageId: { type: String, default: null },
    status: { type: String, default: "queued", enum: OUTBOUND_EMAIL_EVENT_STATUSES, index: true },
    attemptCount: { type: Number, default: 0 },
    maxAttempts: { type: Number, default: 3 },
    nextAttemptAt: { type: Date, required: true, default: () => new Date(), index: true },
    sentAt: { type: Date, default: null },
    emailPayload: { type: Schema.Types.Mixed, default: null },
    errorPayload: { type: Schema.Types.Mixed, default: null },
  },
  { timestamps: true },
);

export const OutboundEmailEventModel =
  (mongoose.models["OutboundEmailEvent"] as mongoose.Model<IOutboundEmailEvent>) ||
  mongoose.model<IOutboundEmailEvent>("OutboundEmailEvent", OutboundEmailEventSchema);

export type OutboundEmailEvent = mongoose.HydratedDocument<IOutboundEmailEvent>;
export type InsertOutboundEmailEvent = Omit<IOutboundEmailEvent, "createdAt" | "updatedAt" | "status" | "attemptCount" | "maxAttempts" | "nextAttemptAt"> &
  Partial<Pick<IOutboundEmailEvent, "status" | "attemptCount" | "maxAttempts" | "nextAttemptAt">>;
`,

  "index.ts": `export * from "./contactInquiries";
export * from "./newsletterSubscribers";
export * from "./emailSuppressionList";
export * from "./conversations";
export * from "./messages";
export * from "./contracts";
export * from "./subscriptions";
export * from "./clientDocuments";
export * from "./bookings";
export * from "./stateNexus";
export * from "./outboundEmailEvents";
`,
};

for (const [name, content] of Object.entries(files)) {
  const path = join(schemaDir, name);
  writeFileSync(path, content, "utf8");
  console.log(`Written: ${path}`);
}
