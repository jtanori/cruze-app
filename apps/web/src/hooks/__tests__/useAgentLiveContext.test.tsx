import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAgentLiveContext } from "../useAgentLiveContext";
import { useTripStore } from "../../stores/trip";
import { useLiveCrossingStore } from "../../stores/live-crossing";
import { useAvisosStore } from "../../stores/avisos";
import type { MergedCrossingData } from "../../lib/border-data-service";
import type { Aviso } from "../../lib/avisos";

function makeCrossing(): MergedCrossingData {
  return {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de las Américas s/n, Tijuana, B.C.",
    usAddress: "7450 Camino de la Plaza, San Ysidro, CA 92173",
    country: "US",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    waitTimeNorthbound: 30,
    waitTimeSouthbound: 20,
    statusNorthbound: "OPEN",
    statusSouthbound: "OPEN",
    lanesNorthbound: [],
    lanesSouthbound: [],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    hours: "24/7",
  } as MergedCrossingData;
}

function makeAviso(id: string, crossingId = "san-ysidro"): Aviso {
  return {
    id,
    type: "crossing_changed",
    severity: "warning",
    title: "Test",
    description: "Test aviso",
    crossingId,
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
  };
}

describe("useAgentLiveContext", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
    useLiveCrossingStore.getState().clear();
    useAvisosStore.getState().reset();
  });

  it("returns empty context with no trip, snapshot, or avisos", () => {
    const { result, unmount } = renderHook(() => useAgentLiveContext());
    expect(result.current.hasActiveTrip).toBe(false);
    expect(result.current.hasLiveCrossingData).toBe(false);
    expect(result.current.unreadAvisoCount).toBe(0);
    expect(result.current.latestAviso).toBeNull();
    unmount();
  });

  it("aggregates trip + live snapshot + avisos", () => {
    useTripStore.getState().setStart({ name: "Tijuana" } as any);
    useTripStore.getState().setDestination({ name: "San Diego" } as any);
    useLiveCrossingStore.getState().setSnapshot(makeCrossing(), "north", 60);
    useAvisosStore.getState().addAviso(makeAviso("a1"));

    const { result, unmount } = renderHook(() => useAgentLiveContext());
    expect(result.current.hasActiveTrip).toBe(true);
    expect(result.current.origin).toBe("Tijuana");
    expect(result.current.hasLiveCrossingData).toBe(true);
    expect(result.current.crossingWaitTime).toBe(30);
    expect(result.current.crossingStatus).toBe("open");
    expect(result.current.unreadAvisoCount).toBe(1);
    expect(result.current.latestAviso?.id).toBe("a1");
    unmount();
  });

  it("reacts to aviso store changes", () => {
    const { result, unmount } = renderHook(() => useAgentLiveContext());
    expect(result.current.unreadAvisoCount).toBe(0);

    act(() => {
      useAvisosStore.getState().addAviso(makeAviso("a1"));
    });
    expect(result.current.unreadAvisoCount).toBe(1);

    // Different crossingId escapes the 30-min same-crossing+type dedup window
    act(() => {
      useAvisosStore.getState().addAviso(makeAviso("a2", "otay-mesa"));
    });
    expect(result.current.unreadAvisoCount).toBe(2);
    unmount();
  });

  it("reacts to live snapshot updates", () => {
    const { result, unmount } = renderHook(() => useAgentLiveContext());
    expect(result.current.hasLiveCrossingData).toBe(false);

    act(() => {
      useLiveCrossingStore.getState().setSnapshot(makeCrossing(), "north", 60);
    });
    expect(result.current.hasLiveCrossingData).toBe(true);
    expect(result.current.crossingWaitTime).toBe(30);
    unmount();
  });

  it("derives isLive === freshness === live invariant", () => {
    useLiveCrossingStore.getState().setSnapshot(makeCrossing(), "north", 60);
    const { result, unmount } = renderHook(() => useAgentLiveContext());
    // Fresh snapshot (lastUpdated=now) must be live
    expect(result.current.crossingFreshness).toBe("live");
    const snapshot = useLiveCrossingStore.getState().snapshot;
    expect(snapshot?.isLive).toBe(true);
    unmount();
  });
});
