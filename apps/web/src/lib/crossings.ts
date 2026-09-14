/**
 * Crossings data domain — normalization + interim relevance ranking.
 *
 * Retrieval limit ≠ display limit: fetch a candidate set, normalize,
 * filter, rank, then present 2–3. The rank below is INTERIM until the
 * backend ranks (spec §5 RELEVANCE); it is documented, not canon.
 *
 * NETWORK RULE: browser code fetches crossing data only through /api/*
 * (this helper). Direct bwt.cbp.gov calls live server-side only
 * (border-data-service, consumed by API routes).
 */
import type { MergedCrossingData } from "./border-data-service";

export async function fetchMergedCrossings(): Promise<MergedCrossingData[]> {
  const response = await fetch("/api/crossings/merged");
  if (!response.ok) {
    throw new Error(`merged crossings fetch: ${response.status}`);
  }
  const data = await response.json();
  return Array.isArray(data.crossings) ? data.crossings : [];
}

export type CrossingDirection = "MX_TO_US" | "US_TO_MX";
export type CrossingStatus = "open" | "closed" | "limited";

export interface NearbyCrossing {
  id: string;
  name: string;
  waitTime: number;
  direction: CrossingDirection;
  status: CrossingStatus;
  lastUpdated: number;
}

interface CrossingsApiItem {
  id?: unknown;
  name?: unknown;
  waitTime?: unknown;
  dominantWaitMinutes?: unknown;
  direction?: unknown;
  status?: unknown;
  lastUpdated?: unknown;
}

function toNumber(value: unknown, fallback: number): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function normalizeCrossings(items: unknown): NearbyCrossing[] {
  if (!Array.isArray(items)) return [];
  const out: NearbyCrossing[] = [];
  for (const raw of items as CrossingsApiItem[]) {
    if (!raw || typeof raw !== "object") continue;
    const id = String(raw.id ?? "");
    const name = String(raw.name ?? "");
    if (!id || !name) continue;
    const direction = String(raw.direction || "MX_TO_US").toUpperCase();
    const status = String(raw.status || "open").toLowerCase();
    out.push({
      id,
      name,
      waitTime: toNumber(raw.waitTime, toNumber(raw.dominantWaitMinutes, 0)),
      direction: direction === "US_TO_MX" ? "US_TO_MX" : "MX_TO_US",
      status: status === "closed" || status === "limited" ? status : "open",
      lastUpdated:
        typeof raw.lastUpdated === "string" || typeof raw.lastUpdated === "number"
          ? new Date(raw.lastUpdated).getTime() || Date.now()
          : Date.now(),
    });
  }
  return out;
}

const STATUS_ORDER: Record<CrossingStatus, number> = {
  open: 0,
  limited: 1,
  closed: 2,
};

/** Interim rank: operational first, then shortest wait, then freshest. */
export function rankCrossings(crossings: NearbyCrossing[]): NearbyCrossing[] {
  return [...crossings].sort((a, b) => {
    const byStatus = STATUS_ORDER[a.status] - STATUS_ORDER[b.status];
    if (byStatus !== 0) return byStatus;
    if (a.waitTime !== b.waitTime) return a.waitTime - b.waitTime;
    return b.lastUpdated - a.lastUpdated;
  });
}
