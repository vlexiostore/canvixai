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
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
