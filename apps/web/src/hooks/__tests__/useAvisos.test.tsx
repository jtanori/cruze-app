import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useAvisos } from "../useAvisos";
import { useAvisosStore } from "../../stores/avisos";
import { useLiveCrossingStore } from "../../stores/live-crossing";
import type { MergedCrossingData } from "../../lib/border-data-service";

function makePayload(wait: number, status = "OPEN"): MergedCrossingData {
  return {
    id: "san-ysidro",
    name: "San Ysidro",
    mexicanCity: "Tijuana",
    usCity: "San Diego",
    mexicanState: "Baja California",
    usState: "California",
    mexicanAddress: "Av. de las Américas s/n, Tijuana, B.C.",
    usAddress: "7450 Camino de la Plaza, San Ysidro, CA 92173",
    country: "US",
    corridor: "tijuana-san-diego",
    coordinates: { lat: 32.5431, lng: -117.0379 },
    waitTimeNorthbound: wait,
    waitTimeSouthbound: 20,
    statusNorthbound: status,
    statusSouthbound: "OPEN",
    lanesNorthbound: [],
    lanesSouthbound: [],
    isLive: true,
    lastUpdated: new Date().toISOString(),
    hours: "24/7",
  } as MergedCrossingData;
}

function stubFetch(payload: MergedCrossingData | null, ok = true) {
  vi.stubGlobal(
    "fetch",
    vi.fn(async () => ({
      ok,
      status: ok ? 200 : 500,
      json: async () => ({ crossings: payload ? [payload] : [] }),
    }))
  );
}

describe("useAvisos", () => {
  beforeEach(() => {
    useAvisosStore.getState().reset();
    useLiveCrossingStore.getState().clear();
    stubFetch(makePayload(30));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("creates no avisos on initial baseline fetch", async () => {
    const { result, unmount } = renderHook(() =>
      useAvisos("san-ysidro", "MX_TO_US", 60)
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    // Initial acquisition is baseline, not a change (LIVE-01 invariant)
    expect(result.current.activeAvisos).toHaveLength(0);
    expect(result.current.unreadCount).toBe(0);
    expect(result.current.error).toBeNull();
    unmount();
  });

  it("converts a wait surge into an aviso on refresh", async () => {
    const { result, unmount } = renderHook(() =>
      useAvisos("san-ysidro", "MX_TO_US", 60)
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    stubFetch(makePayload(70));
    await act(async () => {
      await result.current.refresh();
    });

    // Assert at store level: the hook bridges changes into the store.
    // (Hook returns are getState() snapshots; UI subscribes to the store directly.)
    await waitFor(() =>
      expect(useAvisosStore.getState().activeAvisos()).toHaveLength(1)
    );
    expect(useAvisosStore.getState().unreadCount()).toBe(1);
    expect(useAvisosStore.getState().activeAvisos()[0].crossingId).toBe(
      "san-ysidro"
    );
    expect(useAvisosStore.getState().activeAvisos()[0].read).toBe(false);
    unmount();
  });

  it("dedups identical changes on repeated refresh", async () => {
    const { result, unmount } = renderHook(() =>
      useAvisos("san-ysidro", "MX_TO_US", 60)
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    stubFetch(makePayload(70));
    await act(async () => {
      await result.current.refresh();
    });
    await waitFor(() =>
      expect(useAvisosStore.getState().activeAvisos()).toHaveLength(1)
    );

    // Same payload again — signature dedup must prevent a second aviso
    await act(async () => {
      await result.current.refresh();
    });
    await new Promise((r) => setTimeout(r, 50));
    expect(useAvisosStore.getState().activeAvisos()).toHaveLength(1);
    unmount();
  });

  it("resets avisos when crossingId is null", () => {
    useAvisosStore.getState().addAviso({
      id: "seed",
      type: "crossing_changed",
      severity: "warning",
      title: "Seed",
      description: "Seed aviso",
      crossingId: "san-ysidro",
      timestamp: new Date().toISOString(),
      read: false,
      dismissed: false,
    });

    const { unmount } = renderHook(() => useAvisos(null));
    expect(useAvisosStore.getState().activeAvisos()).toHaveLength(0);
    expect(useAvisosStore.getState().unreadCount()).toBe(0);
    unmount();
  });

  it("surfaces fetch errors without crashing", async () => {
    stubFetch(null, false);
    const { result, unmount } = renderHook(() =>
      useAvisos("san-ysidro", "MX_TO_US", 60)
    );

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.error).not.toBeNull();
    expect(useAvisosStore.getState().activeAvisos()).toHaveLength(0);
    unmount();
  });

  it("exposes markRead/dismiss actions", async () => {
    const { result, unmount } = renderHook(() =>
      useAvisos("san-ysidro", "MX_TO_US", 60)
    );
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    stubFetch(makePayload(70));
    await act(async () => {
      await result.current.refresh();
    });
    await waitFor(() =>
      expect(useAvisosStore.getState().unreadCount()).toBe(1)
    );

    const id = useAvisosStore.getState().activeAvisos()[0].id;
    act(() => result.current.markRead(id));
    expect(useAvisosStore.getState().unreadCount()).toBe(0);

    act(() => result.current.dismiss(id));
    expect(useAvisosStore.getState().activeAvisos()).toHaveLength(0);
    unmount();
  });
});
