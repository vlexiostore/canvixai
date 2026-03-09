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
    const uri = process.env.MONGODB_URI;
    if (!uri || uri.trim() === "") {
      throw new APIError(
        ErrorCodes.INTERNAL_ERROR,
        "Database is not configured. Add MONGODB_URI to .env.local (e.g. mongodb://localhost:27017/canvixai) and ensure MongoDB is running.",
        503
      );
    }

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
    if (error instanceof APIError) {
      return errorResponse(error);
    }
    const errMsg = error instanceof Error ? error.message : "";
    const isConnectionError =
      errMsg.includes("connect") ||
      errMsg.includes("MongoNetworkError") ||
      errMsg.includes("ECONNREFUSED") ||
      errMsg.includes("querySrv");
    const message = isConnectionError
      ? errMsg.includes("querySrv") || errMsg.includes("ECONNREFUSED")
        ? "Cannot reach MongoDB (DNS or network). If using Atlas, try the standard connection string (mongodb://...) in MONGODB_URI instead of mongodb+srv://, or check firewall/DNS."
        : "Cannot connect to the database. Make sure MongoDB is running and MONGODB_URI in .env.local is correct."
      : undefined;
    console.error("Signup error:", error);
    return errorResponse(
      new APIError(ErrorCodes.INTERNAL_ERROR, message ?? "An unexpected error occurred", 500)
    );
  }
}
