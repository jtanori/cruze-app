/**
 * Crossings query domain — W7 §34 contract.
 *
 * UI passes params + renders results. Filtering, ranking, and sorting
 * are backend responsibilities. Absence of data never excludes:
 * a crossing with unknown lanes/status passes mode/status filters.
 */
import type { BorderCrossing } from "./border-data";
import { haversineDistance } from "./border-data";

export type CrossingsScope = "NEARBY" | "MX" | "US" | "ALL";
export type CrossingsMode = "ALL" | "VEHICLE" | "WALK" | "COMMERCIAL";
export type CrossingsStatusFilter = "ALL" | "OPEN" | "LIMITED" | "CLOSED";
export type CrossingsSort = "RELEVANCE" | "FASTEST" | "NEAREST" | "NAME";
export type CrossingsDirection = "MX_TO_US" | "US_TO_MX";

export interface CrossingsQuery {
  scope: CrossingsScope;
  mode: CrossingsMode;
  status: CrossingsStatusFilter;
  search: string;
  sort: CrossingsSort;
  direction: CrossingsDirection;
  cursor: number;
  limit: number;
  lat?: number;
  lng?: number;
}

export interface CrossingsResult<T> {
  items: T[];
  total: number;
  nextCursor: string | null;
  hasMore: boolean;
  scope: CrossingsScope;
}

const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 50;

function oneOf<T extends string>(value: string | null, allowed: T[], fallback: T): T {
  return value && (allowed as string[]).includes(value) ? (value as T) : fallback;
}

export function parseCrossingsQuery(searchParams: URLSearchParams): CrossingsQuery {
  const latRaw = searchParams.get("lat");
  const lngRaw = searchParams.get("lng");
  const lat = latRaw !== null ? Number(latRaw) : undefined;
  const lng = lngRaw !== null ? Number(lngRaw) : undefined;
  const limitRaw = Number(searchParams.get("limit") ?? "");
  const cursorRaw = Number(searchParams.get("cursor") ?? "");

  return {
    scope: oneOf(searchParams.get("scope"), ["NEARBY", "MX", "US", "ALL"], "ALL"),
    mode: oneOf(searchParams.get("mode"), ["ALL", "VEHICLE", "WALK", "COMMERCIAL"], "ALL"),
    status: oneOf(searchParams.get("status"), ["ALL", "OPEN", "LIMITED", "CLOSED"], "ALL"),
    search: (searchParams.get("search") ?? "").trim().toLowerCase(),
    sort: oneOf(searchParams.get("sort"), ["RELEVANCE", "FASTEST", "NEAREST", "NAME"], "NEAREST"),
    direction: oneOf(searchParams.get("direction"), ["MX_TO_US", "US_TO_MX"], "MX_TO_US"),
    cursor: Number.isFinite(cursorRaw) && cursorRaw > 0 ? Math.floor(cursorRaw) : 0,
    limit:
      Number.isFinite(limitRaw) && limitRaw > 0
        ? Math.min(Math.floor(limitRaw), MAX_LIMIT)
        : DEFAULT_LIMIT,
    lat: lat !== undefined && Number.isFinite(lat) ? lat : undefined,
    lng: lng !== undefined && Number.isFinite(lng) ? lng : undefined,
  };
}

export interface RankableCrossing {
  id: string;
  name: string;
  mexicanCity: string;
  usCity: string;
  status: "OPEN" | "LIMITED" | "CLOSED" | "UNKNOWN";
  waitTime: number | null;
  lastUpdated?: string | null;
  laneCategories: Array<"passenger" | "commercial" | "pedestrian">;
  coordinates: { lat: number; lng: number };
}

const STATUS_ORDER: Record<string, number> = {
  OPEN: 0,
  LIMITED: 1,
  CLOSED: 2,
  UNKNOWN: 3,
};

function modeMatches(crossing: RankableCrossing, mode: CrossingsMode): boolean {
  if (mode === "ALL") return true;
  // Unknown lanes pass through — absence is not incompatibility.
  if (crossing.laneCategories.length === 0) return true;
  const want = mode === "VEHICLE" ? "passenger" : mode === "WALK" ? "pedestrian" : "commercial";
  return crossing.laneCategories.includes(want);
}

/**
 * Scope semantics: every POE serves both sides, so scopes never exclude
 * rows — they label copy and (for NEARBY) drive proximity ranking.
 * NEARBY without coordinates falls back to ALL (echoed in response.scope).
 */
export function resolveScope(query: CrossingsQuery): CrossingsScope {
  if (query.scope === "NEARBY" && (query.lat === undefined || query.lng === undefined)) {
    return "ALL";
  }
  return query.scope;
}

/**
 * Relevance comparator chain (lexicographic, not a weighted formula):
 * operational → shorter wait → fresher → nearer (when coords known).
 * Null waits sort after known waits — unknown is not fast.
 */
export function compareRelevance(
  a: RankableCrossing,
  b: RankableCrossing,
  origin?: { lat: number; lng: number }
): number {
  const byStatus =
    (STATUS_ORDER[a.status] ?? 99) - (STATUS_ORDER[b.status] ?? 99);
  if (byStatus !== 0) return byStatus;
  const aWait = a.waitTime ?? Number.POSITIVE_INFINITY;
  const bWait = b.waitTime ?? Number.POSITIVE_INFINITY;
  if (aWait !== bWait) return aWait - bWait;
  const aFresh = a.lastUpdated ? new Date(a.lastUpdated).getTime() : 0;
  const bFresh = b.lastUpdated ? new Date(b.lastUpdated).getTime() : 0;
  if (aFresh !== bFresh) return bFresh - aFresh;
  if (origin) {
    return (
      haversineDistance(origin, a.coordinates) -
      haversineDistance(origin, b.coordinates)
    );
  }
  return 0;
}

export function applyCrossingsQuery<T extends RankableCrossing>(
  crossings: T[],
  query: CrossingsQuery
): CrossingsResult<T> {
  const scope = resolveScope(query);
  const origin =
    query.lat !== undefined && query.lng !== undefined
      ? { lat: query.lat, lng: query.lng }
      : undefined;

  let items = crossings.filter((c) => {
    if (query.status !== "ALL" && c.status !== query.status) return false;
    if (!modeMatches(c, query.mode)) return false;
    if (
      query.search &&
      !`${c.name} ${c.mexicanCity} ${c.usCity}`.toLowerCase().includes(query.search)
    ) {
      return false;
    }
    return true;
  });

  switch (query.sort) {
    case "FASTEST":
      items = [...items].sort((a, b) => {
        const aw = a.waitTime ?? Number.POSITIVE_INFINITY;
        const bw = b.waitTime ?? Number.POSITIVE_INFINITY;
        return aw - bw;
      });
      break;
    case "NEAREST":
      items = origin
        ? [...items].sort(
            (a, b) =>
              haversineDistance(origin, a.coordinates) -
              haversineDistance(origin, b.coordinates)
          )
        : [...items].sort((a, b) => compareRelevance(a, b, origin));
      break;
    case "NAME":
      items = [...items].sort((a, b) => a.name.localeCompare(b.name));
      break;
    case "RELEVANCE":
    default:
      items = [...items].sort((a, b) => compareRelevance(a, b, origin));
      break;
  }

  const total = items.length;
  const page = items.slice(query.cursor, query.cursor + query.limit);
  const nextOffset = query.cursor + query.limit;
  return {
    items: page,
    total,
    nextCursor: nextOffset < total ? String(nextOffset) : null,
    hasMore: nextOffset < total,
    scope,
  };
}

export type { BorderCrossing };
