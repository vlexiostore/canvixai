import { NextRequest } from "next/server";
import { z } from "zod";
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
    })
      .select("messages")
      .lean();

    if (!conversation) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Conversation not found", 404);
    }

    return successResponse(
      conversation.messages.map((m: { role: string; content: string; metadata?: unknown; createdAt: Date }) => ({
        role: m.role,
        content: m.content,
        metadata: m.metadata,
        createdAt: m.createdAt.toISOString(),
      }))
    );
  } catch (error) {
    return errorResponse(error as Error);
  }
}

const addMessageSchema = z.object({
  role: z.enum(["user", "assistant", "system"]),
  content: z.string().min(1),
  metadata: z
    .object({
      suggestions: z.array(z.string()).optional(),
      enhancedPrompt: z.string().optional(),
      jobId: z.string().optional(),
    })
    .optional(),
});

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ conversationId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { conversationId } = await params;

    const body = await req.json();
    const data = addMessageSchema.parse(body);

    const conversation = await Conversation.findOneAndUpdate(
      { _id: conversationId, userId: user._id },
      {
        $push: {
          messages: {
            role: data.role,
            content: data.content,
            metadata: data.metadata,
            createdAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!conversation) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Conversation not found", 404);
    }

    return successResponse({ added: true }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new APIError(ErrorCodes.INVALID_INPUT, "Invalid input", 400, error.issues)
      );
    }
    return errorResponse(error as Error);
  }
}
