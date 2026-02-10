import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import Project from "@/models/Project";

const createSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(500).optional(),
});

export async function GET() {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const projects = await Project.find({ userId: user._id })
      .sort({ updatedAt: -1 })
      .lean();

    return successResponse(
      projects.map((p) => ({
        id: p._id.toString(),
        name: p.name,
        description: p.description,
        thumbnailUrl: p.thumbnailUrl,
        fileCount: p.files.length,
        isStarred: p.isStarred,
        updatedAt: p.updatedAt.toISOString(),
      }))
    );
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const body = await req.json();
    const data = createSchema.parse(body);

    const project = await Project.create({
      userId: user._id,
      name: data.name,
      description: data.description,
    });

    return successResponse(
      {
        id: project._id.toString(),
        name: project.name,
        description: project.description,
        fileCount: 0,
        isStarred: false,
        updatedAt: project.updatedAt.toISOString(),
      },
      201
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new APIError(ErrorCodes.INVALID_INPUT, "Invalid input", 400, error.issues)
      );
    }
    return errorResponse(error as Error);
  }
}
