import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/errors";
import Conversation from "@/models/Conversation";

/**
 * GET /api/conversations — list all conversations for the current user
 */
export async function GET() {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const conversations = await Conversation.find({ userId: user._id })
      .select("title mode updatedAt createdAt")
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    const data = conversations.map((c) => ({
      id: c._id.toString(),
      title: c.title || "New conversation",
      mode: c.mode,
      updatedAt: c.updatedAt?.toISOString() || c.createdAt?.toISOString(),
    }));

    return successResponse(data);
  } catch (error) {
    return errorResponse(error as Error);
  }
}
