import { describe, it, expect, beforeEach } from "vitest";
import { useTripStore } from "../trip";
import { useLocationStore } from "../location";
import { useCrossingDetectionStore } from "../crossing-detection";

/**
 * S1 — persisted state must never carry precise trails or unbounded history.
 * These tests exercise each store's persist.partialize contract directly.
 */
describe("persisted geo minimization", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
  });

  it("trip partialize rounds places and caps history", () => {
    const s = useTripStore.getState();
    s.setStart({ name: "Tijuana", latitude: 32.514941, longitude: -117.037213 } as any);
    s.setDestination({ name: "San Diego", latitude: 32.715736, longitude: -117.161087 } as any);

    const partialize = useTripStore.persist.getOptions().partialize!;
    const out = partialize(useTripStore.getState()) as any;

    expect(out.lastRecommendation).toBeUndefined();
    expect(out.start.latitude).toBe(32.515);
    expect(out.start.longitude).toBe(-117.037);
    expect(out.destination.latitude).toBe(32.716);
    // In-memory state keeps full precision.
    expect(useTripStore.getState().start?.latitude).toBe(32.514941);
  });

  it("trip partialize caps completedTrips at 20", () => {
    const partialize = useTripStore.persist.getOptions().partialize!;
    const state = {
      ...useTripStore.getState(),
      completedTrips: Array.from({ length: 30 }, (_, i) => ({ id: `${i}` })),
    };
    const out = partialize(state as any) as any;
    expect(out.completedTrips).toHaveLength(20);
  });

  it("location partialize rounds coordinates", () => {
    useLocationStore.getState().setLocation({
      lat: 32.543128,
      lng: -117.037893,
      accuracy: 12,
      timestamp: Date.now(),
      country: "MX",
    } as any);

    const partialize = useLocationStore.persist.getOptions().partialize!;
    const out = partialize(useLocationStore.getState()) as any;
    expect(out.location.lat).toBe(32.543);
    expect(out.location.lng).toBe(-117.038);
    expect(useLocationStore.getState().location?.lat).toBe(32.543128);
  });

  it("crossing-detection partialize drops trail and last position", () => {
    const store = useCrossingDetectionStore.getState();
    store.startMonitoring("san-ysidro", "San Ysidro", 30, true);
    store.updatePosition(32.543128, -117.037893);

    const partialize = useCrossingDetectionStore.persist.getOptions().partialize!;
    const out = partialize(useCrossingDetectionStore.getState()) as any;
    expect("userPosition" in out).toBe(false);
    expect("positionHistory" in out).toBe(false);
    // Monitoring metadata survives.
    expect(out.crossingId).toBe("san-ysidro");
    // In-memory trail intact for the live session.
    expect(useCrossingDetectionStore.getState().positionHistory).toHaveLength(1);
  });
});
