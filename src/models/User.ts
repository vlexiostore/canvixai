import mongoose, { Schema, Document } from "mongoose";
import type { UserPlan } from "@/types";

export interface IUser extends Document {
  clerkId: string;
  email: string;
  name?: string;
  avatarUrl?: string;
  plan: UserPlan;
  creditsBalance: number;
  creditsUsed: number;
  stripeCustomerId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    clerkId: { type: String, required: true, unique: true, index: true },
    email: { type: String, required: true },
    name: { type: String },
    avatarUrl: { type: String },
    plan: {
      type: String,
      enum: ["free", "starter", "pro", "business"],
      default: "free",
    },
    creditsBalance: { type: Number, default: 50 },
    creditsUsed: { type: Number, default: 0 },
    stripeCustomerId: { type: String },
  },
  { timestamps: true }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
