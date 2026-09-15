import { describe, it, expect } from "vitest";
import { formatDuration, formatDistance } from "../display";

describe("formatDuration", () => {
  it("formats sub-hour waits as minutes", () => {
    expect(formatDuration(45)).toBe("45 min");
    expect(formatDuration(0)).toBe("0 min");
  });

  it("formats long waits as hours + minutes", () => {
    expect(formatDuration(270)).toBe("4h 30m");
    expect(formatDuration(120)).toBe("2h");
  });
});

describe("formatDistance", () => {
  it("formats sub-km distances in meters", () => {
    expect(formatDistance(0.5)).toBe("500 m");
    expect(formatDistance(0)).toBe("1 m");
  });

  it("formats single-digit km with one decimal", () => {
    expect(formatDistance(3.24)).toBe("3.2 km");
  });

  it("rounds double-digit km", () => {
    expect(formatDistance(12.6)).toBe("13 km");
  });

  it("renders em-dash for invalid input", () => {
    expect(formatDistance(NaN)).toBe("—");
    expect(formatDistance(-1)).toBe("—");
  });
});
