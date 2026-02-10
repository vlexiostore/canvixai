import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher([
  "/",
  "/about",
  "/blog",
  "/pricing",
  "/tools",
  "/login(.*)",
  "/signup(.*)",
  "/api/auth/(.*)",
  "/api/pixlr/webhook(.*)",
  "/api/stripe/webhook(.*)",
]);

// Only enable Clerk middleware when BOTH keys are real (not empty/placeholder)
const clerkPub = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const clerkSec = process.env.CLERK_SECRET_KEY ?? "";
const hasClerk =
  clerkPub.startsWith("pk_") &&
  clerkSec.startsWith("sk_") &&
  clerkSec.length > 10;

function noopMiddleware(_request: NextRequest) {
  return NextResponse.next();
}

export default hasClerk
  ? clerkMiddleware(async (auth, request) => {
      if (!isPublicRoute(request)) {
        await auth.protect();
      }
    })
  : noopMiddleware;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
