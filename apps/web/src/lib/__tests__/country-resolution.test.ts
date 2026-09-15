import { describe, it, expect } from "vitest";
import {
  resolveUserCountry,
  contextualDirectionForCountry,
} from "../country-resolution";

/**
 * Country comes from geocoding, never geometry. No bounding boxes:
 * Tijuana and San Diego share the same strip of earth, so coordinates
 * alone cannot tell them apart — anything but a geocoded answer is UNKNOWN.
 */
describe("resolveUserCountry", () => {
  it("valid Mapbox MX wins → HIGH", () => {
    expect(resolveUserCountry("MX")).toEqual({
      country: "MX",
      confidence: "HIGH",
    });
  });

  it("valid Mapbox US wins → HIGH", () => {
    expect(resolveUserCountry("US")).toEqual({
      country: "US",
      confidence: "HIGH",
    });
  });

  it("missing geocode → UNKNOWN → LOW (never a default side)", () => {
    expect(resolveUserCountry(null)).toEqual({
      country: "UNKNOWN",
      confidence: "LOW",
    });
    expect(resolveUserCountry(undefined)).toEqual({
      country: "UNKNOWN",
      confidence: "LOW",
    });
  });

  it("garbage geocode → UNKNOWN → LOW", () => {
    expect(resolveUserCountry("XX" as never)).toEqual({
      country: "UNKNOWN",
      confidence: "LOW",
    });
  });
});

describe("contextualDirectionForCountry", () => {
  it("MX → MX_TO_US, US → US_TO_MX, UNKNOWN → null", () => {
    expect(contextualDirectionForCountry("MX")).toBe("MX_TO_US");
    expect(contextualDirectionForCountry("US")).toBe("US_TO_MX");
    expect(contextualDirectionForCountry("UNKNOWN")).toBeNull();
  });
});
