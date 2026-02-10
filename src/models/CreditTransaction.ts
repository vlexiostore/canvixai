import mongoose, { Schema, Document, Types } from "mongoose";
import type { CreditTransactionType } from "@/types";

export interface ICreditTransaction extends Document {
  userId: Types.ObjectId;
  amount: number;
  type: CreditTransactionType;
  action?: string;
  jobId?: Types.ObjectId;
  description?: string;
  createdAt: Date;
}

const CreditTransactionSchema = new Schema<ICreditTransaction>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true },
    type: {
      type: String,
      enum: ["purchase", "usage", "refund", "bonus"],
      required: true,
    },
    action: { type: String },
    jobId: { type: Schema.Types.ObjectId, ref: "Job" },
    description: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.CreditTransaction ||
  mongoose.model<ICreditTransaction>(
    "CreditTransaction",
    CreditTransactionSchema
  );
