import { describe, it, expect, beforeEach } from "vitest";
import { getAgentContext } from "../agent-context";
import { useTripStore } from "../../stores/trip";
import { useLiveCrossingStore } from "../../stores/live-crossing";
import { useAvisosStore } from "../../stores/avisos";
import type { MergedCrossingData } from "../border-data-service";
import type { Aviso } from "../avisos";

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

function makeAviso(overrides: Partial<Aviso> = {}): Aviso {
  return {
    id: "aviso-1",
    type: "crossing_changed",
    severity: "warning",
    title: "Test",
    description: "Test aviso",
    crossingId: "san-ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
    ...overrides,
  };
}

describe("getAgentContext", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
    useLiveCrossingStore.getState().clear();
    useAvisosStore.getState().reset();
  });

  it("returns empty context when no trip", () => {
    const ctx = getAgentContext();
    expect(ctx.hasActiveTrip).toBe(false);
    expect(ctx.origin).toBeNull();
    expect(ctx.destination).toBeNull();
    expect(ctx.selectedCrossingId).toBeNull();
  });

  it("returns trip context when trip is active", () => {
    useTripStore.getState().setStart({ name: "Tijuana", latitude: 32.5149, longitude: -117.0372 } as any);
    useTripStore.getState().setDestination({ name: "San Diego", latitude: 32.7157, longitude: -117.1611 } as any);

    const ctx = getAgentContext();
    expect(ctx.hasActiveTrip).toBe(true);
    expect(ctx.origin).toBe("Tijuana");
    expect(ctx.destination).toBe("San Diego");
  });

  it("returns live crossing data when snapshot exists", () => {
    const crossing = makeMergedCrossing();
    useLiveCrossingStore.getState().setSnapshot(crossing, "north", 60);

    const ctx = getAgentContext();
    expect(ctx.hasLiveCrossingData).toBe(true);
    expect(ctx.crossingStatus).toBe("open");
    expect(ctx.crossingFreshness).toBe("live");
  });

  it("returns null crossing data when no snapshot", () => {
    const ctx = getAgentContext();
    expect(ctx.hasLiveCrossingData).toBe(false);
    expect(ctx.crossingStatus).toBeNull();
    expect(ctx.crossingWaitTime).toBeNull();
  });

  it("returns aviso count", () => {
    useAvisosStore.getState().addAviso(makeAviso({ id: "a1" }));
    useAvisosStore.getState().addAviso(makeAviso({ id: "a2", read: true }));

    const ctx = getAgentContext();
    expect(ctx.unreadAvisoCount).toBe(1);
  });

  it("returns latest aviso", () => {
    const recent = makeAviso({
      id: "recent",
      timestamp: new Date().toISOString(),
    });
    useAvisosStore.getState().addAviso(recent);

    const ctx = getAgentContext();
    expect(ctx.latestAviso?.id).toBe("recent");
  });

  it("returns selected crossing from trip store", () => {
    useTripStore.getState().setStart({ name: "Tijuana", latitude: 32.5149, longitude: -117.0372 } as any);
    useTripStore.getState().setDestination({ name: "San Diego", latitude: 32.7157, longitude: -117.1611 } as any);

    // Simulate selecting a crossing via the store
    const rec = {
      primary: {
        crossing: {
          id: "san-ysidro",
          name: "San Ysidro",
          mexicanCity: "Tijuana",
          usCity: "San Diego",
          mexicanState: "Baja California",
          usState: "California",
          corridor: "tijuana-san-diego",
          coordinates: { lat: 32.5431, lng: -117.0379 },
        },
        waitTime: 35,
        totalJourneyTime: 65,
        status: "open" as const,
        isLive: true,
        score: 85,
        reason: { code: "fastest_total_time" as const },
        confidence: "high" as const,
      },
      alternatives: [],
      context: {
        originName: "Tijuana",
        destinationName: "San Diego",
        originLat: 32.5149,
        originLng: -117.0372,
        destLat: 32.7157,
        destLng: -117.1611,
      },
      generatedAt: new Date().toISOString(),
    };
    useTripStore.getState().setRecommendedCrossing(rec);

    const ctx = getAgentContext();
    expect(ctx.selectedCrossingId).toBe("san-ysidro");
    expect(ctx.selectedCrossingName).toBe("San Ysidro");
  });
});
