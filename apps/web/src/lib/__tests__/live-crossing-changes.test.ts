import { describe, it, expect } from "vitest";
import { detectCrossingChanges, WAIT_SURGE_ABSOLUTE, WAIT_SURGE_RELATIVE, WAIT_DROP_ABSOLUTE } from "../live-crossing/changes";
import type { LiveCrossingSnapshot } from "../live-crossing/types";

function makeSnapshot(overrides: Partial<LiveCrossingSnapshot> = {}): LiveCrossingSnapshot {
  return {
    crossingId: "san-ysidro",
    status: "open",
    waitTime: 30,
    totalJourneyTime: 60,
    isLive: true,
    generatedAt: "2026-01-01T00:00:00Z",
    freshness: "live",
    ...overrides,
  };
}

describe("detectCrossingChanges", () => {
  it("returns empty array when no previous snapshot", () => {
    const current = makeSnapshot();
    expect(detectCrossingChanges(null, current)).toEqual([]);
  });

  it("returns empty array when crossingId differs", () => {
    const previous = makeSnapshot({ crossingId: "otay-mesa" });
    const current = makeSnapshot({ crossingId: "san-ysidro" });
    expect(detectCrossingChanges(previous, current)).toEqual([]);
  });

  it("returns empty array for no significant change", () => {
    const previous = makeSnapshot({ waitTime: 30 });
    const current = makeSnapshot({ waitTime: 32 });
    expect(detectCrossingChanges(previous, current)).toEqual([]);
  });

  it("detects STATUS_CHANGE", () => {
    const previous = makeSnapshot({ status: "open" });
    const current = makeSnapshot({ status: "closed" });
    const changes = detectCrossingChanges(previous, current);
    expect(changes).toHaveLength(1);
    expect(changes[0].type).toBe("STATUS_CHANGE");
    expect(changes[0].previousStatus).toBe("open");
    expect(changes[0].currentStatus).toBe("closed");
  });

  it("detects WAIT_SURGE by absolute threshold", () => {
    const previous = makeSnapshot({ waitTime: 20 });
    const current = makeSnapshot({ waitTime: 20 + WAIT_SURGE_ABSOLUTE });
    const changes = detectCrossingChanges(previous, current);
    expect(changes.some((c) => c.type === "WAIT_SURGE")).toBe(true);
  });

  it("detects WAIT_SURGE by relative threshold", () => {
    const previous = makeSnapshot({ waitTime: 30 });
    const current = makeSnapshot({ waitTime: Math.round(30 * (1 + WAIT_SURGE_RELATIVE)) });
    const changes = detectCrossingChanges(previous, current);
    expect(changes.some((c) => c.type === "WAIT_SURGE")).toBe(true);
  });

  it("detects WAIT_DROP", () => {
    const previous = makeSnapshot({ waitTime: 45 });
    const current = makeSnapshot({ waitTime: 45 + WAIT_DROP_ABSOLUTE });
    const changes = detectCrossingChanges(previous, current);
    expect(changes.some((c) => c.type === "WAIT_DROP")).toBe(true);
  });

  it("detects multiple changes simultaneously", () => {
    const previous = makeSnapshot({ status: "open", waitTime: 20 });
    const current = makeSnapshot({ status: "closed", waitTime: 50 });
    const changes = detectCrossingChanges(previous, current);
    const types = changes.map((c) => c.type);
    expect(types).toContain("STATUS_CHANGE");
    expect(types).toContain("WAIT_SURGE");
  });

  it("returns empty array for same wait time", () => {
    const previous = makeSnapshot({ waitTime: 30 });
    const current = makeSnapshot({ waitTime: 30 });
    expect(detectCrossingChanges(previous, current)).toEqual([]);
  });
});
