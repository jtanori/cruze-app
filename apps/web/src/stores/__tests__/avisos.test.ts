import { describe, it, expect, beforeEach } from "vitest";
import { useAvisosStore } from "../avisos";
import type { Aviso } from "../../lib/avisos";

function makeAviso(overrides: Partial<Aviso> = {}): Aviso {
  return {
    id: `aviso-${Date.now()}-${Math.random()}`,
    type: "crossing_changed",
    severity: "warning",
    title: "Test",
    description: "Test aviso",
    crossingId: "san-ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
    ...overrides,
  };
}

describe("avisos store", () => {
  beforeEach(() => {
    useAvisosStore.getState().reset();
  });

  it("starts empty", () => {
    expect(useAvisosStore.getState().avisos).toEqual([]);
    expect(useAvisosStore.getState().unreadCount()).toBe(0);
  });

  it("addAviso adds an aviso", () => {
    const aviso = makeAviso();
    const added = useAvisosStore.getState().addAviso(aviso);
    expect(added).toBe(true);
    expect(useAvisosStore.getState().avisos).toHaveLength(1);
  });

  it("addAviso deduplicates", () => {
    const aviso = makeAviso({ id: "same-id" });
    useAvisosStore.getState().addAviso(aviso);
    const added = useAvisosStore.getState().addAviso(aviso);
    expect(added).toBe(false);
    expect(useAvisosStore.getState().avisos).toHaveLength(1);
  });

  it("addAvisos adds multiple, skipping duplicates", () => {
    const batch = [
      makeAviso({ id: "a1", crossingId: "san-ysidro", type: "crossing_changed" }),
      makeAviso({ id: "a2", crossingId: "san-ysidro", type: "wait_surge" }),
      makeAviso({ id: "a3", crossingId: "san-ysidro", type: "crossing_changed" }), // duplicate of a1
    ];
    const added = useAvisosStore.getState().addAvisos(batch);
    expect(added).toBe(2);
    expect(useAvisosStore.getState().avisos).toHaveLength(2);
  });

  it("markRead sets read to true", () => {
    const aviso = makeAviso({ id: "test-1" });
    useAvisosStore.getState().addAviso(aviso);
    useAvisosStore.getState().markRead("test-1");

    const stored = useAvisosStore.getState().avisos.find((a) => a.id === "test-1");
    expect(stored?.read).toBe(true);
  });

  it("markAllRead marks all as read", () => {
    useAvisosStore.getState().addAviso(makeAviso({ id: "a1" }));
    useAvisosStore.getState().addAviso(makeAviso({ id: "a2" }));
    useAvisosStore.getState().markAllRead();

    const avisos = useAvisosStore.getState().avisos;
    expect(avisos.every((a) => a.read)).toBe(true);
  });

  it("dismiss sets dismissed to true", () => {
    const aviso = makeAviso({ id: "test-1" });
    useAvisosStore.getState().addAviso(aviso);
    useAvisosStore.getState().dismiss("test-1");

    const stored = useAvisosStore.getState().avisos.find((a) => a.id === "test-1");
    expect(stored?.dismissed).toBe(true);
  });

  it("unreadCount excludes read and dismissed", () => {
    useAvisosStore.getState().addAviso(makeAviso({ id: "a1" }));
    useAvisosStore.getState().addAviso(makeAviso({ id: "a2", read: true }));
    useAvisosStore.getState().addAviso(makeAviso({ id: "a3", dismissed: true }));

    expect(useAvisosStore.getState().unreadCount()).toBe(1);
  });

  it("activeAvisos excludes dismissed and sorts by timestamp", () => {
    const old = makeAviso({ id: "old", timestamp: "2026-01-01T00:00:00Z" });
    const recent = makeAviso({ id: "recent", timestamp: "2026-01-02T00:00:00Z" });
    const dismissed = makeAviso({ id: "dismissed", dismissed: true });

    useAvisosStore.getState().addAvisos([old, recent, dismissed]);
    const active = useAvisosStore.getState().activeAvisos();

    expect(active).toHaveLength(2);
    expect(active[0].id).toBe("recent");
    expect(active[1].id).toBe("old");
  });

  it("clearOld removes old dismissed avisos", () => {
    const oldDismissed = makeAviso({
      id: "old",
      dismissed: true,
      timestamp: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
    });
    const recent = makeAviso({ id: "recent" });

    useAvisosStore.getState().addAvisos([oldDismissed, recent]);
    useAvisosStore.getState().clearOld();

    expect(useAvisosStore.getState().avisos).toHaveLength(1);
    expect(useAvisosStore.getState().avisos[0].id).toBe("recent");
  });

  it("reset clears all state", () => {
    useAvisosStore.getState().addAviso(makeAviso());
    useAvisosStore.getState().reset();
    expect(useAvisosStore.getState().avisos).toEqual([]);
  });
});
