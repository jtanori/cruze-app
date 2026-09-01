/**
 * Alert Baseline Manager
 * Stores rolling exponential moving average (EMA) per crossing/lane.
 * Persists to localStorage for cross-session continuity.
 */

interface LaneBaseline {
  crossingId: string;
  laneName: string;
  ema: number;           // Current EMA value (minutes)
  sampleCount: number;   // Number of samples used
  lastUpdatedAt: string; // ISO timestamp
}

interface BaselineStore {
  lanes: LaneBaseline[];
}

const STORAGE_KEY = "cruze-alert-baseline";
const EMA_ALPHA = 0.3; // Smoothing factor (0.1 = slow, 0.5 = fast)

function loadBaseline(): BaselineStore {
  if (typeof window === "undefined") return { lanes: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { lanes: [] };
  } catch {
    return { lanes: [] };
  }
}

function saveBaseline(store: BaselineStore): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
  } catch {
    // Storage full or unavailable
  }
}

/**
 * Update baseline with a new sample for a specific lane.
 */
export function updateLaneBaseline(
  crossingId: string,
  laneName: string,
  waitTime: number
): void {
  const store = loadBaseline();
  const key = `${crossingId}:${laneName}`;
  const existing = store.lanes.find(
    (l) => l.crossingId === crossingId && l.laneName === laneName
  );

  if (existing) {
    // Update EMA
    existing.ema = existing.ema * (1 - EMA_ALPHA) + waitTime * EMA_ALPHA;
    existing.sampleCount += 1;
    existing.lastUpdatedAt = new Date().toISOString();
  } else {
    store.lanes.push({
      crossingId,
      laneName,
      ema: waitTime,
      sampleCount: 1,
      lastUpdatedAt: new Date().toISOString(),
    });
  }

  saveBaseline(store);
}

/**
 * Get baseline (EMA) for a specific lane.
 * Returns null if no baseline exists.
 */
export function getLaneBaseline(
  crossingId: string,
  laneName: string
): number | null {
  const store = loadBaseline();
  const baseline = store.lanes.find(
    (l) => l.crossingId === crossingId && l.laneName === laneName
  );
  return baseline?.ema ?? null;
}

/**
 * Get baseline for all lanes at a crossing.
 */
export function getCrossingBaseline(
  crossingId: string
): Record<string, number> {
  const store = loadBaseline();
  const result: Record<string, number> = {};
  for (const lane of store.lanes) {
    if (lane.crossingId === crossingId) {
      result[lane.laneName] = lane.ema;
    }
  }
  return result;
}

/**
 * Get the rolling average wait time for a crossing (across all lanes).
 */
export function getCrossingAverageBaseline(crossingId: string): number | null {
  const baselines = getCrossingBaseline(crossingId);
  const values = Object.values(baselines);
  if (values.length === 0) return null;
  return values.reduce((a, b) => a + b, 0) / values.length;
}

/**
 * Clean up stale baselines older than the specified age.
 */
export function cleanupStaleBaselines(maxAgeMs: number = 7 * 24 * 60 * 60 * 1000): void {
  const store = loadBaseline();
  const cutoff = new Date(Date.now() - maxAgeMs).toISOString();
  store.lanes = store.lanes.filter((l) => l.lastUpdatedAt > cutoff);
  saveBaseline(store);
}

/**
 * Reset all baselines.
 */
export function resetBaselines(): void {
  saveBaseline({ lanes: [] });
}
