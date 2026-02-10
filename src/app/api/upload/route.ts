import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { uploadToB2 } from "@/lib/b2";
import { checkRateLimit } from "@/lib/rateLimit";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import FileModel from "@/models/File";

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];
const ALLOWED_VIDEO_TYPES = ["video/mp4", "video/webm"];
const MAX_IMAGE_SIZE = 25 * 1024 * 1024; // 25MB
const MAX_VIDEO_SIZE = 100 * 1024 * 1024; // 100MB

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    if (!checkRateLimit(user._id.toString(), user.plan)) {
      throw new APIError(ErrorCodes.RATE_LIMITED, "Too many requests", 429);
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "No file provided", 400);
    }

    const mimeType = file.type;
    const isImage = ALLOWED_IMAGE_TYPES.includes(mimeType);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(mimeType);

    if (!isImage && !isVideo) {
      throw new APIError(
        ErrorCodes.INVALID_FILE_TYPE,
        `Invalid file type: ${mimeType}. Allowed: ${[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(", ")}`,
        400
      );
    }

    const maxSize = isImage ? MAX_IMAGE_SIZE : MAX_VIDEO_SIZE;
    if (file.size > maxSize) {
      throw new APIError(
        ErrorCodes.FILE_TOO_LARGE,
        `File too large. Max size: ${maxSize / 1024 / 1024}MB`,
        400
      );
    }

    // Read file buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Generate unique key
    const extension = file.name.split(".").pop() || (isImage ? "png" : "mp4");
    const b2Key = `${user._id}/uploads/${crypto.randomUUID()}.${extension}`;

    // Upload to B2
    const url = await uploadToB2(buffer, b2Key, mimeType);

    // Create file record
    const fileDoc = await FileModel.create({
      userId: user._id,
      type: "upload",
      fileType: isImage ? "image" : "video",
      filename: `${b2Key.split("/").pop()}`,
      originalFilename: file.name,
      b2Key,
      url,
      sizeBytes: file.size,
      mimeType,
    });

    return successResponse({
      fileId: fileDoc._id.toString(),
      url,
      filename: fileDoc.filename,
      sizeBytes: fileDoc.sizeBytes,
    });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
