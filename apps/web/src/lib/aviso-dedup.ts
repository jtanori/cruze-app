/**
 * AV-01 — Deduplication logic for Avisos.
 *
 * Prevents duplicate Avisos for the same crossing + change type
 * within a configurable time window.
 */

import type { Aviso, AvisoType } from "./avisos";

/** Default dedup window: 30 minutes */
export const DEDUP_WINDOW_MS = 30 * 60 * 1000;

/**
 * Generate a dedup key for an Aviso.
 * Key is based on crossingId + avisoType (ignores severity, timestamps, etc.).
 */
function dedupKey(crossingId: string | undefined, type: AvisoType): string {
  return `${crossingId || "global"}:${type}`;
}

/**
 * Check if a new Aviso is a duplicate of a recent one.
 *
 * @param newAviso - The Aviso to check
 * @param existingAvisos - Current avisos in the store
 * @param windowMs - Dedup window in milliseconds (default 30min)
 * @returns true if duplicate, false if this is a new qualifying change
 */
export function isDuplicate(
  newAviso: Aviso,
  existingAvisos: Aviso[],
  windowMs: number = DEDUP_WINDOW_MS
): boolean {
  const key = dedupKey(newAviso.crossingId, newAviso.type);
  const now = new Date(newAviso.timestamp).getTime();

  return existingAvisos.some((existing) => {
    const existingKey = dedupKey(existing.crossingId, existing.type);
    if (existingKey !== key) return false;
    if (existing.dismissed) return false;

    const existingTime = new Date(existing.timestamp).getTime();
    const age = now - existingTime;

    // If the existing aviso is within the dedup window, it's a duplicate
    return age >= 0 && age <= windowMs;
  });
}

/**
 * Filter out duplicate Avisos from a batch.
 * Preserves order; keeps the first occurrence of each unique change.
 */
export function filterDuplicates(
  newAvisos: Aviso[],
  existingAvisos: Aviso[],
  windowMs: number = DEDUP_WINDOW_MS
): Aviso[] {
  const filtered: Aviso[] = [];
  let accumulated = [...existingAvisos];

  for (const aviso of newAvisos) {
    if (!isDuplicate(aviso, accumulated, windowMs)) {
      filtered.push(aviso);
      accumulated = [...accumulated, aviso];
    }
  }

  return filtered;
}
