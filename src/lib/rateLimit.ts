import type { UserPlan } from "@/types";

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

// In-memory store (use Redis for multi-instance production deployments)
const requests = new Map<string, RateLimitEntry>();

const LIMITS: Record<UserPlan, { requests: number; windowMs: number }> = {
  free: { requests: 10, windowMs: 60_000 },
  starter: { requests: 30, windowMs: 60_000 },
  pro: { requests: 60, windowMs: 60_000 },
  business: { requests: 200, windowMs: 60_000 },
};

/**
 * Check if a request is allowed under the rate limit.
 * Returns true if allowed, false if rate-limited.
 */
export function checkRateLimit(userId: string, plan: UserPlan): boolean {
  const limit = LIMITS[plan] ?? LIMITS.free;
  const now = Date.now();
  const windowKey = `${userId}:${Math.floor(now / limit.windowMs)}`;

  const current = requests.get(windowKey);

  if (!current || now > current.resetAt) {
    requests.set(windowKey, { count: 1, resetAt: now + limit.windowMs });
    return true;
  }

  if (current.count >= limit.requests) {
    return false;
  }

  current.count++;
  return true;
}

// Periodically clean up expired entries (every 5 minutes)
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, entry] of requests) {
      if (now > entry.resetAt) {
        requests.delete(key);
      }
    }
  }, 5 * 60_000);
}
