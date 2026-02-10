import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rateLimit";
import { checkCredits, getCreditCost } from "@/lib/credits";
import { generativeFill } from "@/lib/pixlr";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Job from "@/models/Job";

const requestSchema = z.object({
  imageUrl: z.string().url(),
  maskUrl: z.string().url(),
  prompt: z.string().min(1).max(500),
  mode: z.enum(["add", "remove", "replace"]).default("add"),
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

    const cost = getCreditCost("gen-fill");
    if (!(await checkCredits(user._id, cost))) {
      throw new APIError(ErrorCodes.INSUFFICIENT_CREDITS, "Not enough credits", 402);
    }

    const job = await Job.create({
      userId: user._id,
      type: "gen-fill",
      status: "pending",
      inputData: {
        imageUrl: data.imageUrl,
        prompt: data.prompt,
        settings: { maskUrl: data.maskUrl, mode: data.mode },
      },
      creditsCost: cost,
    });

    const pixlrResponse = await generativeFill({
      imageUrl: data.imageUrl,
      maskUrl: data.maskUrl,
      prompt: data.prompt,
      mode: data.mode,
      jobId: job._id.toString(),
    });

    job.pixlrJobId = pixlrResponse.job_id;
    job.status = "processing";
    job.startedAt = new Date();
    await job.save();

    return successResponse({
      jobId: job._id.toString(),
      status: "processing",
      estimatedTime: 15,
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
