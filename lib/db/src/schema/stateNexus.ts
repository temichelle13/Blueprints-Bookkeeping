import mongoose, { Schema } from "mongoose";

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
