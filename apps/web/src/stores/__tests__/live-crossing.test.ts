import { describe, it, expect, beforeEach } from "vitest";
import { useLiveCrossingStore, getCrossingChanges } from "../live-crossing";
import type { MergedCrossingData } from "@/lib/border-data-service";

function makeMergedCrossing(overrides: Partial<MergedCrossingData> = {}): MergedCrossingData {
  return {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    waitTimeNorthbound: 30,
    waitTimeSouthbound: 21,
    statusNorthbound: "OPEN",
    statusSouthbound: "OPEN",
    lanesNorthbound: [],
    lanesSouthbound: [],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    hours: "24/7",
    ...overrides,
  } as MergedCrossingData;
}

describe("live-crossing store", () => {
  beforeEach(() => {
    useLiveCrossingStore.getState().clear();
  });

  it("starts with null snapshot", () => {
    expect(useLiveCrossingStore.getState().snapshot).toBeNull();
    expect(useLiveCrossingStore.getState().previousSnapshot).toBeNull();
  });

  it("setSnapshot replaces snapshot and preserves previous", () => {
    const first = makeMergedCrossing({ waitTimeNorthbound: 20 });
    useLiveCrossingStore.getState().setSnapshot(first, "north", 60);

    expect(useLiveCrossingStore.getState().snapshot?.waitTime).toBe(20);
    expect(useLiveCrossingStore.getState().previousSnapshot).toBeNull();

    const second = makeMergedCrossing({ waitTimeNorthbound: 35 });
    useLiveCrossingStore.getState().setSnapshot(second, "north", 60);

    expect(useLiveCrossingStore.getState().snapshot?.waitTime).toBe(35);
    expect(useLiveCrossingStore.getState().previousSnapshot?.waitTime).toBe(20);
  });

  it("setSnapshot computes freshness from generatedAt", () => {
    const crossing = makeMergedCrossing({
      lastUpdated: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    });
    useLiveCrossingStore.getState().setSnapshot(crossing, "north", 60);

    expect(useLiveCrossingStore.getState().snapshot?.freshness).toBe("recent");
    expect(useLiveCrossingStore.getState().snapshot?.isLive).toBe(false);
  });

  it("setSnapshot derives isLive from freshness", () => {
    const crossing = makeMergedCrossing({ lastUpdated: new Date().toISOString() });
    useLiveCrossingStore.getState().setSnapshot(crossing, "north", 60);

    expect(useLiveCrossingStore.getState().snapshot?.isLive).toBe(true);
    expect(useLiveCrossingStore.getState().snapshot?.freshness).toBe("live");
  });

  it("setSnapshot maps southbound data correctly", () => {
    const crossing = makeMergedCrossing({
      statusSouthbound: "LIMITED",
      waitTimeSouthbound: 45,
    });
    useLiveCrossingStore.getState().setSnapshot(crossing, "south", 60);

    const snap = useLiveCrossingStore.getState().snapshot;
    expect(snap?.status).toBe("limited");
    expect(snap?.waitTime).toBe(45);
  });

  it("setError retains previous snapshot", () => {
    const crossing = makeMergedCrossing();
    useLiveCrossingStore.getState().setSnapshot(crossing, "north", 60);

    useLiveCrossingStore.getState().setError("fetch failed");

    expect(useLiveCrossingStore.getState().snapshot).not.toBeNull();
    expect(useLiveCrossingStore.getState().error).toBe("fetch failed");
  });

  it("clear resets all state", () => {
    const crossing = makeMergedCrossing();
    useLiveCrossingStore.getState().setSnapshot(crossing, "north", 60);
    useLiveCrossingStore.getState().clear();

    expect(useLiveCrossingStore.getState().snapshot).toBeNull();
    expect(useLiveCrossingStore.getState().previousSnapshot).toBeNull();
    expect(useLiveCrossingStore.getState().lastFetchAt).toBeNull();
    expect(useLiveCrossingStore.getState().error).toBeNull();
  });

  it("getCrossingChanges returns changes between snapshots", () => {
    const first = makeMergedCrossing({ waitTimeNorthbound: 20 });
    useLiveCrossingStore.getState().setSnapshot(first, "north", 60);

    const second = makeMergedCrossing({ waitTimeNorthbound: 50 });
    useLiveCrossingStore.getState().setSnapshot(second, "north", 60);

    const changes = getCrossingChanges();
    expect(changes.length).toBeGreaterThan(0);
    expect(changes[0].crossingId).toBe("san-ysidro");
    expect(changes[0].detectedAt).toBeDefined();
  });

  it("getCrossingChanges returns empty when no previous snapshot", () => {
    const crossing = makeMergedCrossing();
    useLiveCrossingStore.getState().setSnapshot(crossing, "north", 60);

    expect(getCrossingChanges()).toEqual([]);
  });
});
