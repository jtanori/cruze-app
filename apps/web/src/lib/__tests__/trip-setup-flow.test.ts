import { describe, it, expect } from "vitest";
import {
  getRequiredSteps,
  getNextStep,
  getPreviousStep,
  getStepProgress,
  type TripSetupState,
} from "../trip-setup-flow";

describe("trip-setup-flow", () => {
  const baseState: TripSetupState = {
    destination: null,
    origin: null,
    travelMode: null,
    direction: null,
    accessType: null,
    documentType: null,
  };

  it("returns base steps for empty state", () => {
    const steps = getRequiredSteps(baseState);
    expect(steps).toEqual(["destination", "origin", "travelMode"]);
  });

  it("returns walking flow steps", () => {
    const state = { ...baseState, travelMode: "walking" as any };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "recommendation"]);
  });

  it("returns commercial flow steps", () => {
    const state = { ...baseState, travelMode: "commercial" as any };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "recommendation"]);
  });

  it("returns private vehicle southbound steps", () => {
    const state = { ...baseState, travelMode: "privateVehicle" as any, direction: "southbound" as any };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "recommendation"]);
  });

  it("returns private vehicle northbound steps with access + docs", () => {
    // When direction is already set, it's not included in required steps
    const state = { ...baseState, travelMode: "privateVehicle" as any, direction: "northbound" as any };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "accessType", "documentProfile", "recommendation"]);
  });

it("returns private vehicle northbound steps (without pre-set direction)", () => {
    // When direction is NOT set, it should only ask for direction first
    const state = { ...baseState, travelMode: "privateVehicle" as any };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "direction", "recommendation"]);
  });

  it("returns private vehicle northbound steps with access + docs (when direction is northbound)", () => {
    // When direction is northbound, it adds accessType and documentProfile
    const state = { ...baseState, travelMode: "privateVehicle" as any, direction: "northbound" as any };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "accessType", "documentProfile", "recommendation"]);
  });

  it("getNextStep returns correct next step", () => {
    const state = { ...baseState, destination: { lat: 0, lng: 0, label: "test" }, origin: { lat: 0, lng: 0, label: "test" }, travelMode: "privateVehicle" as any };
    expect(getNextStep(state, "destination")).toBe("origin");
    expect(getNextStep(state, "origin")).toBe("travelMode");
    expect(getNextStep(state, "travelMode")).toBe("direction"); // privateVehicle needs direction
  });

  it("getPreviousStep returns correct previous step", () => {
    const state = { ...baseState, destination: { lat: 0, lng: 0, label: "test" }, origin: { lat: 0, lng: 0, label: "test" } };
    expect(getPreviousStep(state, "origin")).toBe("destination");
    expect(getPreviousStep(state, "travelMode")).toBe("origin");
  });

  it("getStepProgress calculates correctly", () => {
    const state = { ...baseState, destination: { lat: 0, lng: 0, label: "test" }, origin: { lat: 0, lng: 0, label: "test" } };
    const progress = getStepProgress(state, "origin");
    expect(progress.current).toBe(2);
    expect(progress.total).toBe(3);
  });
});
