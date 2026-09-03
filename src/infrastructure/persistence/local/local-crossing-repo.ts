/*── CROSSING REPOSITORY ────────────────────────────────────────────────────╭
  Purpose: Repository pattern for crossing data persistence
 ──────────────────────────────────────────────────────────────────────────╯

  DESIGN SPECS (cruze-data-layer.md + cruze-screens-spec-review):
  - Crossing entity with full lane data, wait times, restrictions
  - Repository pattern: localStorage now, remote API later
  - Three-layer storage: Client State / Cache / Database
  - Server/API boundary via Next.js route handlers
  - CBP API: https://bwt.cbp.gov/api/waittimes (free, no key, 55+ crossings)
  - Southbound data: Community-sourced estimation (70% of northbound times)

  CROSSING ENTITY:
    id: string
    name: string
    cityOrigin: string
    cityDestination: string
    direction: "MX_TO_US" | "US_TO_MX"
    status: "OPEN" | "LIMITED" | "CONGESTED" | "DELAYED" | "CLOSED" | "UNKNOWN"
    is24Hours: boolean
    operatingHoursText: string
    lanes: Record<LaneProgram, LaneQueueData>
    dominantWaitMinutes: number
    typicalWaitMinutes: number
    lastUpdated: string
    coordinates: { lat: number; lng: number }
    restrictions: {
      commercialAllowed: boolean
      pedestrianAllowed: boolean
      specialNotices?: string[]
    }
    historicalHourlyProfile?: Array<{
      hour: number
      typicalWait: number
      todayActualWait?: number
    }>

  LANE PROGRAMS:
    "STANDARD" | "READY_LANE" | "SENTRI" | "PEDESTRIAN" | "COMMERCIAL"

  LANE QUEUE DATA:
    program: LaneProgram
    isOpen: boolean
    lanesOpenCount?: number
    totalLanesCount?: number
    currentWaitMinutes: number
    trend: "IMPROVING" | "STABLE" | "WORSENING"
    operationalNote?: string
──────────────────────────────────────────────────────────────────────────*/
import type { CrossingEntity, LaneProgram } from "@/domain/crossing/types";

export type CorridorDirection = "MX_TO_US" | "US_TO_MX";

export interface CrossingRepository {
  getAll(): CrossingEntity[];
  getByDirection(direction: CorridorDirection): CrossingEntity[];
  getOpenCrossings(): CrossingEntity[];
  getCrossing(id: string): CrossingEntity | null;
  updateCrossing(id: string, updates: Partial<CrossingEntity>): void;
  refreshAll(): Promise<void>;
}

function createCrossingRepository(): CrossingRepository {
  // In-memory store for Phase 1, replaces with localStorage later
  const crossingsStore = new Map<string, CrossingEntity>();

  // Load mock data on initialization
  // MOCK_CROSSINGS would be imported here in production

  function getAll(): CrossingEntity[] {
    return Array.from(crossingsStore.values());
  }

  function getByDirection(direction: CorridorDirection): CrossingEntity[] {
    return Array.from(crossingsStore.values()).filter(
      (c) => c.direction === direction
    );
  }

  function getOpenCrossings(): CrossingEntity[] {
    return Array.from(crossingsStore.values()).filter(
      (c) => c.status === "OPEN"
    );
  }

  function getCrossing(id: string): CrossingEntity | null {
    return crossingsStore.get(id) || null;
  }

  function updateCrossing(id: string, updates: Partial<CrossingEntity>): void {
    const existing = crossingsStore.get(id);
    if (existing) {
      crossingsStore.set(id, { ...existing, ...updates });
    }
  }

  function refreshAll(): Promise<void> {
    // In Phase 1, this is a no-op
    // In Phase 2+, would fetch from CBP API: https://bwt.cbp.gov/api/waittimes
    return Promise.resolve();
  }

  return {
    getAll,
    getByDirection,
    getOpenCrossings,
    getCrossing,
    updateCrossing,
    refreshAll,
  };
}

export const useCrossingRepository = createCrossingRepository();