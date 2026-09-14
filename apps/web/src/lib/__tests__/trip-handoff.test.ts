import { describe, it, expect } from "vitest";
import {
  parseSetupParams,
  resolveCrossingCandidate,
  checkHandoffCompatibility,
} from "../trip-handoff";

const dest = { id: "d1", name: "San Diego", lat: 32.7, lng: -117.16, country: "US" as const };

describe("parseSetupParams", () => {
  it("parses valid dest + crossing", () => {
    const enc = encodeURIComponent(JSON.stringify(dest));
    expect(parseSetupParams(`?dest=${enc}&crossing=san-ysidro`)).toEqual({
      destination: dest,
      crossingId: "san-ysidro",
    });
  });

  it("rejects malformed dest, keeps crossing", () => {
    expect(parseSetupParams("?dest=%%%&crossing=san-ysidro")).toEqual({
      destination: null,
      crossingId: "san-ysidro",
    });
  });

  it("empty search → nulls", () => {
    expect(parseSetupParams("")).toEqual({ destination: null, crossingId: null });
  });
});

describe("checkHandoffCompatibility", () => {
  it("no active trip → compatible with candidate", () => {
    const v = checkHandoffCompatibility(
      { destination: dest, crossingId: "san-ysidro" },
      null
    );
    expect(v).toEqual({
      compatible: true,
      candidate: { id: "san-ysidro", name: "San Ysidro" },
    });
  });

  it("unknown crossing → reject", () => {
    expect(
      checkHandoffCompatibility({ destination: null, crossingId: "nope" }, null)
    ).toEqual({ compatible: false, reason: "unknown-crossing" });
  });

  it("dest differing from active trip → reject, never overwrite", () => {
    expect(
      checkHandoffCompatibility(
        { destination: dest, crossingId: null },
        { destinationId: "other" }
      )
    ).toEqual({ compatible: false, reason: "active-trip-conflict" });
  });

  it("same dest as active trip → compatible", () => {
    const v = checkHandoffCompatibility(
      { destination: dest, crossingId: null },
      { destinationId: "d1" }
    );
    expect(v.compatible).toBe(true);
  });
});

describe("resolveCrossingCandidate", () => {
  it("null → null, unknown id → null", () => {
    expect(resolveCrossingCandidate(null)).toBeNull();
    expect(resolveCrossingCandidate("nope")).toBeNull();
  });
});
