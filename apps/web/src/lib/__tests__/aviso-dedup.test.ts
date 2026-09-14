import { describe, it, expect } from "vitest";
import { isDuplicate, filterDuplicates, DEDUP_WINDOW_MS } from "../aviso-dedup";
import type { Aviso } from "../avisos";

function makeAviso(overrides: Partial<Aviso> = {}): Aviso {
  return {
    id: "aviso-1",
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

describe("isDuplicate", () => {
  it("returns false when no existing avisos", () => {
    const aviso = makeAviso();
    expect(isDuplicate(aviso, [])).toBe(false);
  });

  it("returns false for different crossing", () => {
    const existing = makeAviso({ crossingId: "otay-mesa" });
    const newAviso = makeAviso({ crossingId: "san-ysidro" });
    expect(isDuplicate(newAviso, [existing])).toBe(false);
  });

  it("returns false for different type", () => {
    const existing = makeAviso({ type: "wait_surge" });
    const newAviso = makeAviso({ type: "crossing_changed" });
    expect(isDuplicate(newAviso, [existing])).toBe(false);
  });

  it("returns true for same crossing + type within window", () => {
    const now = new Date();
    const existing = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
      timestamp: now.toISOString(),
    });
    const newAviso = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
      timestamp: new Date(now.getTime() + 5 * 60 * 1000).toISOString(), // 5 min later
    });
    expect(isDuplicate(newAviso, [existing])).toBe(true);
  });

  it("returns false for same crossing + type outside window", () => {
    const now = new Date();
    const existing = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
      timestamp: now.toISOString(),
    });
    const newAviso = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
      timestamp: new Date(now.getTime() + DEDUP_WINDOW_MS + 1).toISOString(),
    });
    expect(isDuplicate(newAviso, [existing])).toBe(false);
  });

  it("ignores dismissed avisos for dedup", () => {
    const existing = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
      dismissed: true,
    });
    const newAviso = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
    });
    expect(isDuplicate(newAviso, [existing])).toBe(false);
  });
});

describe("filterDuplicates", () => {
  it("filters duplicates from a batch", () => {
    const existing = makeAviso({
      crossingId: "san-ysidro",
      type: "crossing_changed",
    });
    const newBatch = [
      makeAviso({ id: "new-1", crossingId: "san-ysidro", type: "crossing_changed" }),
      makeAviso({ id: "new-2", crossingId: "san-ysidro", type: "wait_surge" }),
    ];
    const filtered = filterDuplicates(newBatch, [existing]);
    expect(filtered).toHaveLength(1);
    expect(filtered[0].id).toBe("new-2");
  });

  it("returns all when no duplicates", () => {
    const newBatch = [
      makeAviso({ id: "new-1", crossingId: "san-ysidro" }),
      makeAviso({ id: "new-2", crossingId: "otay-mesa" }),
    ];
    const filtered = filterDuplicates(newBatch, []);
    expect(filtered).toHaveLength(2);
  });
});
