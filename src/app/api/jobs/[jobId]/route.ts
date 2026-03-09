import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import {
  errorResponse,
  successResponse,
  APIError,
  ErrorCodes,
} from "@/lib/errors";
import { getApimartTaskStatus, extractResultUrl } from "@/lib/apimart-media";
import { refundCredits } from "@/lib/credits";
import Job from "@/models/Job";

const isLocalDev = process.env.NEXT_PUBLIC_CLERK_DISABLED_FOR_LOCAL === "true";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    const { jobId } = await params;

    if (isLocalDev && jobId.startsWith("apimart_")) {
      const taskId = jobId.replace("apimart_", "");
      const taskStatus = await getApimartTaskStatus(taskId);

      if (taskStatus.status === "completed") {
        const resultUrl = extractResultUrl(taskStatus);
        return successResponse({
          jobId,
          status: "completed",
          type: "image-gen",
          progress: 100,
          result: resultUrl ? { url: resultUrl, metadata: { apimartActualTime: taskStatus.actual_time } } : undefined,
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        });
      }

      if (taskStatus.status === "failed") {
        return successResponse({
          jobId,
          status: "failed",
          type: "image-gen",
          error: taskStatus.error?.message || "Generation failed",
          createdAt: new Date().toISOString(),
          completedAt: new Date().toISOString(),
        });
      }

      return successResponse({
        jobId,
        status: "processing",
        type: "image-gen",
        progress: taskStatus.progress || 0,
        createdAt: new Date().toISOString(),
      });
    }

    await connectDB();
    const user = await getOrCreateUser();

    const job = await Job.findOne({ _id: jobId, userId: user._id });

    if (!job) {
      throw new APIError(ErrorCodes.JOB_NOT_FOUND, "Job not found", 404);
    }

    if (job.status === "processing" && job.pixlrJobId) {
      try {
        const taskStatus = await getApimartTaskStatus(job.pixlrJobId);

        if (taskStatus.status === "completed") {
          const resultUrl = extractResultUrl(taskStatus);

          job.status = "completed";
          job.resultUrl = resultUrl || undefined;
          job.completedAt = new Date();
          job.metadata = {
            ...job.metadata,
            apimartProgress: 100,
            apimartActualTime: taskStatus.actual_time,
          };

          if (taskStatus.result?.videos?.[0]?.thumbnail_url) {
            job.thumbnailUrl = taskStatus.result.videos[0].thumbnail_url;
          }

          await job.save();
        } else if (taskStatus.status === "failed") {
          job.status = "failed";
          job.error =
            taskStatus.error?.message || "Generation failed on APIMart";
          job.completedAt = new Date();
          await job.save();

          try {
            await refundCredits(user._id, job.type, job._id);
          } catch (refundErr) {
            console.error("Credit refund failed:", refundErr);
          }
        } else {
          job.metadata = {
            ...job.metadata,
            apimartProgress: taskStatus.progress || 0,
            apimartEstimatedTime: taskStatus.estimated_time,
          };
          await job.save();
        }
      } catch (pollErr) {
        console.error("APIMart task polling error:", pollErr);
      }
    }

    return successResponse({
      jobId: job._id.toString(),
      status: job.status,
      type: job.type,
      progress: job.metadata?.apimartProgress,
      result: job.resultUrl
        ? {
            url: job.resultUrl,
            thumbnailUrl: job.thumbnailUrl,
            metadata: job.metadata,
          }
        : undefined,
      error: job.error,
      createdAt: job.createdAt.toISOString(),
      completedAt: job.completedAt?.toISOString(),
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
