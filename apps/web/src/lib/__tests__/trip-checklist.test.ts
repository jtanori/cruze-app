import { describe, it, expect } from "vitest";
import { buildTripChecklistItems } from "../trip-checklist";
import type { LiveCrossingSnapshot } from "../live-crossing/types";
import type { SelectedCrossing } from "../recommendation/types";

const t = (key: string, values?: Record<string, any>) =>
  values ? `${key}|${JSON.stringify(values)}` : key;

function makeSnapshot(overrides: Partial<LiveCrossingSnapshot> = {}): LiveCrossingSnapshot {
  return {
    crossingId: "san-ysidro",
    status: "open",
    waitTime: 30,
    totalJourneyTime: 60,
    isLive: true,
    generatedAt: new Date().toISOString(),
    freshness: "live",
    ...overrides,
  };
}

function makeSelected(overrides: Partial<SelectedCrossing> = {}): SelectedCrossing {
  return {
    crossingId: "san-ysidro",
    crossingName: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    waitTime: 30,
    totalJourneyTime: 60,
    status: "open",
    isLive: false,
    generatedAt: new Date(Date.now() - 90 * 60 * 1000).toISOString(),
    coordinates: { lat: 32.5431, lng: -117.0379 },
    ...overrides,
  } as SelectedCrossing;
}

function byId(items: ReturnType<typeof buildTripChecklistItems>, id: string) {
  return items.find((i) => i.id === id)!;
}

describe("buildTripChecklistItems", () => {
  it("prefers live snapshot over stale committed selection", () => {
    const items = buildTripChecklistItems({
      liveSnapshot: makeSnapshot({ status: "limited" }),
      recommendedCrossing: makeSelected({ status: "open" }),
      t,
    });
    // Live says limited → warning, even though committed says open
    expect(byId(items, "operational").status).toBe("warning");
    // Freshness from live generatedAt (now) → checked
    expect(byId(items, "freshness").status).toBe("checked");
  });

  it("falls back to committed selection without live data", () => {
    const items = buildTripChecklistItems({
      liveSnapshot: null,
      recommendedCrossing: makeSelected({ status: "open" }),
      t,
    });
    expect(byId(items, "operational").status).toBe("checked");
    // Committed generatedAt is 90 min old → unchecked
    expect(byId(items, "freshness").status).toBe("unchecked");
  });

  it("marks closed live status unchecked", () => {
    const items = buildTripChecklistItems({
      liveSnapshot: makeSnapshot({ status: "closed" }),
      recommendedCrossing: makeSelected(),
      t,
    });
    expect(byId(items, "operational").status).toBe("unchecked");
  });

  it("marks 45-min-old data as warning", () => {
    const items = buildTripChecklistItems({
      liveSnapshot: makeSnapshot({
        generatedAt: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
      }),
      recommendedCrossing: null,
      t,
    });
    expect(byId(items, "freshness").status).toBe("warning");
    expect(byId(items, "freshness").detail).toContain("45");
  });

  it("returns unchecked items with no data at all", () => {
    const items = buildTripChecklistItems({
      liveSnapshot: null,
      recommendedCrossing: null,
      t,
    });
    expect(byId(items, "operational").status).toBe("unchecked");
    expect(byId(items, "freshness").status).toBe("unchecked");
    expect(byId(items, "freshness").detail).toBeUndefined();
  });

  it("always includes docs and restrictions as unchecked", () => {
    const items = buildTripChecklistItems({
      liveSnapshot: makeSnapshot(),
      recommendedCrossing: null,
      t,
    });
    expect(byId(items, "docs").status).toBe("unchecked");
    expect(byId(items, "restrictions").status).toBe("unchecked");
  });
});
