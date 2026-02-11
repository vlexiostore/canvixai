import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/errors";

export async function GET() {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    return successResponse({
      balance: user.creditsBalance,
      used: user.creditsUsed,
      plan: user.plan,
      name: user.name || undefined,
      email: user.email || undefined,
      imageCredits: user.imageCredits ?? user.creditsBalance,
      imageCreditsUsed: user.imageCreditsUsed ?? 0,
      videoCredits: user.videoCredits ?? 0,
      videoCreditsUsed: user.videoCreditsUsed ?? 0,
      planActivatedAt: user.planActivatedAt || undefined,
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
