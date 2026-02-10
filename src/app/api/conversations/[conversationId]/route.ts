import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Conversation from "@/models/Conversation";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { conversationId } = await params;

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId: user._id,
    }).lean();

    if (!conversation) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Conversation not found", 404);
    }

    return successResponse({
      id: conversation._id.toString(),
      title: conversation.title,
      mode: conversation.mode,
      messages: conversation.messages.map((m: { role: string; content: string; metadata?: unknown; createdAt: Date }) => ({
        role: m.role,
        content: m.content,
        metadata: m.metadata,
        createdAt: m.createdAt.toISOString(),
      })),
      createdAt: conversation.createdAt.toISOString(),
      updatedAt: conversation.updatedAt.toISOString(),
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { conversationId } = await params;

    const conversation = await Conversation.findOneAndDelete({
      _id: conversationId,
      userId: user._id,
    });

    if (!conversation) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Conversation not found", 404);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
