import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useTripStaleness } from "../useTripStaleness";
import { useTripStore } from "../../stores/trip";
import { isTripStale, TRIP_STALENESS_THRESHOLD_MS } from "../../lib/trip-staleness";

const HOUR = 60 * 60 * 1000;

function seedTrip(lastEvaluatedAt: string | null, completed = false) {
  useTripStore.setState({
    destination: { name: "San Diego" } as any,
    completed,
    lastEvaluatedAt,
  });
}

describe("isTripStale", () => {
  it("returns false with no evaluation timestamp", () => {
    expect(isTripStale(null)).toBe(false);
  });

  it("returns false within the 12h threshold", () => {
    expect(isTripStale(new Date(Date.now() - 11 * HOUR).toISOString())).toBe(false);
  });

  it("returns true past the 12h threshold", () => {
    expect(isTripStale(new Date(Date.now() - 13 * HOUR).toISOString())).toBe(true);
  });

  it("exposes a 12h threshold constant", () => {
    expect(TRIP_STALENESS_THRESHOLD_MS).toBe(12 * HOUR);
  });
});

describe("useTripStaleness", () => {
  beforeEach(() => {
    useTripStore.getState().reset();
  });

  it("shows no prompt for a fresh trip", () => {
    seedTrip(new Date().toISOString());
    const { result, unmount } = renderHook(() => useTripStaleness());
    expect(result.current.isStale).toBe(false);
    expect(result.current.showStalePrompt).toBe(false);
    unmount();
  });

  it("shows stale prompt for a trip older than 12h", () => {
    seedTrip(new Date(Date.now() - 13 * HOUR).toISOString());
    const { result, unmount } = renderHook(() => useTripStaleness());
    expect(result.current.isStale).toBe(true);
    expect(result.current.showStalePrompt).toBe(true);
    unmount();
  });

  it("ignores staleness for completed trips", () => {
    seedTrip(new Date(Date.now() - 48 * HOUR).toISOString(), true);
    const { result, unmount } = renderHook(() => useTripStaleness());
    expect(result.current.isStale).toBe(false);
    expect(result.current.showStalePrompt).toBe(false);
    unmount();
  });

  it("ignores staleness with no destination", () => {
    useTripStore.setState({ destination: null, lastEvaluatedAt: new Date(Date.now() - 48 * HOUR).toISOString() });
    const { result, unmount } = renderHook(() => useTripStaleness());
    expect(result.current.showStalePrompt).toBe(false);
    unmount();
  });

  it("dismissStale hides the prompt (still-current path)", () => {
    seedTrip(new Date(Date.now() - 13 * HOUR).toISOString());
    const { result, unmount } = renderHook(() => useTripStaleness());
    expect(result.current.showStalePrompt).toBe(true);

    act(() => result.current.dismissStale());
    expect(result.current.isStale).toBe(false);
    expect(result.current.showStalePrompt).toBe(false);
    unmount();
  });

  it("refreshActivity bumps lastEvaluatedAt to now", () => {
    seedTrip(new Date(Date.now() - 13 * HOUR).toISOString());
    const before = Date.now();
    useTripStore.getState().refreshActivity();
    const updated = new Date(useTripStore.getState().lastEvaluatedAt!).getTime();
    expect(updated).toBeGreaterThanOrEqual(before);
    expect(isTripStale(useTripStore.getState().lastEvaluatedAt)).toBe(false);
  });
});
