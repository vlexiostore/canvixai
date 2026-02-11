import { Types } from "mongoose";
import { connectDB } from "./db";
import User from "@/models/User";
import CreditTransaction from "@/models/CreditTransaction";
import { CREDIT_COSTS, type JobType } from "@/types";

// ---- Credit pool helpers ----

/** Actions that consume video credits */
const VIDEO_ACTIONS: Set<string> = new Set([
  "video-gen",
  "image-to-video",
]);

/** Determine which credit pool (image or video) an action draws from */
function getCreditPool(action: JobType | "chat"): "image" | "video" | "none" {
  if (action === "chat") return "none"; // chat is unlimited on paid plans, 1 credit on free
  if (VIDEO_ACTIONS.has(action)) return "video";
  return "image";
}

/**
 * Check if a user has enough credits for an action.
 * Checks the correct credit pool (image vs video).
 */
export async function checkCredits(
  userId: Types.ObjectId,
  cost: number,
  action?: JobType | "chat"
): Promise<boolean> {
  if (cost === 0) return true;

  await connectDB();
  const user = await User.findById(userId)
    .select("creditsBalance imageCredits imageCreditsUsed videoCredits videoCreditsUsed plan")
    .lean();
  if (!user) return false;

  const pool = action ? getCreditPool(action) : "image";

  if (pool === "video") {
    const remaining = (user.videoCredits ?? 0) - (user.videoCreditsUsed ?? 0);
    return remaining >= cost;
  }

  if (pool === "image") {
    const remaining = (user.imageCredits ?? user.creditsBalance ?? 0) - (user.imageCreditsUsed ?? 0);
    return remaining >= cost;
  }

  // "none" pool (chat) — check legacy balance as fallback
  return (user.creditsBalance ?? 0) >= cost;
}

/**
 * Deduct credits from a user's balance and log the transaction.
 * Deducts from the correct credit pool (image vs video).
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

  const pool = getCreditPool(action);

  let user;

  if (pool === "video") {
    // Deduct from videoCreditsUsed (increment used, leave total unchanged)
    user = await User.findOneAndUpdate(
      {
        _id: userId,
        $expr: { $gte: [{ $subtract: ["$videoCredits", "$videoCreditsUsed"] }, cost] },
      },
      {
        $inc: { videoCreditsUsed: cost, creditsUsed: cost },
      },
      { new: true }
    );
  } else if (pool === "image") {
    // Deduct from imageCreditsUsed
    user = await User.findOneAndUpdate(
      {
        _id: userId,
        $expr: { $gte: [{ $subtract: ["$imageCredits", "$imageCreditsUsed"] }, cost] },
      },
      {
        $inc: { imageCreditsUsed: cost, creditsUsed: cost },
      },
      { new: true }
    );
  } else {
    // Legacy fallback for chat
    user = await User.findOneAndUpdate(
      { _id: userId, creditsBalance: { $gte: cost } },
      {
        $inc: { creditsBalance: -cost, creditsUsed: cost },
      },
      { new: true }
    );
  }

  if (!user) return false;

  await CreditTransaction.create({
    userId,
    amount: -cost,
    type: "usage",
    action,
    jobId,
    description: description ?? `Used ${cost} ${pool} credits for ${action}`,
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

  const pool = getCreditPool(action);

  if (pool === "video") {
    await User.findByIdAndUpdate(userId, {
      $inc: { videoCreditsUsed: -cost, creditsUsed: -cost },
    });
  } else if (pool === "image") {
    await User.findByIdAndUpdate(userId, {
      $inc: { imageCreditsUsed: -cost, creditsUsed: -cost },
    });
  } else {
    await User.findByIdAndUpdate(userId, {
      $inc: { creditsBalance: cost, creditsUsed: -cost },
    });
  }

  await CreditTransaction.create({
    userId,
    amount: cost,
    type: "refund",
    action,
    jobId,
    description: `Refund of ${cost} ${pool} credits for failed ${action}`,
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
