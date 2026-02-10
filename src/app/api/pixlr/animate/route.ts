import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { checkCredits, getCreditCost } from "@/lib/credits";
import { animateImage } from "@/lib/pixlr";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Job from "@/models/Job";

const requestSchema = z.object({
  imageUrl: z.string().url(),
  motionPrompt: z.string().max(500).optional(),
  duration: z.number().min(2).max(16).default(4),
  motionType: z.enum(["pan", "zoom", "parallax", "ai"]).default("ai"),
  intensity: z.enum(["subtle", "medium", "dynamic"]).default("medium"),
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

    const cost = getCreditCost("image-to-video");
    if (!(await checkCredits(user._id, cost))) {
      throw new APIError(ErrorCodes.INSUFFICIENT_CREDITS, "Not enough credits", 402);
    }

    const job = await Job.create({
      userId: user._id,
      type: "image-to-video",
      status: "pending",
      inputData: {
        imageUrl: data.imageUrl,
        settings: {
          motionPrompt: data.motionPrompt,
          duration: data.duration,
          motionType: data.motionType,
          intensity: data.intensity,
        },
      },
      creditsCost: cost,
    });

    const pixlrResponse = await animateImage({
      imageUrl: data.imageUrl,
      motionPrompt: data.motionPrompt,
      duration: data.duration,
      motionType: data.motionType,
      intensity: data.intensity,
      jobId: job._id.toString(),
    });

    job.pixlrJobId = pixlrResponse.job_id;
    job.status = "processing";
    job.startedAt = new Date();
    await job.save();

    return successResponse({
      jobId: job._id.toString(),
      status: "processing",
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
