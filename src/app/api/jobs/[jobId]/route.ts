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

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ jobId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { jobId } = await params;

    const job = await Job.findOne({ _id: jobId, userId: user._id });

    if (!job) {
      throw new APIError(ErrorCodes.JOB_NOT_FOUND, "Job not found", 404);
    }

    // If the job is still processing and has an APIMart task_id, poll APIMart
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

          // Extract thumbnail for videos
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

          // Refund credits on failure
          try {
            await refundCredits(user._id, job.type, job._id);
          } catch (refundErr) {
            console.error("Credit refund failed:", refundErr);
          }
        } else {
          // Still processing -- update progress in metadata
          job.metadata = {
            ...job.metadata,
            apimartProgress: taskStatus.progress || 0,
            apimartEstimatedTime: taskStatus.estimated_time,
          };
          await job.save();
        }
      } catch (pollErr) {
        console.error("APIMart task polling error:", pollErr);
        // Don't fail the request -- return cached job state
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
