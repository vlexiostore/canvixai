import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { uploadToB2, downloadFile } from "@/lib/b2";
import { deductCredits, refundCredits } from "@/lib/credits";
import { verifyWebhookSignature } from "@/lib/pixlr";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Job from "@/models/Job";
import FileModel from "@/models/File";
export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();

    // Verify signature if present
    const signature = req.headers.get("x-pixlr-signature");
    if (signature && !verifyWebhookSignature(rawBody, signature)) {
      throw new APIError(ErrorCodes.UNAUTHORIZED, "Invalid webhook signature", 401);
    }

    const body = JSON.parse(rawBody);
    const { jobId, status, result, error } = body;

    await connectDB();

    // Find job by pixlrJobId or by our metadata jobId
    const metadataJobId = body.metadata?.jobId;
    const job = await Job.findOne(
      metadataJobId
        ? { _id: metadataJobId }
        : { pixlrJobId: jobId }
    );

    if (!job) {
      console.error("Webhook: job not found", { jobId, metadataJobId });
      return successResponse({ received: true });
    }

    if (status === "completed" && result) {
      // Download from Pixlr temporary URL and upload to B2
      const fileType = result.type === "video" ? "video" : "image";
      const extension = fileType === "video" ? "mp4" : "png";
      const b2Key = `${job.userId}/${job.type}/${crypto.randomUUID()}.${extension}`;

      const fileBuffer = await downloadFile(result.url);
      const b2Url = await uploadToB2(
        fileBuffer,
        b2Key,
        fileType === "video" ? "video/mp4" : "image/png"
      );

      // Create file record
      const file = await FileModel.create({
        userId: job.userId,
        jobId: job._id,
        type: "generated",
        fileType,
        filename: `${b2Key.split("/").pop()}`,
        b2Key,
        url: b2Url,
        sizeBytes: fileBuffer.length,
        mimeType: fileType === "video" ? "video/mp4" : "image/png",
        metadata: result.metadata,
      });

      // Update job
      job.status = "completed";
      job.resultUrl = b2Url;
      job.thumbnailUrl = result.thumbnail_url || b2Url;
      job.metadata = { ...result.metadata, fileId: file._id };
      job.completedAt = new Date();
      await job.save();

      // Deduct credits now that job succeeded
      await deductCredits(job.userId, job.type as Parameters<typeof deductCredits>[1], job._id);
    } else if (status === "failed") {
      job.status = "failed";
      job.error = error || "Processing failed";
      job.completedAt = new Date();
      await job.save();

      // No credits to refund since we haven't deducted yet
    }

    return successResponse({ received: true });
  } catch (err) {
    console.error("Webhook error:", err);
    return errorResponse(err as Error);
  }
}
