import { describe, it, expect } from "vitest";
import { LocationStateMachine, createLocationData, type LocationState, type LocationData } from "../location-state-machine";

describe("location-state-machine", () => {
  it("starts in uninitialized state", () => {
    const machine = new LocationStateMachine();
    expect(machine.getState()).toBe("uninitialized");
  });

  it("transitions through states correctly", () => {
    const machine = new LocationStateMachine();
    machine.dispatch({ type: "INITIALIZE" });
    expect(machine.getState()).toBe("requesting_permission");
    
    machine.dispatch({ type: "PERMISSION_GRANTED" });
    expect(machine.getState()).toBe("acquiring");
    
    const locationData = createLocationData(32.0, -110.0, 10);
    machine.dispatch({ type: "ACQUIRE_SUCCESS", data: locationData });
    expect(machine.getState()).toBe("ready");
  });

  it("handles permission denied", () => {
    const machine = new LocationStateMachine();
    machine.dispatch({ type: "INITIALIZE" });
    machine.dispatch({ type: "PERMISSION_DENIED" });
    expect(machine.getState()).toBe("permission_denied");
    
    machine.dispatch({ type: "RETRY" });
    expect(machine.getState()).toBe("requesting_permission");
  });

  it("evaluates confidence correctly", () => {
    const machine = new LocationStateMachine({ lowConfidenceThreshold: 100 });
    
    // High accuracy -> ready
    const goodData = createLocationData(32.0, -110.0, 10);
    expect(machine.evaluateConfidence(goodData)).toBe("ready");
    
    // Low accuracy -> needs_confirmation
    const badData = createLocationData(32.0, -110.0, 200);
    expect(machine.evaluateConfidence(badData)).toBe("needs_confirmation");
    
    // Stale data -> needs_refreshing
    const staleData = createLocationData(32.0, -110.0, 10);
    staleData.timestamp = Date.now() - 400000; // > 5 min
    expect(machine.evaluateConfidence(staleData)).toBe("needs_refreshing");
  });

  it("tracks retries and goes unavailable after max retries", () => {
    const machine = new LocationStateMachine({ maxRetries: 2 });
    machine.dispatch({ type: "INITIALIZE" });
    machine.dispatch({ type: "PERMISSION_GRANTED" });
    
    // First failure
    machine.dispatch({ type: "ACQUIRE_FAILURE", error: "timeout" });
    expect(machine.getState()).toBe("acquiring");
    machine.dispatch({ type: "RETRY" });
    
    // Second failure
    machine.dispatch({ type: "ACQUIRE_FAILURE", error: "timeout" });
    expect(machine.getState()).toBe("acquiring");
    machine.dispatch({ type: "RETRY" });
    
    // Third failure - exceeds maxRetries (2)
    machine.dispatch({ type: "ACQUIRE_FAILURE", error: "timeout" });
    expect(machine.getState()).toBe("unavailable");
  });
});
