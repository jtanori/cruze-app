import { describe, it, expect, beforeEach } from "vitest";
import { isRateLimited, clearRateLimitBuckets } from "../rate-limit";

describe("isRateLimited", () => {
  beforeEach(() => {
    clearRateLimitBuckets();
  });

  it("allows requests under the limit", () => {
    for (let i = 0; i < 60; i++) {
      expect(isRateLimited("1.2.3.4", 1_000_000 + i).limited).toBe(false);
    }
  });

  it("blocks the 61st request within the window with Retry-After", () => {
    const now = 1_000_000;
    for (let i = 0; i < 60; i++) isRateLimited("1.2.3.4", now + i);
    const res = isRateLimited("1.2.3.4", now + 60);
    expect(res.limited).toBe(true);
    expect(res.retryAfterSec).toBeGreaterThan(0);
  });

  it("slides the window: old hits expire", () => {
    const now = 1_000_000;
    for (let i = 0; i < 60; i++) isRateLimited("1.2.3.4", now + i);
    expect(isRateLimited("1.2.3.4", now + 60).limited).toBe(true);
    // Past the 60s window from the first hit — allowed again.
    expect(isRateLimited("1.2.3.4", now + 60_001).limited).toBe(false);
  });

  it("tracks IPs independently", () => {
    const now = 1_000_000;
    for (let i = 0; i < 60; i++) isRateLimited("1.2.3.4", now + i);
    expect(isRateLimited("1.2.3.4", now + 60).limited).toBe(true);
    expect(isRateLimited("5.6.7.8", now + 60).limited).toBe(false);
  });
});
