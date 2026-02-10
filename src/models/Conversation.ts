import mongoose, { Schema, Document, Types } from "mongoose";
import type { MessageRole, ConversationMode } from "@/types";

export interface IMessage {
  role: MessageRole;
  content: string;
  metadata?: {
    suggestions?: string[];
    enhancedPrompt?: string;
    jobId?: Types.ObjectId;
  };
  createdAt: Date;
}

export interface IConversation extends Document {
  userId: Types.ObjectId;
  title?: string;
  mode: ConversationMode;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },
    content: { type: String, default: "" },
    metadata: {
      suggestions: [{ type: String }],
      enhancedPrompt: { type: String },
      jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const ConversationSchema = new Schema<IConversation>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    title: { type: String },
    mode: {
      type: String,
      enum: ["image", "video", "edit", "general"],
      default: "general",
    },
    messages: [MessageSchema],
  },
  { timestamps: true }
);

export default mongoose.models.Conversation ||
  mongoose.model<IConversation>("Conversation", ConversationSchema);
