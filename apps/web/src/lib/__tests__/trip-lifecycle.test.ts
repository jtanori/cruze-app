import { describe, it, expect } from "vitest";
import { TripLifecycleMachine, isEligibleForMyTrips } from "../trip-lifecycle";

describe("trip-lifecycle", () => {
  it("starts in draft state", () => {
    const machine = new TripLifecycleMachine();
    expect(machine.getState()).toBe("draft");
  });

  it("transitions through lifecycle correctly", () => {
    const machine = new TripLifecycleMachine();
    
    machine.dispatch("START_PLANNING");
    expect(machine.getState()).toBe("planning");
    
    machine.dispatch("COMPLETE_SETUP");
    expect(machine.getState()).toBe("ready");
    
    machine.dispatch("ACTIVATE");
    expect(machine.getState()).toBe("active");
    
    machine.dispatch("COMPLETE");
    expect(machine.getState()).toBe("completed");
  });

  it("can reset from any state", () => {
    const machine = new TripLifecycleMachine();
    machine.dispatch("START_PLANNING");
    machine.dispatch("COMPLETE_SETUP");
    machine.dispatch("ACTIVATE");
    machine.dispatch("RESET");
    expect(machine.getState()).toBe("draft");
  });

  it("isCompleted returns true only for completed state", () => {
    const machine = new TripLifecycleMachine();
    expect(machine.isCompleted()).toBe(false);
    
    machine.dispatch("START_PLANNING");
    machine.dispatch("COMPLETE_SETUP");
    machine.dispatch("ACTIVATE");
    machine.dispatch("COMPLETE");
    expect(machine.isCompleted()).toBe(true);
  });

  it("isEligibleForMyTrips only for completed", () => {
    expect(isEligibleForMyTrips("draft")).toBe(false);
    expect(isEligibleForMyTrips("planning")).toBe(false);
    expect(isEligibleForMyTrips("ready")).toBe(false);
    expect(isEligibleForMyTrips("active")).toBe(false);
    expect(isEligibleForMyTrips("completed")).toBe(true);
  });
});
