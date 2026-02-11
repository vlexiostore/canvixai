import mongoose, { Schema, Document } from "mongoose";
import type { UserPlan } from "@/types";

export interface ICoupon extends Document {
  code: string;
  plan: Exclude<UserPlan, "free">;
  imageCredits: number;
  videoCredits: number;
  maxUses: number;
  usedCount: number;
  usedBy: string[]; // clerkId list
  isActive: boolean;
  expiresAt?: Date;
  createdBy: string; // admin email
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CouponSchema = new Schema<ICoupon>(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true, index: true },
    plan: {
      type: String,
      enum: ["basic", "pro", "ultimate"],
      required: true,
    },
    imageCredits: { type: Number, required: true },
    videoCredits: { type: Number, required: true },
    maxUses: { type: Number, default: 1 },
    usedCount: { type: Number, default: 0 },
    usedBy: [{ type: String }],
    isActive: { type: Boolean, default: true },
    expiresAt: { type: Date },
    createdBy: { type: String, required: true },
    note: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon ||
  mongoose.model<ICoupon>("Coupon", CouponSchema);
