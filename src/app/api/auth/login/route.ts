import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import User from "@/models/User";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const data = loginSchema.parse(body);

    // Find user by email
    const user = await User.findOne({
      $or: [
        { email: data.email },
        { clerkId: `local_${data.email}` },
      ],
    });

    if (!user) {
      throw new APIError(ErrorCodes.UNAUTHORIZED, "Invalid email or password", 401);
    }

    return successResponse({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
      plan: user.plan,
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
