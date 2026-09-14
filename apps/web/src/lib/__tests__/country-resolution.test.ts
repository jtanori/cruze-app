import { describe, it, expect } from "vitest";
import {
  resolveCountryFromCoordinates,
  resolveUserCountry,
  contextualDirectionForCountry,
} from "../country-resolution";

describe("resolveCountryFromCoordinates", () => {
  it("Mexico coordinate → MX", () => {
    expect(resolveCountryFromCoordinates(19.43, -99.13)).toBe("MX");
  });

  it("US coordinate → US", () => {
    expect(resolveCountryFromCoordinates(40.71, -74.0)).toBe("US");
  });

  it("border overlap → UNKNOWN (Mapbox is the authority there)", () => {
    expect(resolveCountryFromCoordinates(32.5149, -117.0382)).toBe("UNKNOWN"); // Tijuana
    expect(resolveCountryFromCoordinates(32.7157, -117.1611)).toBe("UNKNOWN"); // San Diego
    expect(resolveCountryFromCoordinates(31.31, -113.95)).toBe("UNKNOWN"); // Puerto Peñasco
    expect(resolveCountryFromCoordinates(27.5064, -99.5076)).toBe("UNKNOWN"); // Laredo, on the river
  });

  it("out-of-bounds (0,0) → UNKNOWN", () => {
    expect(resolveCountryFromCoordinates(0, 0)).toBe("UNKNOWN");
  });
});

describe("resolveUserCountry", () => {
  it("valid Mapbox MX wins → HIGH", () => {
    expect(resolveUserCountry(32.51, -117.03, "MX")).toEqual({
      country: "MX",
      confidence: "HIGH",
    });
  });

  it("valid Mapbox US wins → HIGH", () => {
    expect(resolveUserCountry(19.43, -99.13, "US")).toEqual({
      country: "US",
      confidence: "HIGH",
    });
  });

  it("Mapbox unavailable → coordinate fallback → MEDIUM", () => {
    expect(resolveUserCountry(19.43, -99.13, null)).toEqual({
      country: "MX",
      confidence: "MEDIUM",
    });
  });

  it("ambiguous + no geocode → UNKNOWN → LOW", () => {
    expect(resolveUserCountry(27.5064, -99.5076, null)).toEqual({
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
