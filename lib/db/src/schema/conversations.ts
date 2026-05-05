import mongoose, { Schema } from "mongoose";

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
