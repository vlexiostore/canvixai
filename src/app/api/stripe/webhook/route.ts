import { NextRequest } from "next/server";
import { connectDB } from "@/lib/db";
import { constructWebhookEvent, CREDIT_PACKAGES } from "@/lib/stripe";
import { addCredits } from "@/lib/credits";
import { errorResponse, successResponse } from "@/lib/errors";
import User from "@/models/User";
import { Types } from "mongoose";

export async function POST(req: NextRequest) {
  try {
    const rawBody = await req.text();
    const signature = req.headers.get("stripe-signature");

    if (!signature) {
      return Response.json({ error: "Missing signature" }, { status: 400 });
    }

    const event = constructWebhookEvent(rawBody, signature);

    if (event.type === "checkout.session.completed") {
      const session = event.data.object;
      const userId = session.metadata?.userId;
      const packageId = session.metadata?.packageId;
      const credits = parseInt(session.metadata?.credits || "0");

      if (!userId || !credits) {
        console.error("Stripe webhook: missing metadata", session.metadata);
        return successResponse({ received: true });
      }

      await connectDB();

      // Update Stripe customer ID if not set
      if (session.customer) {
        await User.findByIdAndUpdate(userId, {
          stripeCustomerId: session.customer as string,
        });
      }

      // Add credits
      const pkg = CREDIT_PACKAGES.find((p) => p.id === packageId);
      await addCredits(
        new Types.ObjectId(userId),
        credits,
        `Purchased ${pkg?.name || packageId} package (${credits} credits)`
      );
    }

    return successResponse({ received: true });
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return errorResponse(error as Error);
  }
}
