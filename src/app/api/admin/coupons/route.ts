import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { isAdmin } from "@/lib/admin";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Coupon from "@/models/Coupon";
import { PLAN_DEFINITIONS } from "@/types";
import type { UserPlan } from "@/types";
import crypto from "crypto";

function generateCode(length = 12): string {
  return crypto.randomBytes(length).toString("hex").toUpperCase().slice(0, length);
}

/**
 * GET /api/admin/coupons — list all coupons (admin only)
 */
export async function GET() {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    if (!isAdmin(user.email)) {
      throw new APIError(ErrorCodes.UNAUTHORIZED, "Admin access required", 403);
    }

    const coupons = await Coupon.find().sort({ createdAt: -1 }).lean();
    return successResponse({ coupons });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * POST /api/admin/coupons — generate new coupon(s) (admin only)
 * Body: { plan, count?, maxUses?, expiresInDays?, note?, customCode? }
 */
export async function POST(req: Request) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    if (!isAdmin(user.email)) {
      throw new APIError(ErrorCodes.UNAUTHORIZED, "Admin access required", 403);
    }

    const body = await req.json();
    const {
      plan,
      count = 1,
      maxUses = 1,
      expiresInDays,
      note,
      customCode,
    } = body;

    if (!plan || !["basic", "pro", "ultimate"].includes(plan)) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "Invalid plan. Must be basic, pro, or ultimate.");
    }

    const planDef = PLAN_DEFINITIONS[plan as UserPlan];
    const expiresAt = expiresInDays
      ? new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000)
      : undefined;

    const numCoupons = Math.min(Math.max(1, Number(count) || 1), 100);
    const created = [];

    for (let i = 0; i < numCoupons; i++) {
      const code = numCoupons === 1 && customCode
        ? customCode.toUpperCase().trim()
        : `${plan.toUpperCase().slice(0, 3)}-${generateCode(8)}`;

      // Check uniqueness
      const exists = await Coupon.findOne({ code });
      if (exists) continue; // skip collisions

      const coupon = await Coupon.create({
        code,
        plan,
        imageCredits: planDef.imageCredits,
        videoCredits: planDef.videoCredits,
        maxUses,
        expiresAt,
        createdBy: user.email,
        note: note || `${planDef.name} plan coupon`,
      });

      created.push(coupon);
    }

    return successResponse({ created, count: created.length }, 201);
  } catch (error) {
    return errorResponse(error as Error);
  }
}

/**
 * DELETE /api/admin/coupons — deactivate a coupon (admin only)
 * Body: { code }
 */
export async function DELETE(req: Request) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    if (!isAdmin(user.email)) {
      throw new APIError(ErrorCodes.UNAUTHORIZED, "Admin access required", 403);
    }

    const body = await req.json();
    const { code } = body;
    if (!code) throw new APIError(ErrorCodes.INVALID_INPUT, "Coupon code is required");

    const coupon = await Coupon.findOneAndUpdate(
      { code: code.toUpperCase().trim() },
      { isActive: false },
      { new: true }
    );

    if (!coupon) throw new APIError(ErrorCodes.NOT_FOUND, "Coupon not found", 404);

    return successResponse({ coupon });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
