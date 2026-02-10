import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { checkCredits, deductCredits, getCreditCost } from "@/lib/credits";
import {
  submitImageGeneration,
  qualityToResolution,
  VALID_IMAGE_MODEL_IDS,
  DEFAULT_IMAGE_MODEL,
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
  model: z.string().optional().default(DEFAULT_IMAGE_MODEL),
  style: z
    .enum([
      "photorealistic",
      "digital-art",
      "anime",
      "3d-render",
      "oil-painting",
      "watercolor",
      "sketch",
    ])
    .optional()
    .default("photorealistic"),
  aspectRatio: z
    .enum(["1:1", "16:9", "9:16", "4:3", "3:4", "2:3", "3:2", "21:9"])
    .default("1:1"),
  quality: z.enum(["standard", "hd", "ultra-hd"]).default("hd"),
  numImages: z.number().min(1).max(4).default(1),
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

    // Validate model — fall back to default
    const model = VALID_IMAGE_MODEL_IDS.includes(data.model as any)
      ? data.model
      : DEFAULT_IMAGE_MODEL;

    const cost = getCreditCost("image-gen");
    if (!(await checkCredits(user._id, cost))) {
      throw new APIError(
        ErrorCodes.INSUFFICIENT_CREDITS,
        "Not enough credits",
        402
      );
    }

    // Map quality to APIMart resolution
    const resolution = qualityToResolution(data.quality, model);

    // Submit to APIMart
    const { taskId } = await submitImageGeneration({
      model,
      prompt: data.prompt,
      size: data.aspectRatio,
      resolution,
      n: data.numImages,
      imageUrls: data.imageUrls,
    });

    // Create job as processing
    const job = await Job.create({
      userId: user._id,
      type: "image-gen",
      status: "processing",
      inputData: {
        prompt: data.prompt,
        settings: {
          model,
          style: data.style,
          aspectRatio: data.aspectRatio,
          quality: data.quality,
          resolution,
          numImages: data.numImages,
        },
      },
      pixlrJobId: taskId,
      creditsCost: cost,
      startedAt: new Date(),
    });

    // Deduct credits immediately
    await deductCredits(user._id, "image-gen", job._id);

    return successResponse({
      jobId: job._id.toString(),
      status: "processing",
      taskId,
      estimatedTime: 30,
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
