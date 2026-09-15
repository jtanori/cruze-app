import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { renderHook } from "@testing-library/react";
import { useTripLocationRefresh } from "../useTripLocationRefresh";
import { useTripStore } from "../../stores/trip";

const retryMock = vi.fn();

vi.mock("@/components/location/LocationProvider", () => ({
  useLocationContext: () => ({ retry: retryMock }),
}));

function setVisibility(state: "visible" | "hidden") {
  Object.defineProperty(document, "visibilityState", {
    configurable: true,
    get: () => state,
  });
}

describe("useTripLocationRefresh", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    retryMock.mockClear();
    useTripStore.getState().reset();
    setVisibility("visible");
  });

  afterEach(() => {
    vi.useRealTimers();
    setVisibility("visible");
  });

  it("does nothing without an active trip", () => {
    const { unmount } = renderHook(() => useTripLocationRefresh());
    vi.advanceTimersByTime(10 * 60 * 1000);
    expect(retryMock).not.toHaveBeenCalled();
    unmount();
  });

  it("refreshes every 5 minutes while the trip is active and visible", () => {
    useTripStore.getState().setSelectedCrossing({
      crossingId: "san-ysidro",
      crossingName: "San Ysidro",
      mexicanCity: "Tijuana",
      usCity: "San Diego",
      waitTime: 30,
      totalJourneyTime: 60,
      status: "open",
      isLive: true,
      generatedAt: new Date().toISOString(),
      coordinates: { lat: 32.54, lng: -117.03 },
    });
    const { unmount } = renderHook(() => useTripLocationRefresh());
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(retryMock).toHaveBeenCalledTimes(1);
    vi.advanceTimersByTime(5 * 60 * 1000);
    expect(retryMock).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("pauses while the tab is hidden", () => {
    useTripStore.getState().setSelectedCrossing({
      crossingId: "san-ysidro",
      crossingName: "San Ysidro",
      mexicanCity: "Tijuana",
      usCity: "San Diego",
      waitTime: 30,
      totalJourneyTime: 60,
      status: "open",
      isLive: true,
      generatedAt: new Date().toISOString(),
      coordinates: { lat: 32.54, lng: -117.03 },
    });
    setVisibility("hidden");
    const { unmount } = renderHook(() => useTripLocationRefresh());
    vi.advanceTimersByTime(15 * 60 * 1000);
    expect(retryMock).not.toHaveBeenCalled();
    unmount();
  });
});
