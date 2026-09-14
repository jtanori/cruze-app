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
    crossingCandidate: null,
    destination: null,
    origin: null,
    travelMode: null,
    direction: null,
    accessType: null,
    documentType: null,
  };

  const dest = { id: "san-diego", name: "San Diego", lat: 33.0, lng: -117.5, country: "US" as const };
  const orig = { id: "mexicali", name: "Mexicali", lat: 31.0, lng: -115.5, country: "MX" as const };

  it("returns base steps for empty state", () => {
    const steps = getRequiredSteps(baseState);
    expect(steps).toEqual(["destination", "origin", "travelMode"]);
  });

  it("returns walking flow steps", () => {
    const state = { ...baseState, travelMode: "walking" as const };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "recommendation"]);
  });

  it("returns commercial flow steps", () => {
    const state = { ...baseState, travelMode: "commercial" as const };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "recommendation"]);
  });

  it("returns private vehicle southbound steps", () => {
    const state = { ...baseState, travelMode: "privateVehicle" as const, direction: "southbound" as const };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "recommendation"]);
  });

  it("returns private vehicle northbound steps with access + docs", () => {
    const state = { ...baseState, travelMode: "privateVehicle" as const, direction: "northbound" as const };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "accessType", "documentProfile", "recommendation"]);
  });

  it("returns private vehicle steps (without pre-set direction)", () => {
    const state = { ...baseState, travelMode: "privateVehicle" as const };
    const steps = getRequiredSteps(state);
    expect(steps).toEqual(["destination", "origin", "travelMode", "direction", "recommendation"]);
  });

  it("getNextStep returns correct next step", () => {
    const state = { ...baseState, destination: dest, origin: orig, travelMode: "privateVehicle" as const };
    expect(getNextStep(state, "destination")).toBe("origin");
    expect(getNextStep(state, "origin")).toBe("travelMode");
    expect(getNextStep(state, "travelMode")).toBe("direction");
  });

  it("getPreviousStep returns correct previous step", () => {
    const state = { ...baseState, destination: dest, origin: orig };
    expect(getPreviousStep(state, "origin")).toBe("destination");
    expect(getPreviousStep(state, "travelMode")).toBe("origin");
  });

  it("getStepProgress calculates correctly", () => {
    const state = { ...baseState, destination: dest, origin: orig };
    const progress = getStepProgress(state, "origin");
    expect(progress.current).toBe(2);
    expect(progress.total).toBe(3);
  });

  it("crossingCandidate is part of state shape", () => {
    const state: TripSetupState = {
      ...baseState,
      crossingCandidate: { id: "lukeville", name: "Lukeville" },
    };
    expect(state.crossingCandidate).toEqual({ id: "lukeville", name: "Lukeville" });
  });

  it("destination uses TripDestinationSelection shape", () => {
    const state: TripSetupState = { ...baseState, destination: dest };
    expect(state.destination?.country).toBe("US");
    expect(state.destination?.lat).toBe(33.0);
  });
});
