import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { uploadToB2 } from "@/lib/b2";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";

/**
 * POST /api/upload/reference
 * Accepts { dataUrl: string } — a base64 data URL
 * Uploads it to B2 and returns the public URL so it can be passed to APIMart
 */
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const body = await req.json();
    const { dataUrl } = body;

    if (!dataUrl || typeof dataUrl !== "string") {
      throw new APIError(ErrorCodes.INVALID_INPUT, "Missing dataUrl field", 400);
    }

    // Parse the data URL
    const match = dataUrl.match(/^data:(image\/\w+);base64,(.+)$/);
    if (!match) {
      throw new APIError(
        ErrorCodes.INVALID_INPUT,
        "Invalid data URL format. Expected data:image/*;base64,...",
        400
      );
    }

    const mimeType = match[1];
    const base64Data = match[2];
    const buffer = Buffer.from(base64Data, "base64");

    // Limit: 25MB
    if (buffer.length > 25 * 1024 * 1024) {
      throw new APIError(ErrorCodes.FILE_TOO_LARGE, "Image too large (max 25MB)", 400);
    }

    const ext = mimeType.split("/")[1] || "png";
    const b2Key = `${user._id}/references/${crypto.randomUUID()}.${ext}`;

    const url = await uploadToB2(buffer, b2Key, mimeType);

    return successResponse({ url });
  } catch (error) {
    return errorResponse(error as Error);
  }
}
