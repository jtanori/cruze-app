import { describe, it, expect } from "vitest";
import {
  parseCrossingsQuery,
  applyCrossingsQuery,
  resolveScope,
  type RankableCrossing,
} from "../crossings-query";

const base: RankableCrossing = {
  id: "x",
  name: "X",
  mexicanCity: "Tijuana",
  usCity: "San Diego",
  status: "OPEN",
  waitTime: 10,
  lastUpdated: "2026-01-01T00:00:00Z",
  laneCategories: ["passenger"],
  coordinates: { lat: 32.5, lng: -117.0 },
};

function query(overrides = {}) {
  return {
    scope: "ALL" as const,
    mode: "ALL" as const,
    status: "ALL" as const,
    search: "",
    sort: "RELEVANCE" as const,
    direction: "MX_TO_US" as const,
    cursor: 0,
    limit: 20,
    ...overrides,
  };
}

describe("parseCrossingsQuery", () => {
  it("defaults safely on garbage", () => {
    const q = parseCrossingsQuery(
      new URLSearchParams("scope=XX&sort=NOPE&limit=9999&cursor=-3")
    );
    expect(q.scope).toBe("ALL");
    expect(q.sort).toBe("NEAREST");
    expect(q.limit).toBe(50);
    expect(q.cursor).toBe(0);
  });
});

describe("resolveScope", () => {
  it("NEARBY without coords falls back to ALL", () => {
    expect(resolveScope(query({ scope: "NEARBY" }))).toBe("ALL");
  });

  it("NEARBY with coords stays NEARBY", () => {
    expect(
      resolveScope(query({ scope: "NEARBY", lat: 32.5, lng: -117.0 }))
    ).toBe("NEARBY");
  });
});

describe("applyCrossingsQuery", () => {
  const rows: RankableCrossing[] = [
    { ...base, id: "closed-slow", status: "CLOSED", waitTime: 60 },
    { ...base, id: "open-slow", status: "OPEN", waitTime: 40 },
    { ...base, id: "open-fast", status: "OPEN", waitTime: 5 },
    { ...base, id: "unknown", status: "UNKNOWN", waitTime: null },
  ];

  it("ranks operational → wait → unknown-last, paginates with total", () => {
    const r = applyCrossingsQuery(rows, query({ limit: 2 }));
    expect(r.items.map((i) => i.id)).toEqual(["open-fast", "open-slow"]);
    expect(r.total).toBe(4);
    expect(r.hasMore).toBe(true);
    expect(r.nextCursor).toBe("2");
    const r2 = applyCrossingsQuery(rows, query({ limit: 2, cursor: 2 }));
    expect(r2.items.map((i) => i.id)).toEqual(["closed-slow", "unknown"]);
    expect(r2.hasMore).toBe(false);
    expect(r2.nextCursor).toBeNull();
  });

  it("unknown lanes pass mode filter; known-incompatible excluded", () => {
    const mixed: RankableCrossing[] = [
      { ...base, id: "nolanes", laneCategories: [] },
      { ...base, id: "comm", laneCategories: ["commercial"] },
    ];
    const r = applyCrossingsQuery(mixed, query({ mode: "WALK" }));
    expect(r.items.map((i) => i.id)).toEqual(["nolanes"]);
  });

  it("search matches name + both cities", () => {
    const r = applyCrossingsQuery(rows, query({ search: "san diego" }));
    expect(r.total).toBe(4);
    const r2 = applyCrossingsQuery(rows, query({ search: "zzz" }));
    expect(r2.total).toBe(0);
  });
});
