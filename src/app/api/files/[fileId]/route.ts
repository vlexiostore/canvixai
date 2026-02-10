import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import FileModel from "@/models/File";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { fileId } = await params;

    const file = await FileModel.findOne({
      _id: fileId,
      userId: user._id,
      isDeleted: false,
    }).lean();

    if (!file) {
      throw new APIError(ErrorCodes.NOT_FOUND, "File not found", 404);
    }

    return successResponse({
      id: file._id.toString(),
      type: file.type,
      fileType: file.fileType,
      filename: file.filename,
      originalFilename: file.originalFilename,
      url: file.url,
      sizeBytes: file.sizeBytes,
      mimeType: file.mimeType,
      createdAt: file.createdAt.toISOString(),
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    await connectDB();
    const user = await getOrCreateUser();
    const { fileId } = await params;

    const file = await FileModel.findOneAndUpdate(
      { _id: fileId, userId: user._id, isDeleted: false },
      { isDeleted: true, deletedAt: new Date() },
      { new: true }
    );

    if (!file) {
      throw new APIError(ErrorCodes.NOT_FOUND, "File not found", 404);
    }

    return successResponse({ deleted: true });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
