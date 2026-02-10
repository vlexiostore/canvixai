import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";
import User from "@/models/User";

const signupSchema = z.object({
  firstName: z.string().min(1).max(50),
  lastName: z.string().min(1).max(50),
  email: z.string().email(),
  password: z.string().min(6),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    const body = await req.json();
    const data = signupSchema.parse(body);

    // Check if user already exists
    const existing = await User.findOne({ email: data.email });
    if (existing) {
      throw new APIError(ErrorCodes.INVALID_INPUT, "An account with this email already exists", 409);
    }

    // Create user (using email as clerkId for local auth)
    const user = await User.create({
      clerkId: `local_${data.email}`,
      email: data.email,
      name: `${data.firstName} ${data.lastName}`.trim(),
      creditsBalance: 50,
    });

    return successResponse({
      userId: user._id.toString(),
      name: user.name,
      email: user.email,
    }, 201);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new APIError(ErrorCodes.INVALID_INPUT, "Invalid input", 400, error.issues)
      );
    }
    return errorResponse(error as Error);
  }
}
