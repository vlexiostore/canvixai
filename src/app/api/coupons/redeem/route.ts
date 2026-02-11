import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Coupon from "@/models/Coupon";
import User from "@/models/User";
import { PLAN_DEFINITIONS } from "@/types";
import type { UserPlan } from "@/types";

/**
 * POST /api/coupons/redeem — redeem a coupon code
 * Body: { code: string }
 *
 * On success:
 * - Activates the plan immediately
 * - Sets image/video credits
 * - Records coupon usage
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const body = await req.json();
    const { code } = body;

    if (!code || typeof code !== "string" || code.trim().length < 3) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "Please enter a valid coupon code.");
    }

    const normalizedCode = code.toUpperCase().trim();

    // Find coupon
    const coupon = await Coupon.findOne({ code: normalizedCode });
    if (!coupon) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Invalid coupon code. Please check and try again.", 404);
    }

    // Validate coupon
    if (!coupon.isActive) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "This coupon has been deactivated.");
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "This coupon has expired.");
    }

    if (coupon.usedCount >= coupon.maxUses) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "This coupon has been fully redeemed.");
    }

    // Check if user already redeemed this coupon
    if (coupon.usedBy.includes(user.clerkId)) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "You have already redeemed this coupon.");
    }

    // Also check user's redeemed list
    if (user.redeemedCoupons && user.redeemedCoupons.includes(normalizedCode)) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "You have already redeemed this coupon.");
    }

    const planDef = PLAN_DEFINITIONS[coupon.plan as UserPlan];

    // ── Activate plan on user ──
    const planPriority: Record<string, number> = { free: 0, basic: 1, pro: 2, ultimate: 3 };
    const currentPriority = planPriority[user.plan] || 0;
    const newPriority = planPriority[coupon.plan] || 0;

    // Only upgrade or refresh — never downgrade
    if (newPriority < currentPriority) {
      throw new APIError(
        ErrorCodes.INVALID_INPUT,
        `You already have a ${user.plan.toUpperCase()} plan which is higher. This coupon cannot downgrade your plan.`
      );
    }

    // Update user
    await User.findByIdAndUpdate(user._id, {
      plan: coupon.plan,
      imageCredits: planDef.imageCredits,
      imageCreditsUsed: 0,
      videoCredits: planDef.videoCredits,
      videoCreditsUsed: 0,
      // Also set legacy creditsBalance for backward compatibility
      creditsBalance: planDef.imageCredits + planDef.videoCredits,
      creditsUsed: 0,
      planActivatedAt: new Date(),
      $addToSet: { redeemedCoupons: normalizedCode },
    });

    // Update coupon usage
    await Coupon.findByIdAndUpdate(coupon._id, {
      $inc: { usedCount: 1 },
      $addToSet: { usedBy: user.clerkId },
    });

    return successResponse({
      message: `${planDef.name} plan activated successfully!`,
      plan: coupon.plan,
      imageCredits: planDef.imageCredits,
      videoCredits: planDef.videoCredits,
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
