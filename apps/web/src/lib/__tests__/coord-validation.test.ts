import { describe, it, expect } from "vitest";
import {
  parseLatitude,
  parseLongitude,
  parseLatLngPair,
  InvalidCoordinatesError,
  isInvalidCoordinatesError,
} from "../coord-validation";

describe("parseLatitude", () => {
  it("accepts in-range values", () => {
    expect(parseLatitude("32.5")).toBe(32.5);
    expect(parseLatitude("-90")).toBe(-90);
    expect(parseLatitude("90")).toBe(90);
  });

  it("returns undefined when absent", () => {
    expect(parseLatitude(null)).toBeUndefined();
    expect(parseLatitude(undefined)).toBeUndefined();
    expect(parseLatitude("")).toBeUndefined();
  });

  it.each([["NaN"], ["abc"], ["91"], ["-91"], ["999"], ["Infinity"]])(
    "throws on %p",
    (raw) => {
      expect(() => parseLatitude(raw)).toThrow(InvalidCoordinatesError);
    }
  );
});

describe("parseLongitude", () => {
  it("accepts in-range values", () => {
    expect(parseLongitude("-117.16")).toBe(-117.16);
    expect(parseLongitude("180")).toBe(180);
  });

  it.each([["NaN"], ["xyz"], ["181"], ["-181"]])("throws on %p", (raw) => {
    expect(() => parseLongitude(raw)).toThrow(InvalidCoordinatesError);
  });
});

describe("parseLatLngPair", () => {
  it("returns undefined when both absent", () => {
    expect(parseLatLngPair(null, null)).toBeUndefined();
  });

  it("returns the pair when both valid", () => {
    expect(parseLatLngPair("32.5", "-117.16")).toEqual({ lat: 32.5, lng: -117.16 });
  });

  it("throws when only one side is present", () => {
    expect(() => parseLatLngPair("32.5", null)).toThrow(InvalidCoordinatesError);
    expect(() => parseLatLngPair(null, "-117.16")).toThrow(InvalidCoordinatesError);
  });

  it("throws when either side is invalid", () => {
    expect(() => parseLatLngPair("999", "-117.16")).toThrow(InvalidCoordinatesError);
  });
});

describe("isInvalidCoordinatesError", () => {
  it("narrows the error type", () => {
    expect(isInvalidCoordinatesError(new InvalidCoordinatesError("x"))).toBe(true);
    expect(isInvalidCoordinatesError(new Error("x"))).toBe(false);
    expect(isInvalidCoordinatesError("x")).toBe(false);
  });
});
