import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { checkCredits, deductCredits, getCreditCost } from "@/lib/credits";
import {
  submitVideoGeneration,
  VALID_VIDEO_MODEL_IDS,
  DEFAULT_VIDEO_MODEL,
} from "@/lib/apimart-media";
import {
  errorResponse,
  successResponse,
  APIError,
  ErrorCodes,
} from "@/lib/errors";
import Job from "@/models/Job";

const requestSchema = z.object({
  prompt: z.string().min(1).max(1000),
  model: z.string().optional().default(DEFAULT_VIDEO_MODEL),
  duration: z.number().min(4).max(16).default(8),
  resolution: z.enum(["720p", "1080p", "4k"]).default("720p"),
  aspectRatio: z
    .enum(["16:9", "9:16", "1:1", "4:3", "3:4"])
    .default("16:9"),
  style: z
    .enum(["cinematic", "anime", "realistic", "abstract", "slow-motion"])
    .optional()
    .default("cinematic"),
  imageUrls: z.array(z.string()).optional(),
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

    // Validate model
    const model = VALID_VIDEO_MODEL_IDS.includes(data.model as any)
      ? data.model
      : DEFAULT_VIDEO_MODEL;

    const cost = getCreditCost("video-gen");
    if (!(await checkCredits(user._id, cost))) {
      throw new APIError(
        ErrorCodes.INSUFFICIENT_CREDITS,
        "Not enough credits",
        402
      );
    }

    // Adjust duration for VEO3 (fixed at 8s)
    const duration =
      model.startsWith("veo3") ? 8 : data.duration;

    // Submit to APIMart
    const { taskId } = await submitVideoGeneration({
      model,
      prompt: data.prompt,
      duration,
      aspectRatio: data.aspectRatio,
      resolution: data.resolution,
      imageUrls: data.imageUrls,
    });

    // Create job as processing
    const job = await Job.create({
      userId: user._id,
      type: "video-gen",
      status: "processing",
      inputData: {
        prompt: data.prompt,
        settings: {
          model,
          duration,
          resolution: data.resolution,
          aspectRatio: data.aspectRatio,
          style: data.style,
        },
      },
      pixlrJobId: taskId,
      creditsCost: cost,
      startedAt: new Date(),
    });

    // Deduct credits immediately
    await deductCredits(user._id, "video-gen", job._id);

    return successResponse({
      jobId: job._id.toString(),
      status: "processing",
      taskId,
      estimatedTime: 60,
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
