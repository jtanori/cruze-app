import { describe, it, expect, beforeEach } from "vitest";
import { useTripStore } from "../trip";

/**
 * useTripMapContext derives map context from the trip store.
 * Rather than testing the hook with renderHook, we verify the
 * store conditions that produce valid/invalid map context.
 *
 * Valid context = both origin AND destination with numeric coordinates
 * and trip not completed.
 */
describe("trip map context — valid origin + destination required", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
  });

  it("no trip → no context", () => {
    const { start, destination, completed } = useTripStore.getState();
    expect(start).toBeNull();
    expect(destination).toBeNull();
    expect(completed).toBe(false);
  });

  it("origin only → no context", () => {
    useTripStore.getState().setStart({
      id: "mexicali",
      name: "Mexicali",
      latitude: 31.0,
      longitude: -115.5,
      country: "MX",
      countryCode: "MX",
      type: "search",
    });
    const { start, destination } = useTripStore.getState();
    expect(start).not.toBeNull();
    expect(destination).toBeNull();
  });

  it("both set → valid context", () => {
    useTripStore.getState().setStart({
      id: "mexicali",
      name: "Mexicali",
      latitude: 31.0,
      longitude: -115.5,
      country: "MX",
      countryCode: "MX",
      type: "search",
    });
    useTripStore.getState().setDestination({
      id: "san-diego",
      name: "San Diego",
      latitude: 33.0,
      longitude: -117.5,
      country: "US",
      countryCode: "US",
      type: "search",
    });
    const { start, destination, completed } = useTripStore.getState();
    expect(start).not.toBeNull();
    expect(destination).not.toBeNull();
    expect(completed).toBe(false);
  });

  it("completed trip → no context", () => {
    useTripStore.getState().setStart({
      id: "mexicali",
      name: "Mexicali",
      latitude: 31.0,
      longitude: -115.5,
      country: "MX",
      countryCode: "MX",
      type: "search",
    });
    useTripStore.getState().setDestination({
      id: "san-diego",
      name: "San Diego",
      latitude: 33.0,
      longitude: -117.5,
      country: "US",
      countryCode: "US",
      type: "search",
    });
    useTripStore.getState().complete();
    const { completed } = useTripStore.getState();
    expect(completed).toBe(true);
  });
});
