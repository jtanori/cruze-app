import type { NextRequest } from "next/server";

/**
 * S1 — Per-instance sliding-window rate limiting for /api/*.
 *
 * In-memory by design: it blunts single-instance abuse (burst scripts,
 * the open POST-era spray pattern) at zero infra cost. Serverless isolates
 * do NOT share buckets — graduate to Upstash/Arcjet when global enforcement
 * matters (see audit S1).
 */

const WINDOW_MS = 60_000;
const MAX_REQUESTS_PER_WINDOW = 60;

const buckets = new Map<string, number[]>();

export interface RateLimitResult {
  limited: boolean;
  retryAfterSec: number;
}

export function isRateLimited(ip: string, now: number = Date.now()): RateLimitResult {
  const hits = (buckets.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (hits.length >= MAX_REQUESTS_PER_WINDOW) {
    const retryAfterSec = Math.max(
      1,
      Math.ceil((hits[0] + WINDOW_MS - now) / 1000)
    );
    return { limited: true, retryAfterSec };
  }
  hits.push(now);
  buckets.set(ip, hits);
  if (buckets.size > 5000) {
    // Bound memory: drop the oldest bucket.
    const oldest = buckets.keys().next().value;
    if (oldest !== undefined) buckets.delete(oldest);
  }
  return { limited: false, retryAfterSec: 0 };
}

/** Test/edge hook — not used in production paths. */
export function clearRateLimitBuckets(): void {
  buckets.clear();
}

/** Best-effort client IP (Vercel sets x-forwarded-for). */
export function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || "unknown";
}
