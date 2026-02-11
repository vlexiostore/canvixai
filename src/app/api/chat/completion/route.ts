import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { deductCredits, checkCredits, getCreditCost } from "@/lib/credits";
import { sendChatCompletion, VALID_MODEL_IDS, DEFAULT_MODEL } from "@/lib/apimart";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Conversation from "@/models/Conversation";

const requestSchema = z.object({
  message: z.string().min(1).max(5000),
  mode: z.enum(["image", "video", "edit", "image-to-video", "enhance", "general"]).default("general"),
  model: z.string().optional().default(DEFAULT_MODEL),
  conversationId: z.string().nullable().optional(),
  conversationHistory: z
    .array(z.object({ role: z.string(), content: z.string() }))
    .nullable()
    .optional()
    .default([]),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    if (!checkRateLimit(user._id.toString(), user.plan)) {
      throw new APIError(ErrorCodes.RATE_LIMITED, "Too many requests", 429);
    }

    const body = await req.json();
    const data = requestSchema.parse(body);

    // Normalize conversationHistory (could be null from frontend)
    const conversationHistory = data.conversationHistory ?? [];

    // Check credits
    const cost = getCreditCost("chat");
    if (!(await checkCredits(user._id, cost, "chat"))) {
      throw new APIError(ErrorCodes.INSUFFICIENT_CREDITS, "Not enough credits", 402);
    }

    // Map extra modes to base modes for system prompt
    const modeMap: Record<string, string> = {
      "image-to-video": "video",
      "enhance": "general",
    };
    const chatMode = modeMap[data.mode] ?? data.mode;

    // Get or create conversation
    let conversation;
    if (data.conversationId) {
      conversation = await Conversation.findOne({
        _id: data.conversationId,
        userId: user._id,
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        userId: user._id,
        mode: chatMode === "image" || chatMode === "video" || chatMode === "edit" ? chatMode : "general",
        title: data.message.slice(0, 100),
        messages: [],
      });
    }

    // Build history from conversation or provided history
    const history =
      conversationHistory.length > 0
        ? conversationHistory
        : conversation.messages.map((m: { role: string; content: string }) => ({
            role: m.role,
            content: m.content,
          }));

    // Call APIMart with selected model
    const result = await sendChatCompletion(data.message, chatMode, history, data.model);

    // Save messages (ensure content is never empty to avoid validation issues)
    conversation.messages.push(
      { role: "user", content: data.message || "(image uploaded)", createdAt: new Date() },
      {
        role: "assistant",
        content: result.text || "(no response)",
        metadata: {
          suggestions: result.suggestions,
          enhancedPrompt: result.enhancedPrompt ?? undefined,
        },
        createdAt: new Date(),
      }
    );
    await conversation.save();

    // Deduct credits
    await deductCredits(user._id, "chat");

    return successResponse({
      text: result.text,
      enhancedPrompt: result.enhancedPrompt,
      suggestions: result.suggestions,
      awaitingConfirmation: result.awaitingConfirmation,
      conversationId: conversation._id.toString(),
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new APIError(ErrorCodes.INVALID_INPUT, "Invalid input", 400, error.issues)
      );
    }
    return errorResponse(error as Error);
  }
}
