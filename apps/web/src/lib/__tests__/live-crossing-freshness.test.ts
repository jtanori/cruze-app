import { describe, it, expect } from "vitest";
import { calculateCrossingFreshness, FRESHNESS_THRESHOLDS } from "../live-crossing/freshness";

describe("calculateCrossingFreshness", () => {
  const now = Date.now();

  it("returns 'live' for data less than 5 minutes old", () => {
    const generatedAt = new Date(now - 4 * 60 * 1000).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("live");
  });

  it("returns 'live' for data exactly at 0 age", () => {
    const generatedAt = new Date(now).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("live");
  });

  it("returns 'recent' for data between 5 and 30 minutes old", () => {
    const generatedAt = new Date(now - 10 * 60 * 1000).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("recent");
  });

  it("returns 'recent' just after 5 minutes", () => {
    const generatedAt = new Date(now - FRESHNESS_THRESHOLDS.LIVE_MAX_MS - 1).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("recent");
  });

  it("returns 'stale' for data between 30 and 120 minutes old", () => {
    const generatedAt = new Date(now - 60 * 60 * 1000).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("stale");
  });

  it("returns 'stale' just after 30 minutes", () => {
    const generatedAt = new Date(now - FRESHNESS_THRESHOLDS.RECENT_MAX_MS - 1).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("stale");
  });

  it("returns 'unavailable' for data older than 120 minutes", () => {
    const generatedAt = new Date(now - 3 * 60 * 60 * 1000).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("unavailable");
  });

  it("returns 'unavailable' just after 120 minutes", () => {
    const generatedAt = new Date(now - FRESHNESS_THRESHOLDS.STALE_MAX_MS - 1).toISOString();
    expect(calculateCrossingFreshness(generatedAt, now)).toBe("unavailable");
  });
});
