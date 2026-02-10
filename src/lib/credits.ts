import { Types } from "mongoose";
import { connectDB } from "./db";
import User from "@/models/User";
import CreditTransaction from "@/models/CreditTransaction";
import { CREDIT_COSTS, type JobType } from "@/types";

/**
 * Check if a user has enough credits for an action.
 */
export async function checkCredits(
  userId: Types.ObjectId,
  cost: number
): Promise<boolean> {
  await connectDB();
  const user = await User.findById(userId).select("creditsBalance").lean();
  if (!user) return false;
  return user.creditsBalance >= cost;
}

/**
 * Deduct credits from a user's balance and log the transaction.
 * Returns false if insufficient balance.
 */
export async function deductCredits(
  userId: Types.ObjectId,
  action: JobType | "chat",
  jobId?: Types.ObjectId,
  description?: string
): Promise<boolean> {
  const cost = CREDIT_COSTS[action] ?? 0;
  if (cost === 0) return true;

  await connectDB();

  const user = await User.findOneAndUpdate(
    { _id: userId, creditsBalance: { $gte: cost } },
    {
      $inc: { creditsBalance: -cost, creditsUsed: cost },
    },
    { new: true }
  );

  if (!user) return false;

  await CreditTransaction.create({
    userId,
    amount: -cost,
    type: "usage",
    action,
    jobId,
    description: description ?? `Used ${cost} credits for ${action}`,
  });

  return true;
}

/**
 * Refund credits to a user (e.g. on failed job).
 */
export async function refundCredits(
  userId: Types.ObjectId,
  action: JobType | "chat",
  jobId?: Types.ObjectId
): Promise<void> {
  const cost = CREDIT_COSTS[action] ?? 0;
  if (cost === 0) return;

  await connectDB();

  await User.findByIdAndUpdate(userId, {
    $inc: { creditsBalance: cost, creditsUsed: -cost },
  });

  await CreditTransaction.create({
    userId,
    amount: cost,
    type: "refund",
    action,
    jobId,
    description: `Refund of ${cost} credits for failed ${action}`,
  });
}

/**
 * Add credits to a user (e.g. on purchase).
 */
export async function addCredits(
  userId: Types.ObjectId,
  amount: number,
  description: string
): Promise<void> {
  await connectDB();

  await User.findByIdAndUpdate(userId, {
    $inc: { creditsBalance: amount },
  });

  await CreditTransaction.create({
    userId,
    amount,
    type: "purchase",
    description,
  });
}

/**
 * Get the credit cost for a given action.
 */
export function getCreditCost(action: JobType | "chat"): number {
  return CREDIT_COSTS[action] ?? 0;
}
