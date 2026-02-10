import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Project from "@/models/Project";

const updateSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(500).optional(),
  isStarred: z.boolean().optional(),
  addFiles: z.array(z.string()).optional(),
  removeFiles: z.array(z.string()).optional(),
});

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { projectId } = await params;

    const project = await Project.findOne({
      _id: projectId,
      userId: user._id,
    })
      .populate("files")
      .lean();

    if (!project) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Project not found", 404);
    }

    return successResponse({
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      thumbnailUrl: project.thumbnailUrl,
      files: project.files,
      isStarred: project.isStarred,
      createdAt: project.createdAt.toISOString(),
      updatedAt: project.updatedAt.toISOString(),
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { projectId } = await params;

    const body = await req.json();
    const data = updateSchema.parse(body);

    const updateOps: Record<string, unknown> = {};
    if (data.name !== undefined) updateOps.name = data.name;
    if (data.description !== undefined) updateOps.description = data.description;
    if (data.isStarred !== undefined) updateOps.isStarred = data.isStarred;

    const project = await Project.findOneAndUpdate(
      { _id: projectId, userId: user._id },
      {
        $set: updateOps,
        ...(data.addFiles ? { $addToSet: { files: { $each: data.addFiles } } } : {}),
        ...(data.removeFiles ? { $pull: { files: { $in: data.removeFiles } } } : {}),
      },
      { new: true }
    ).lean();

    if (!project) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Project not found", 404);
    }

    return successResponse({
      id: project._id.toString(),
      name: project.name,
      description: project.description,
      fileCount: project.files.length,
      isStarred: project.isStarred,
      updatedAt: project.updatedAt.toISOString(),
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

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ projectId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { projectId } = await params;

    const project = await Project.findOneAndDelete({
      _id: projectId,
      userId: user._id,
    });

    if (!project) {
      throw new APIError(ErrorCodes.NOT_FOUND, "Project not found", 404);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
