import { describe, it, expect } from "vitest";
import {
  getBorderRelevance,
  ADJACENT_KM,
  ACCESS_KM,
} from "../border-relevance";

describe("getBorderRelevance", () => {
  it("marks Sonoyta adjacent to Lukeville", () => {
    const res = getBorderRelevance(31.861, -112.85);
    expect(res.relevant).toBe(true);
    expect(res.relationship).toBe("adjacent");
    expect(res.crossings[0].id).toBe("lukeville");
    expect(res.distanceToCrossing).toBeLessThan(ADJACENT_KM);
  });

  it("marks San Diego crossing-access to San Ysidro (same-side surfacing)", () => {
    const res = getBorderRelevance(32.7157, -117.1611);
    expect(res.relevant).toBe(true);
    expect(res.relationship).toBe("crossing_access");
    expect(res.crossings[0].id).toBe("san-ysidro");
  });

  it("marks far-interior places irrelevant (CDMX)", () => {
    const res = getBorderRelevance(19.4326, -99.1332);
    expect(res.relevant).toBe(false);
    expect(res.crossings).toEqual([]);
    expect(res.relationship).toBeUndefined();
  });

  it("lists all in-range crossings nearest-first", () => {
    // Between San Ysidro and Otay Mesa corridors.
    const res = getBorderRelevance(32.56, -116.95);
    expect(res.relevant).toBe(true);
    const distances = res.crossings.map((c) => c.distanceKm);
    expect([...distances].sort((a, b) => a - b)).toEqual(distances);
    expect(
      res.crossings.every((c) => c.distanceKm <= ACCESS_KM)
    ).toBe(true);
  });

  it("rejects non-finite coordinates", () => {
    expect(getBorderRelevance(NaN, -117).relevant).toBe(false);
    expect(getBorderRelevance(32.5, Infinity).relevant).toBe(false);
  });
});
