/**
 * Compare domain (C04) — pure computation over directory items.
 *
 * Viaje/distancia need an origin (trip origin or user location);
 * without one those cells are null (absence, never estimates).
 *
 * Labels:
 *   "Mejor opción"  → isWinner (best overall: shortest viaje, else shortest wait)
 *   "Más rápido"    → isFastest && !isWinner (lowest comparable wait in active direction)
 *   "Alternativa"   → eligible && !isWinner && !isFastest
 *   null            → excluded (incompatible mode)
 */
import { haversineDistance } from "./border-data";

export interface CompareInput {
  id: string;
  crossingName: string;
  waitNorthbound: number | null;
  waitSouthbound: number | null;
  status: "OPEN" | "LIMITED" | "CLOSED" | "UNKNOWN";
  lastUpdated?: string | null;
  laneCategories: Array<"passenger" | "commercial" | "pedestrian">;
  coordinates: { lat: number; lng: number };
}

export type CompareTravelMode = "VEHICLE" | "WALK" | "COMMERCIAL" | null;

export type CompareWinnerLabel =
  | "crossings.compare.bestOption"
  | "crossings.compare.fastestOption"
  | "crossings.compare.alternativeOption"
  | null;

export interface CompareRow extends CompareInput {
  distanceKm: number | null;
  viajeMinutes: number | null;
  isWinner: boolean;
  isFastest: boolean;
  isAlternative: boolean;
  winnerLabel: CompareWinnerLabel;
  excluded: boolean;
}

export interface CompareResult {
  rows: CompareRow[];
  bothDirections: boolean;
}

/** Approach ≈ haversine × 1.2 (same method as recommendation engine). */
function approachMinutes(
  origin: { lat: number; lng: number },
  target: { lat: number; lng: number }
): number {
  return Math.round(haversineDistance(origin, target) * 1.2);
}

function modeSupported(
  laneCategories: CompareInput["laneCategories"],
  mode: CompareTravelMode
): boolean {
  if (!mode) return true;
  // Unknown lanes pass through — absence is not incompatibility.
  if (laneCategories.length === 0) return true;
  const want =
    mode === "VEHICLE"
      ? "passenger"
      : mode === "WALK"
        ? "pedestrian"
        : "commercial";
  return laneCategories.includes(want);
}

/** Active-side wait for the given direction. null when direction is null (both). */
function activeWait(
  input: CompareInput,
  direction: "MX_TO_US" | "US_TO_MX" | null
): number | null {
  if (direction === "US_TO_MX") return input.waitSouthbound;
  if (direction === "MX_TO_US") return input.waitNorthbound;
  return null;
}

/** Best comparable wait: active direction if set, else min of both available. */
function comparableWait(
  input: CompareInput,
  direction: "MX_TO_US" | "US_TO_MX" | null
): number | null {
  if (direction === "US_TO_MX") return input.waitSouthbound;
  if (direction === "MX_TO_US") return input.waitNorthbound;
  // Both directions: pick the lower available wait for ranking.
  const waits = [input.waitNorthbound, input.waitSouthbound].filter(
    (w): w is number => w !== null
  );
  return waits.length > 0 ? Math.min(...waits) : null;
}

export function compareCrossings(
  inputs: CompareInput[],
  options: {
    origin?: { lat: number; lng: number } | null;
    direction?: "MX_TO_US" | "US_TO_MX" | null;
    mode?: CompareTravelMode;
  } = {}
): CompareResult {
  const { origin = null, direction = null, mode = null } = options;

  const bothDirections = direction === null;

  const rows: CompareRow[] = inputs.map((input) => {
    const distanceKm = origin
      ? Math.round(haversineDistance(origin, input.coordinates) * 10) / 10
      : null;

    const sideWait =
      direction === "US_TO_MX"
        ? input.waitSouthbound
        : direction === "MX_TO_US"
          ? input.waitNorthbound
          : null;

    const viajeMinutes =
      origin && sideWait !== null
        ? approachMinutes(origin, input.coordinates) + sideWait
        : null;

    return {
      ...input,
      distanceKm,
      viajeMinutes,
      isWinner: false,
      isFastest: false,
      isAlternative: false,
      winnerLabel: null,
      excluded: !modeSupported(input.laneCategories, mode),
    };
  });

  const eligible = rows.filter((r) => !r.excluded);
  const pool = eligible.length > 0 ? eligible : rows;

  // Winner: shortest computable viaje, else shortest comparable wait.
  const withViaje = pool.filter((r) => r.viajeMinutes !== null);
  const ranked =
    withViaje.length > 0
      ? [...withViaje].sort(
          (a, b) => (a.viajeMinutes as number) - (b.viajeMinutes as number)
        )
      : [...pool].sort((a, b) => {
          const aw = comparableWait(a, direction) ?? Number.POSITIVE_INFINITY;
          const bw = comparableWait(b, direction) ?? Number.POSITIVE_INFINITY;
          return aw - bw;
        });

  if (ranked.length > 0 && ranked[0]) ranked[0].isWinner = true;

  // Fastest: lowest comparable wait among eligible (may differ from winner).
  const withWait = pool.filter(
    (r) => comparableWait(r, direction) !== null
  );
  const waitRanked = [...withWait].sort(
    (a, b) =>
      (comparableWait(a, direction) as number) -
      (comparableWait(b, direction) as number)
  );
  if (waitRanked.length > 0 && waitRanked[0]) waitRanked[0].isFastest = true;

  // Labels
  for (const r of rows) {
    if (r.excluded) {
      r.winnerLabel = null;
    } else if (r.isWinner) {
      r.winnerLabel = "crossings.compare.bestOption";
    } else if (r.isFastest) {
      r.winnerLabel = "crossings.compare.fastestOption";
    } else {
      r.isAlternative = true;
      r.winnerLabel = "crossings.compare.alternativeOption";
    }
  }

  return { rows, bothDirections };
}
