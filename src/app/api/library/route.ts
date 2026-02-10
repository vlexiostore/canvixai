import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse } from "@/lib/errors";
import Job from "@/models/Job";
import FileModel from "@/models/File";

/**
 * GET /api/library — returns all completed generated files + uploads for the user
 */
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const { searchParams } = new URL(req.url);
    const type = searchParams.get("type"); // "image" | "video" | null (all)
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "50", 10);

    // 1. Get completed jobs with result URLs
    const jobFilter: Record<string, unknown> = {
      userId: user._id,
      status: "completed",
      resultUrl: { $exists: true, $ne: null },
    };
    if (type === "image") jobFilter.type = "image-gen";
    else if (type === "video") jobFilter.type = "video-gen";

    const jobs = await Job.find(jobFilter)
      .sort({ completedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // 2. Get uploaded files
    const fileFilter: Record<string, unknown> = {
      userId: user._id,
      isDeleted: false,
    };
    if (type) fileFilter.fileType = type;

    const files = await FileModel.find(fileFilter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Merge into a unified list
    const items = [
      ...jobs.map((j) => ({
        id: j._id.toString(),
        source: "generated" as const,
        type: j.type === "video-gen" ? ("video" as const) : ("image" as const),
        url: j.resultUrl!,
        thumbnailUrl: j.thumbnailUrl || j.resultUrl!,
        prompt: j.inputData?.prompt || "",
        model: (j.inputData?.settings as Record<string, unknown>)?.model as string || "",
        createdAt: (j.completedAt || j.createdAt).toISOString(),
      })),
      ...files.map((f) => ({
        id: f._id.toString(),
        source: f.type as string,
        type: f.fileType as "image" | "video",
        url: f.url,
        thumbnailUrl: f.url,
        prompt: "",
        model: "",
        createdAt: f.createdAt.toISOString(),
      })),
    ];

    // Sort merged by date descending
    items.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    const totalJobs = await Job.countDocuments(jobFilter);
    const totalFiles = await FileModel.countDocuments(fileFilter);

    return successResponse({
      items: items.slice(0, limit),
      total: totalJobs + totalFiles,
      page,
      limit,
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
