import { describe, it, expect, beforeEach } from "vitest";
import { useTripStore } from "@/stores/trip";
import type { TripRecommendation, SelectedCrossing } from "@/lib/recommendation/types";

function makeRecommendation(): TripRecommendation {
  return {
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
      status: "open",
      isLive: true,
      score: 85,
      reason: { code: "fastest_total_time", data: { deltaMinutes: 12 } },
      confidence: "high",
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
    generatedAt: "2026-01-01T00:00:00Z",
  };
}

function makeSelectedCrossing(): SelectedCrossing {
  return {
    crossingId: "san-ysidro",
    crossingName: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    waitTime: 35,
    totalJourneyTime: 65,
    status: "open",
    isLive: true,
    generatedAt: "2026-01-01T00:00:00Z",
    coordinates: { lat: 32.5431, lng: -117.0379 },
  };
}

describe("trip store — W6 lifecycle", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
  });

  it("complete() adds to completedTrips", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    useTripStore.getState().complete();

    const state = useTripStore.getState();
    expect(state.completedTrips).toHaveLength(1);
    expect(state.completedTrips[0].crossingId).toBe("san-ysidro");
  });

  it("complete() sets completed = true", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    expect(useTripStore.getState().completed).toBe(false);

    useTripStore.getState().complete();
    expect(useTripStore.getState().completed).toBe(true);
  });

  it("reset() clears all state", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    useTripStore.getState().complete();
    useTripStore.getState().reset();

    const state = useTripStore.getState();
    expect(state.recommendedCrossing).toBeNull();
    expect(state.completed).toBe(false);
    expect(state.completedTrips).toHaveLength(0);
  });

  it("setting recommendedCrossing activates the trip", () => {
    expect(useTripStore.getState().recommendedCrossing).toBeNull();

    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    expect(useTripStore.getState().recommendedCrossing).not.toBeNull();
    expect(useTripStore.getState().recommendedCrossing?.crossingId).toBe("san-ysidro");
  });

  it("completedTrips resets on reset()", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    useTripStore.getState().complete();
    expect(useTripStore.getState().completedTrips).toHaveLength(1);

    useTripStore.getState().reset();
    expect(useTripStore.getState().completedTrips).toHaveLength(0);
  });

  it("completedTrips entry has correct crossing data", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    useTripStore.getState().complete();

    const trip = useTripStore.getState().completedTrips[0];
    expect(trip.crossingId).toBe("san-ysidro");
    expect(trip.crossingName).toBe("San Ysidro");
  });

  it("complete() without recommendedCrossing still works", () => {
    useTripStore.getState().complete();

    const state = useTripStore.getState();
    expect(state.completed).toBe(true);
    expect(state.completedTrips).toHaveLength(1);
    expect(state.completedTrips[0].crossingId).toBe("");
    expect(state.completedTrips[0].crossingName).toBe("Cruce");
  });

  it("setSelectedCrossing stores directly without full recommendation", () => {
    const crossing = makeSelectedCrossing();
    useTripStore.getState().setSelectedCrossing(crossing);

    expect(useTripStore.getState().recommendedCrossing?.crossingId).toBe("san-ysidro");
    expect(useTripStore.getState().lastRecommendation).toBeNull();
  });
});
