import { describe, it, expect } from "vitest";
import { compareCrossings, type CompareInput } from "../crossings-compare";

const base: CompareInput = {
  id: "x",
  crossingName: "X",
  waitNorthbound: 10,
  waitSouthbound: 5,
  status: "OPEN",
  laneCategories: ["passenger"],
  coordinates: { lat: 32.5, lng: -117.0 },
};

describe("compareCrossings", () => {
  it("winner = shortest viaje with origin", () => {
    const { rows } = compareCrossings(
      [
        { ...base, id: "far", coordinates: { lat: 33.5, lng: -117.0 } },
        { ...base, id: "near", coordinates: { lat: 32.55, lng: -117.0 } },
      ],
      { origin: { lat: 32.4, lng: -117.0 }, direction: "MX_TO_US" }
    );
    expect(rows.find((r) => r.id === "near")?.isWinner).toBe(true);
    expect(rows.find((r) => r.id === "near")?.distanceKm).not.toBeNull();
  });

  it("no origin → viaje/distancia null, winner by wait", () => {
    const { rows } = compareCrossings(
      [
        { ...base, id: "slow", waitNorthbound: 40, waitSouthbound: 30 },
        { ...base, id: "fast", waitNorthbound: 5, waitSouthbound: 12 },
      ],
      { direction: "MX_TO_US" }
    );
    expect(rows.find((r) => r.id === "fast")?.isWinner).toBe(true);
    expect(rows.every((r) => r.viajeMinutes === null)).toBe(true);
  });

  it("incompatible mode excludes but unknown lanes pass", () => {
    const { rows } = compareCrossings(
      [
        { ...base, id: "comm", laneCategories: ["commercial"] },
        { ...base, id: "nolanes", laneCategories: [] },
      ],
      { mode: "WALK" }
    );
    expect(rows.find((r) => r.id === "comm")?.excluded).toBe(true);
    expect(rows.find((r) => r.id === "nolanes")?.excluded).toBe(false);
    expect(rows.find((r) => r.id === "nolanes")?.isWinner).toBe(true);
  });

  it("bothDirections true when direction is null", () => {
    const { bothDirections } = compareCrossings([base]);
    expect(bothDirections).toBe(true);
  });

  it("bothDirections false when direction is set", () => {
    const { bothDirections } = compareCrossings([base], {
      direction: "MX_TO_US",
    });
    expect(bothDirections).toBe(false);
  });

  it("fastest can differ from winner", () => {
    const { rows } = compareCrossings(
      [
        {
          ...base,
          id: "close-fast-wait",
          waitNorthbound: 5,
          coordinates: { lat: 32.55, lng: -117.0 },
        },
        {
          ...base,
          id: "far-short-wait",
          waitNorthbound: 2,
          coordinates: { lat: 33.5, lng: -117.0 },
        },
      ],
      { origin: { lat: 32.4, lng: -117.0 }, direction: "MX_TO_US" }
    );
    const close = rows.find((r) => r.id === "close-fast-wait")!;
    const far = rows.find((r) => r.id === "far-short-wait")!;
    // close wins on viaje (shorter approach), far is fastest (lower wait)
    expect(close.isWinner).toBe(true);
    expect(far.isFastest).toBe(true);
    expect(far.isWinner).toBe(false);
  });

  it("excluded cannot be winner or fastest", () => {
    const { rows } = compareCrossings(
      [
        { ...base, id: "only-comm", laneCategories: ["commercial"] },
        { ...base, id: "passenger-ok", laneCategories: ["passenger"] },
      ],
      { mode: "VEHICLE" }
    );
    const excluded = rows.find((r) => r.id === "only-comm")!;
    expect(excluded.isWinner).toBe(false);
    expect(excluded.isFastest).toBe(false);
    expect(excluded.winnerLabel).toBeNull();
  });

  it("winner label is Mas rapido when fastest differs from winner", () => {
    const { rows } = compareCrossings(
      [
        {
          ...base,
          id: "a",
          waitNorthbound: 5,
          coordinates: { lat: 32.55, lng: -117.0 },
        },
        {
          ...base,
          id: "b",
          waitNorthbound: 2,
          coordinates: { lat: 33.5, lng: -117.0 },
        },
      ],
      { origin: { lat: 32.4, lng: -117.0 }, direction: "MX_TO_US" }
    );
    const a = rows.find((r) => r.id === "a")!;
    const b = rows.find((r) => r.id === "b")!;
    expect(a.winnerLabel).toBe("Mejor opción");
    expect(b.winnerLabel).toBe("Más rápido");
  });

  it("all eligible non-winners get Alternativa", () => {
    const { rows } = compareCrossings(
      [
        { ...base, id: "a", waitNorthbound: 10 },
        { ...base, id: "b", waitNorthbound: 20 },
        { ...base, id: "c", waitNorthbound: 30 },
      ],
      { direction: "MX_TO_US" }
    );
    const labels = rows.map((r) => r.winnerLabel);
    expect(labels).toEqual(["Mejor opción", "Alternativa", "Alternativa"]);
  });

  it("direction null shows both waits in input, domain does not default to MX_TO_US", () => {
    const { rows, bothDirections } = compareCrossings(
      [{ ...base, id: "a", waitNorthbound: 10, waitSouthbound: 5 }],
      { direction: null }
    );
    expect(bothDirections).toBe(true);
    // Both waits are present in the input; domain doesn't override
    expect(rows[0].waitNorthbound).toBe(10);
    expect(rows[0].waitSouthbound).toBe(5);
  });
});
