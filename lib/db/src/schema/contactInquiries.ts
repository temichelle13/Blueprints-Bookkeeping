import mongoose, { Schema } from "mongoose";

export const INQUIRY_STATUSES = [
  "New",
  "In Progress",
  "Closed",
  "Archived",
] as const;

export type InquiryStatus = (typeof INQUIRY_STATUSES)[number];

export interface IContactInquiry {
  formType: string;
  name: string;
  email: string;
  phone?: string | null;
  message?: string | null;
  businessName?: string | null;
  industry?: string | null;
  servicesInterested?: string[] | null;
  monthlyRevenueRange?: string | null;
  biggestChallenge?: string | null;
  preferredContactMethod?: string | null;
  emailConsent: boolean;
  emailConsentCapturedAt?: Date | null;
  emailConsentSource?: string | null;
  smsConsent: boolean;
  consentTimestamp: Date;
  consentTextVersion: string;
  requestIp: string;
  userAgent: string;
  consentSourcePage: string;
  status: string;
  createdAt: Date;
}

const ContactInquirySchema = new Schema<IContactInquiry>(
  {
    formType: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, default: null },
    message: { type: String, default: null },
    businessName: { type: String, default: null },
    industry: { type: String, default: null },
    servicesInterested: { type: [String], default: null },
    monthlyRevenueRange: { type: String, default: null },
    biggestChallenge: { type: String, default: null },
    preferredContactMethod: { type: String, default: null },
    emailConsent: { type: Boolean, default: false },
    emailConsentCapturedAt: { type: Date, default: null },
    emailConsentSource: { type: String, default: null },
    smsConsent: { type: Boolean, default: false },
    consentTimestamp: { type: Date, required: true, default: () => new Date() },
    consentTextVersion: { type: String, default: "legacy-unknown" },
    requestIp: { type: String, default: "unknown" },
    userAgent: { type: String, default: "unknown" },
    consentSourcePage: { type: String, default: "/contact" },
    status: { type: String, default: "New" },
  },
  { timestamps: { createdAt: "createdAt", updatedAt: false } },
);

export const ContactInquiryModel =
  (mongoose.models["ContactInquiry"] as mongoose.Model<IContactInquiry>) ||
  mongoose.model<IContactInquiry>("ContactInquiry", ContactInquirySchema);

export type ContactInquiry = mongoose.HydratedDocument<IContactInquiry>;
export type InsertContactInquiry = Omit<
  IContactInquiry,
  "createdAt" | "emailConsent" | "smsConsent" | "consentTimestamp" | "consentTextVersion" | "requestIp" | "userAgent" | "consentSourcePage" | "status"
> & Partial<Pick<IContactInquiry, "emailConsent" | "smsConsent" | "consentTimestamp" | "consentTextVersion" | "requestIp" | "userAgent" | "consentSourcePage" | "status">>;
