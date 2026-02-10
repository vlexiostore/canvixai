import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/errors";
import CreditTransaction from "@/models/CreditTransaction";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") || "1"));
    const limit = Math.min(50, Math.max(1, parseInt(url.searchParams.get("limit") || "20")));
    const skip = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      CreditTransaction.find({ userId: user._id })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      CreditTransaction.countDocuments({ userId: user._id }),
    ]);

    return successResponse({
      transactions: transactions.map((t) => ({
        id: t._id.toString(),
        amount: t.amount,
        type: t.type,
        action: t.action,
        description: t.description,
        createdAt: t.createdAt.toISOString(),
      })),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
