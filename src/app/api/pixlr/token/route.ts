import { getOrCreateUser } from "@/lib/auth";
import { generatePixlrToken } from "@/lib/pixlr";
import { errorResponse, successResponse } from "@/lib/errors";
import { connectDB } from "@/lib/db";

export async function POST() {
  try {
    await connectDB();
    await getOrCreateUser();

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const token = generatePixlrToken({
      mode: "embedded",
      origin: appUrl,
      settings: {
        referrer: "Canvix AI",
        accent: "purple",
        workspace: "dark",
        tabLimit: 1,
      },
    });

    return successResponse({ token });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
