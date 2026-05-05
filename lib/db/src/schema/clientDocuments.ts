import mongoose, { Schema } from "mongoose";

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
