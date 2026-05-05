import mongoose, { Schema, Types } from "mongoose";
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
