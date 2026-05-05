import mongoose, { Schema, Types } from "mongoose";

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
