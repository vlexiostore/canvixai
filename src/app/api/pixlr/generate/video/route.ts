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
  prompt: z.string().min(1).max(2500),
  model: z.string().optional().default(DEFAULT_VIDEO_MODEL),
  duration: z.number().min(4).max(16).default(5),
  resolution: z.enum(["720p", "1080p", "4k"]).default("720p"),
  aspectRatio: z
    .enum(["16:9", "9:16", "1:1", "4:3", "3:4"])
    .default("16:9"),
  style: z
    .enum(["cinematic", "anime", "realistic", "abstract", "slow-motion"])
    .optional()
    .default("cinematic"),
  imageUrls: z.array(z.string()).optional(),
  negativePrompt: z.string().max(500).optional(),
  audio: z.boolean().optional().default(false),
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

    const hasRefs = data.imageUrls && data.imageUrls.length > 0;

    // Validate model — if reference images are provided, force wan2.6 (image-to-video support)
    let model = VALID_VIDEO_MODEL_IDS.includes(data.model as any)
      ? data.model
      : DEFAULT_VIDEO_MODEL;

    if (hasRefs && model === "veo3.1-fast") {
      model = "kling-v2-6"; // veo3 doesn't support image refs, use kling instead
    }

    // Determine job type for credits
    const jobType = hasRefs ? "image-to-video" : "video-gen";
    const cost = getCreditCost(jobType);
    if (!(await checkCredits(user._id, cost, jobType))) {
      throw new APIError(
        ErrorCodes.INSUFFICIENT_CREDITS,
        "Not enough credits",
        402
      );
    }

    // Adjust duration for VEO3 (fixed at 8s)
    const duration =
      model.startsWith("veo3") ? 8 : data.duration;

    // Submit to APIMart (retry logic built-in for 429)
    const { taskId } = await submitVideoGeneration({
      model,
      prompt: data.prompt,
      duration,
      aspectRatio: data.aspectRatio,
      resolution: data.resolution,
      imageUrls: data.imageUrls,
      negativePrompt: data.negativePrompt,
      audio: data.audio,
    });

    // Create job as processing
    const job = await Job.create({
      userId: user._id,
      type: jobType,
      status: "processing",
      inputData: {
        prompt: data.prompt,
        imageUrl: hasRefs ? data.imageUrls![0] : undefined,
        settings: {
          model,
          duration,
          resolution: data.resolution,
          aspectRatio: data.aspectRatio,
          style: data.style,
          imageRefs: hasRefs ? data.imageUrls!.length : 0,
        },
      },
      pixlrJobId: taskId,
      creditsCost: cost,
      startedAt: new Date(),
    });

    // Deduct credits immediately
    await deductCredits(user._id, jobType, job._id);

    return successResponse({
      jobId: job._id.toString(),
      status: "processing",
      taskId,
      estimatedTime: hasRefs ? 90 : 60,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new APIError(ErrorCodes.INVALID_INPUT, "Invalid input", 400, error.issues)
      );
    }

    // Provide friendlier message for rate-limit errors from upstream
    const errMsg = (error as Error)?.message || "";
    if (errMsg.includes("429") || errMsg.includes("throttled") || errMsg.includes("rate limit")) {
      return errorResponse(
        new APIError(
          ErrorCodes.RATE_LIMITED,
          "Generation service is busy. Please wait a moment and try again.",
          429
        )
      );
    }

    return errorResponse(error as Error);
  }
}
