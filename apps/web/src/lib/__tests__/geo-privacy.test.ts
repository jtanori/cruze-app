import { describe, it, expect } from "vitest";
import {
  roundCoord,
  sanitizePlace,
  sanitizeLatLng,
  capCompletedTrips,
  MAX_COMPLETED_TRIPS,
} from "../geo-privacy";

describe("roundCoord", () => {
  it("rounds to ~100m (3 decimals)", () => {
    expect(roundCoord(32.543128)).toBe(32.543);
    expect(roundCoord(-117.037893)).toBe(-117.038);
  });

  it("passes through non-finite input", () => {
    expect(roundCoord(NaN)).toBeNaN();
    expect(roundCoord(Infinity)).toBe(Infinity);
  });
});

describe("sanitizePlace / sanitizeLatLng", () => {
  it("rounds place coordinates without dropping fields", () => {
    const place = {
      id: "1",
      name: "Tijuana",
      latitude: 32.514941,
      longitude: -117.037213,
      country: "MX",
    };
    expect(sanitizePlace(place as any)).toMatchObject({
      name: "Tijuana",
      latitude: 32.515,
      longitude: -117.037,
    });
  });

  it("rounds lat/lng pairs", () => {
    expect(sanitizeLatLng({ lat: 32.54319, lng: -117.03799 })).toEqual({
      lat: 32.543,
      lng: -117.038,
    });
  });

  it("passes null through", () => {
    expect(sanitizePlace(null)).toBeNull();
    expect(sanitizeLatLng(null)).toBeNull();
  });
});

describe("capCompletedTrips", () => {
  it(`caps history at ${MAX_COMPLETED_TRIPS}`, () => {
    expect(MAX_COMPLETED_TRIPS).toBe(20);
    const trips = Array.from({ length: 25 }, (_, i) => ({ id: `${i}` }));
    const capped = capCompletedTrips(trips);
    expect(capped).toHaveLength(20);
    // Newest first ordering preserved.
    expect(capped[0]).toEqual({ id: "0" });
  });
});
