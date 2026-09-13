import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useAvisoActions } from "../useAvisoActions";
import { useAgentStore } from "../../stores/agent";
import type { Aviso } from "../../lib/avisos";

const pushMock = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push: pushMock }),
  usePathname: () => "/es/alerts",
}));

function makeAviso(overrides: Partial<Aviso> = {}): Aviso {
  return {
    id: "a1",
    type: "wait_surge",
    severity: "warning",
    title: "Surge",
    description: "Wait rose",
    crossingId: "san-ysidro",
    crossingName: "San Ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
    ...overrides,
  };
}

describe("useAvisoActions", () => {
  beforeEach(() => {
    pushMock.mockClear();
    useAgentStore.getState().clearPendingContext();
  });

  it("askAgent sets one-shot context and routes to agent", () => {
    const { result, unmount } = renderHook(() => useAvisoActions());
    act(() => result.current.askAgent(makeAviso()));
    expect(useAgentStore.getState().pendingContext).toEqual({
      crossingId: "san-ysidro",
      crossingName: "San Ysidro",
    });
    expect(pushMock).toHaveBeenCalledWith("/es/agent");
    unmount();
  });

  it("askAgent routes without context when aviso has no crossing", () => {
    const { result, unmount } = renderHook(() => useAvisoActions());
    act(() =>
      result.current.askAgent(makeAviso({ crossingId: undefined, crossingName: undefined }))
    );
    expect(useAgentStore.getState().pendingContext).toBeNull();
    expect(pushMock).toHaveBeenCalledWith("/es/agent");
    unmount();
  });

  it("viewRecommendation routes to crossing detail when known", () => {
    const { result, unmount } = renderHook(() => useAvisoActions());
    act(() => result.current.viewRecommendation(makeAviso()));
    expect(pushMock).toHaveBeenCalledWith("/es/crossing/san-ysidro");
    unmount();
  });

  it("viewRecommendation falls back to trip without crossing", () => {
    const { result, unmount } = renderHook(() => useAvisoActions());
    act(() =>
      result.current.viewRecommendation(makeAviso({ crossingId: undefined }))
    );
    expect(pushMock).toHaveBeenCalledWith("/es/trip");
    unmount();
  });
});
