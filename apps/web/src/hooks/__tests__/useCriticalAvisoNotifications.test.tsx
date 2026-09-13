import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useCriticalAvisoNotifications } from "../useCriticalAvisoNotifications";
import type { Aviso } from "../../lib/avisos";

function makeAviso(id: string, severity: Aviso["severity"] = "critical"): Aviso {
  return {
    id,
    type: "crossing_changed",
    severity,
    title: `Title ${id}`,
    description: `Description ${id}`,
    crossingId: "san-ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
  };
}

describe("useCriticalAvisoNotifications", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("fires once per critical aviso and never twice", () => {
    const Ctor = vi.fn();
    vi.stubGlobal(
      "Notification",
      Object.assign(Ctor, { permission: "granted" })
    );

    const { result, rerender, unmount } = renderHook(
      ({ avisos }) => useCriticalAvisoNotifications(avisos),
      { initialProps: { avisos: [makeAviso("a1")] } }
    );
    expect(result.current.permission).toBe("granted");
    expect(Ctor).toHaveBeenCalledTimes(1);

    // Same list again — seen set dedups
    rerender({ avisos: [makeAviso("a1")] });
    expect(Ctor).toHaveBeenCalledTimes(1);

    // New critical aviso fires; warning never does
    rerender({ avisos: [makeAviso("a1"), makeAviso("a2"), makeAviso("a3", "warning")] });
    expect(Ctor).toHaveBeenCalledTimes(2);
    unmount();
  });

  it("stays silent without permission and requests on demand", async () => {
    const Ctor = vi.fn();
    const requestPermission = vi.fn(async () => "granted" as const);
    vi.stubGlobal(
      "Notification",
      Object.assign(Ctor, { permission: "default", requestPermission })
    );

    const { result, unmount } = renderHook(() =>
      useCriticalAvisoNotifications([makeAviso("a1")])
    );
    expect(result.current.permission).toBe("default");
    expect(Ctor).not.toHaveBeenCalled();

    let next: string | undefined;
    await act(async () => {
      next = await result.current.requestPermission();
    });
    expect(next).toBe("granted");
    expect(result.current.permission).toBe("granted");
    unmount();
  });

  it("reports unsupported with no Notification API", () => {
    vi.stubGlobal("Notification", undefined);
    const { result, unmount } = renderHook(() =>
      useCriticalAvisoNotifications([makeAviso("a1")])
    );
    expect(result.current.permission).toBe("unsupported");
    unmount();
  });
});
