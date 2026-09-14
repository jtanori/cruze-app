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

describe("trip store — recommendation commitment", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
  });

  it("setRecommendedCrossing extracts SelectedCrossing from TripRecommendation", () => {
    const rec = makeRecommendation();
    useTripStore.getState().setRecommendedCrossing(rec);

    const state = useTripStore.getState();
    expect(state.recommendedCrossing).not.toBeNull();
    expect(state.recommendedCrossing?.crossingId).toBe("san-ysidro");
    expect(state.recommendedCrossing?.crossingName).toBe("San Ysidro");
    expect(state.recommendedCrossing?.waitTime).toBe(35);
    expect(state.recommendedCrossing?.totalJourneyTime).toBe(65);
    expect(state.recommendedCrossing?.coordinates).toEqual({ lat: 32.5431, lng: -117.0379 });
  });

  it("setRecommendedCrossing stores full TripRecommendation as lastRecommendation", () => {
    const rec = makeRecommendation();
    useTripStore.getState().setRecommendedCrossing(rec);

    const state = useTripStore.getState();
    expect(state.lastRecommendation).not.toBeNull();
    expect(state.lastRecommendation?.primary.crossing.id).toBe("san-ysidro");
    expect(state.lastRecommendation?.context.originName).toBe("Tijuana");
  });

  it("setRecommendedCrossing updates lastEvaluatedAt", () => {
    const before = new Date().toISOString();
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    const after = useTripStore.getState().lastEvaluatedAt;

    expect(after).toBeTruthy();
    expect(after! >= before).toBe(true);
  });

  it("setSelectedCrossing stores crossing directly", () => {
    const crossing: SelectedCrossing = {
      crossingId: "otay-mesa",
      crossingName: "Otay Mesa",
      mexicanCity: "Tijuana",
      usCity: "San Diego",
      waitTime: 47,
      totalJourneyTime: 77,
      status: "open",
      isLive: true,
      generatedAt: "2026-01-01T00:00:00Z",
      coordinates: { lat: 32.5556, lng: -117.0353 },
    };

    useTripStore.getState().setSelectedCrossing(crossing);

    const state = useTripStore.getState();
    expect(state.recommendedCrossing?.crossingId).toBe("otay-mesa");
    expect(state.lastRecommendation).toBeNull();
  });

  it("selected crossing is distinct from crossingCandidate", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());

    const state = useTripStore.getState();
    // crossingCandidate doesn't exist in the trip store — it lives in TripSetupState
    expect(state).not.toHaveProperty("crossingCandidate");
    // recommendedCrossing is the committed selection
    expect(state.recommendedCrossing).not.toBeNull();
  });

  it("complete() uses recommendedCrossing for completed trip", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    useTripStore.getState().complete();

    const state = useTripStore.getState();
    expect(state.completed).toBe(true);
    expect(state.completedTrips).toHaveLength(1);
    expect(state.completedTrips[0].crossingName).toBe("San Ysidro");
    expect(state.completedTrips[0].crossingId).toBe("san-ysidro");
  });

  it("reset clears recommendedCrossing and lastRecommendation", () => {
    useTripStore.getState().setRecommendedCrossing(makeRecommendation());
    useTripStore.getState().reset();

    const state = useTripStore.getState();
    expect(state.recommendedCrossing).toBeNull();
    expect(state.lastRecommendation).toBeNull();
  });
});
