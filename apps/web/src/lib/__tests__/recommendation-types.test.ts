import { describe, it, expect } from "vitest";
import {
  selectCrossingFromRecommendation,
  selectCrossingFromAlternative,
  type TripRecommendation,
  type SelectedCrossing,
  type RecommendationAlternative,
} from "@/lib/recommendation/types";

function makeRecommendation(overrides?: Partial<TripRecommendation>): TripRecommendation {
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
    alternatives: [
      {
        crossingId: "otay-mesa",
        crossingName: "Otay Mesa",
        mexicanCity: "Tijuana",
        usCity: "San Diego",
        waitTime: 47,
        totalJourneyTime: 77,
        deltaMinutes: 12,
        status: "open",
        isLive: true,
        coordinates: { lat: 32.5556, lng: -117.0353 },
      },
    ],
    context: {
      originName: "Tijuana",
      destinationName: "San Diego",
      originLat: 32.5149,
      originLng: -117.0372,
      destLat: 32.7157,
      destLng: -117.1611,
      travelMode: "privateVehicle",
      direction: "MX_TO_US",
    },
    generatedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

describe("recommendation types", () => {
  describe("selectCrossingFromRecommendation", () => {
    it("extracts SelectedCrossing from primary", () => {
      const rec = makeRecommendation();
      const selected = selectCrossingFromRecommendation(rec);

      expect(selected.crossingId).toBe("san-ysidro");
      expect(selected.crossingName).toBe("San Ysidro");
      expect(selected.mexicanCity).toBe("Tijuana");
      expect(selected.usCity).toBe("San Diego");
      expect(selected.waitTime).toBe(35);
      expect(selected.totalJourneyTime).toBe(65);
      expect(selected.status).toBe("open");
      expect(selected.isLive).toBe(true);
      expect(selected.generatedAt).toBe("2026-01-01T00:00:00Z");
      expect(selected.coordinates).toEqual({ lat: 32.5431, lng: -117.0379 });
    });

    it("does not include recommendation-only fields", () => {
      const rec = makeRecommendation();
      const selected = selectCrossingFromRecommendation(rec);

      expect(selected).not.toHaveProperty("score");
      expect(selected).not.toHaveProperty("reason");
      expect(selected).not.toHaveProperty("confidence");
    });
  });

  describe("selectCrossingFromAlternative", () => {
    it("extracts SelectedCrossing from alternative", () => {
      const rec = makeRecommendation();
      const alt = rec.alternatives[0];
      const selected = selectCrossingFromAlternative(alt, rec);

      expect(selected.crossingId).toBe("otay-mesa");
      expect(selected.crossingName).toBe("Otay Mesa");
      expect(selected.waitTime).toBe(47);
      expect(selected.totalJourneyTime).toBe(77);
      expect(selected.coordinates).toEqual({ lat: 32.5556, lng: -117.0353 });
      expect(selected.generatedAt).toBe("2026-01-01T00:00:00Z");
    });
  });

  describe("TripRecommendation structure", () => {
    it("has primary with crossing summary", () => {
      const rec = makeRecommendation();
      expect(rec.primary.crossing.id).toBeTruthy();
      expect(rec.primary.crossing.name).toBeTruthy();
      expect(rec.primary.crossing.coordinates).toHaveProperty("lat");
      expect(rec.primary.crossing.coordinates).toHaveProperty("lng");
    });

    it("has context with origin/destination", () => {
      const rec = makeRecommendation();
      expect(rec.context.originName).toBeTruthy();
      expect(rec.context.destinationName).toBeTruthy();
      expect(typeof rec.context.originLat).toBe("number");
      expect(typeof rec.context.destLng).toBe("number");
    });

    it("alternatives carry coordinates", () => {
      const rec = makeRecommendation();
      for (const alt of rec.alternatives) {
        expect(alt.coordinates).toHaveProperty("lat");
        expect(alt.coordinates).toHaveProperty("lng");
      }
    });
  });
});
