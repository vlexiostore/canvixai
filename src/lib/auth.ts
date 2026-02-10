import { connectDB } from "./db";
import User, { type IUser } from "@/models/User";
import { APIError, ErrorCodes } from "./errors";

const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkSec = process.env.CLERK_SECRET_KEY ?? "";
const hasClerk =
  clerkPub.startsWith("pk_") &&
  clerkSec.startsWith("sk_") &&
  clerkSec.length > 10;

/**
 * Get the authenticated user from Clerk, finding or creating them in MongoDB.
 * When Clerk is not configured, returns/creates a dev user for local development.
 */
export async function getOrCreateUser(): Promise<IUser> {
  await connectDB();

  if (!hasClerk) {
    // Dev mode: use a default dev user
    let devUser = await User.findOne({ clerkId: "dev_user" });
    if (!devUser) {
      devUser = await User.create({
        clerkId: "dev_user",
        email: "dev@canvix.local",
        name: "Dev User",
        creditsBalance: 1000,
      });
    }
    return devUser;
  }

  // Dynamic import to avoid errors when Clerk is not configured
  const { auth, currentUser } = await import("@clerk/nextjs/server");
  const { userId } = await auth();

  if (!userId) {
    throw new APIError(ErrorCodes.UNAUTHORIZED, "Unauthorized", 401);
  }

  let user = await User.findOne({ clerkId: userId });

  if (!user) {
    const clerkUser = await currentUser();
    user = await User.create({
      clerkId: userId,
      email: clerkUser?.emailAddresses[0]?.emailAddress || "",
      name: `${clerkUser?.firstName || ""} ${clerkUser?.lastName || ""}`.trim(),
      avatarUrl: clerkUser?.imageUrl,
    });
  }

  return user;
}

/**
 * Get the authenticated user's Clerk ID without hitting the database.
 * Throws APIError if not authenticated.
 */
export async function requireAuth(): Promise<string> {
  if (!hasClerk) return "dev_user";

  const { auth } = await import("@clerk/nextjs/server");
  const { userId } = await auth();
  if (!userId) {
    throw new APIError(ErrorCodes.UNAUTHORIZED, "Unauthorized", 401);
  }
  return userId;
}
