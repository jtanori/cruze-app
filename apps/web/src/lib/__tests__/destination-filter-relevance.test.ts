import { describe, it, expect } from "vitest";
import {
  filterDestinations,
  type Place,
} from "../destination-filter";
import { mapPlaceToDestination } from "../trip-destination";
import { buildSetupUrl } from "../trip-navigation";

function place(overrides: Partial<Place> = {}): Place {
  return {
    id: "p1",
    name: "Place",
    latitude: 32.71,
    longitude: -117.16,
    country: "US",
    countryCode: "US",
    ...overrides,
  };
}

describe("filterDestinations — border-relevance exception", () => {
  it("admits opposite-country places untouched", () => {
    const out = filterDestinations(
      [place({ id: "sd", country: "US" })],
      "MX"
    );
    expect(out).toHaveLength(1);
    expect(out[0].borderCrossingId).toBeUndefined();
  });

  it("admits same-country border-relevant places with a candidate", () => {
    const out = filterDestinations(
      [
        place({
          id: "sonoyta",
          name: "Sonoyta",
          latitude: 31.861,
          longitude: -112.85,
          country: "MX",
        }),
      ],
      "MX"
    );
    expect(out).toHaveLength(1);
    expect(out[0].borderCrossingId).toBe("lukeville");
    expect(out[0].borderCrossingName).toBeTruthy();
    expect(out[0].borderRelevance?.relationship).toBe("adjacent");
    // Destination itself untouched.
    expect(out[0].name).toBe("Sonoyta");
    expect(out[0].country).toBe("MX");
  });

  it("ranks border-relevant rows before opposite-country rows", () => {
    const out = filterDestinations(
      [
        place({ id: "us1", name: "Sonoma", latitude: 38.29, longitude: -122.45, country: "US" }),
        place({ id: "us2", name: "Ohio", latitude: 39.98, longitude: -81.9, country: "US" }),
        place({
          id: "sonoyta",
          name: "Sonoyta",
          latitude: 31.861,
          longitude: -112.85,
          country: "MX",
        }),
      ],
      "MX"
    );
    expect(out.map((p) => p.id)).toEqual(["sonoyta", "us1", "us2"]);
  });

  it("excludes same-country non-relevant places (CDMX)", () => {
    const out = filterDestinations(
      [
        place({
          id: "cdmx",
          name: "Ciudad de México",
          latitude: 19.4326,
          longitude: -99.1332,
          country: "MX",
        }),
      ],
      "MX"
    );
    expect(out).toHaveLength(0);
  });

  it("excludes same-country places without finite coordinates", () => {
    const out = filterDestinations(
      [place({ id: "x", country: "MX", latitude: NaN, longitude: NaN })],
      "MX"
    );
    expect(out).toHaveLength(0);
  });

  it("UNKNOWN user passes everything through without candidates", () => {
    const out = filterDestinations(
      [
        place({ id: "cdmx", country: "MX", latitude: 19.4326, longitude: -99.1332 }),
        place({ id: "sd", country: "US" }),
      ],
      "UNKNOWN"
    );
    expect(out).toHaveLength(2);
    expect(out.every((p) => p.borderCrossingId === undefined)).toBe(true);
  });
});

describe("candidate plumbing — destination never rewritten", () => {
  it("mapPlaceToDestination carries the candidate id", () => {
    const selection = mapPlaceToDestination({
      id: "sonoyta",
      name: "Sonoyta",
      latitude: 31.861,
      longitude: -112.85,
      country: "MX",
      countryCode: "MX",
      borderCrossingId: "lukeville",
    } as any);
    expect(selection.name).toBe("Sonoyta");
    expect(selection.country).toBe("MX");
    expect(selection.crossingCandidateId).toBe("lukeville");
  });

  it("omits the candidate field when absent", () => {
    const selection = mapPlaceToDestination({
      id: "sd",
      name: "San Diego",
      latitude: 32.71,
      longitude: -117.16,
      country: "US",
      countryCode: "US",
    } as any);
    expect(selection.crossingCandidateId).toBeUndefined();
  });

  it("buildSetupUrl keeps destination and candidate in separate params", () => {
    const url = buildSetupUrl(
      "es",
      {
        id: "sonoyta",
        name: "Sonoyta",
        lat: 31.861,
        lng: -112.85,
        country: "MX",
        crossingCandidateId: "lukeville",
      },
      "lukeville"
    );
    expect(url).toContain("crossing=lukeville");
    expect(url).toContain("dest=");
    expect(url).not.toContain("Lukeville");
  });
});
