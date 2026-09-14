import { describe, it, expect, beforeEach, vi } from "vitest";
import { NextRequest, NextResponse } from "next/server";
import proxy from "./proxy";
import { clearRateLimitBuckets } from "./lib/rate-limit";

// next-intl middleware cannot load under vitest; stub it. API paths never
// reach it, and the page-path test only asserts delegation (not a rewrite).
vi.mock("next-intl/middleware", () => ({
  default: () => () =>
    NextResponse.json({ delegated: true }, { status: 599 }),
}));

/**
 * Regression: /api/* must bypass locale middleware (an earlier revision
 * rewrote /api/places to /es/api/places → 404) while still throttled.
 */
describe("proxy /api/* handling", () => {
  beforeEach(() => {
    clearRateLimitBuckets();
  });

  function apiRequest(path = "/api/places?query=tijuana"): NextRequest {
    return new NextRequest(`http://localhost${path}`, {
      headers: { "x-forwarded-for": "9.9.9.9" },
    });
  }

  it("passes API requests through without locale rewrite", () => {
    const res = proxy(apiRequest()) as Response;
    // NextResponse.next() — never a locale redirect.
    expect(res.status).toBe(200);
    expect(res.headers.get("location")).toBeNull();
  });

  it("returns 429 with Retry-After past the limit", () => {
    let res: Response | undefined;
    for (let i = 0; i < 61; i++) {
      res = proxy(apiRequest()) as unknown as Response;
    }
    expect(res!.status).toBe(429);
    expect(res!.headers.get("Retry-After")).toBeTruthy();
    expect(res!.headers.get("location")).toBeNull();
  });

  it("delegates page paths to locale middleware (no direct rewrite)", async () => {
    const res = (await proxy(
      new NextRequest("http://localhost/es/trip")
    )) as unknown as Response;
    // Stub marker proves the call reached next-intl instead of 404ing here.
    expect(res.status).toBe(599);
  });
});
