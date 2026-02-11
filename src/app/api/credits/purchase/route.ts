import { NextRequest } from "next/server";
import { z } from "zod";
import { connectDB } from "@/lib/db";
import { getOrCreateUser } from "@/lib/auth";
import { createCheckoutSession, CREDIT_PACKAGES } from "@/lib/stripe";
import { errorResponse, successResponse, APIError, ErrorCodes } from "@/lib/errors";

const requestSchema = z.object({
  packageId: z.enum(["basic", "pro", "ultimate"]),
});

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const user = await getOrCreateUser();

    const body = await req.json();
    const data = requestSchema.parse(body);

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    const session = await createCheckoutSession(
      user.stripeCustomerId,
      user._id.toString(),
      data.packageId,
      `${appUrl}/dashboard?payment=success`,
      `${appUrl}/dashboard?payment=cancelled`
    );

    return successResponse({ checkoutUrl: session.url });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return errorResponse(
        new APIError(ErrorCodes.INVALID_INPUT, "Invalid input", 400, error.issues)
      );
    }
    return errorResponse(error as Error);
  }
}

export async function GET() {
  return successResponse({
    packages: CREDIT_PACKAGES.map((p) => ({
      id: p.id,
      name: p.name,
      credits: p.credits,
      price: p.price / 100,
      description: p.description,
    })),
  });
}
