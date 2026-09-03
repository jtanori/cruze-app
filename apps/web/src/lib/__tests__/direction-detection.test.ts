import { describe, it, expect } from "vitest";
import { detectDirection, needsDirectionConfirmation } from "../direction-detection";

describe("direction-detection", () => {
  it("detects northbound: MX -> US", () => {
    const origin = { lat: 32.0, lng: -110.0 }; // South of border
    const destination = { lat: 33.0, lng: -110.0 }; // North of border
    expect(detectDirection(origin, destination)).toBe("northbound");
  });

  it("detects southbound: US -> MX", () => {
    const origin = { lat: 33.0, lng: -110.0 }; // North of border
    const destination = { lat: 32.0, lng: -110.0 }; // South of border
    expect(detectDirection(origin, destination)).toBe("southbound");
  });

  it("returns unknown for ambiguous locations", () => {
    const origin = { lat: 32.0, lng: -110.0 };
    const destination = { lat: 32.1, lng: -110.1 }; // Both south, similar lat
    expect(detectDirection(origin, destination)).toBe("unknown");
  });

  it("needsDirectionConfirmation returns true for unknown", () => {
    const origin = { lat: 32.0, lng: -110.0 };
    const destination = { lat: 32.1, lng: -110.1 };
    expect(needsDirectionConfirmation(origin, destination)).toBe(true);
  });

  it("needsDirectionConfirmation returns false for clear direction", () => {
    const origin = { lat: 32.0, lng: -110.0 };
    const destination = { lat: 33.0, lng: -110.0 };
    expect(needsDirectionConfirmation(origin, destination)).toBe(false);
  });
});
