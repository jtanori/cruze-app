/**
 * Border Data Service
 * Merges CBP northbound data with southbound estimates
 */

import { BORDER_CROSSINGS, type BorderCrossing } from "./border-data";
import { fetchCBPWaitTimes, type NormalizedCrossingWait, type CBPLane } from "./cbp-api";

export interface CrossingWithLiveData extends BorderCrossing {
  status: "OPEN" | "CLOSED" | "LIMITED";
  waitTime: number;
  isLive: boolean;
  lastUpdated?: string;
  hours: string;
  lanes: CBPLane[];
}

export interface MergedCrossingData extends BorderCrossing {
  waitTimeNorthbound: number;
  waitTimeSouthbound: number;
  statusNorthbound: "OPEN" | "CLOSED" | "LIMITED";
  statusSouthbound: "OPEN" | "CLOSED" | "LIMITED";
  lanesNorthbound: CBPLane[];
  lanesSouthbound: CBPLane[];
  isLive: boolean;
  lastUpdated?: string;
  hours: string;
}

/** Fallback wait times when live data unavailable */
const FALLBACK_WAIT_TIMES: Record<string, number> = {
  "san-ysidro": 45,
  "otay-mesa": 35,
  tecate: 15,
  "calexico-west": 18,
  "calexico-east": 22,
  "nogales-mariposa": 20,
  "nogales-decongestion": 25,
  "san-luis": 16,
  "el-paso-ysleta": 19,
  "el-paso-stanton": 23,
  "el-paso-bridge-of-americas": 27,
  "laredo-north": 21,
  hidalgo: 17,
  brownsville: 24,
};

/** Estimate southbound wait time from northbound data */
function estimateSouthboundWait(cbpData: NormalizedCrossingWait): number {
  // Typically southbound is faster, using 60-80% of northbound wait
  const passengerLanes = cbpData.lanes.filter((l) => l.category === "passenger");
  const northboundWait = passengerLanes.length > 0 ? passengerLanes[0].waitTime : 20;
  if (northboundWait === 0) return 5;
  return Math.max(5, Math.round(northboundWait * 0.7));
}

/** Merge CBP live data with our crossing data */
function mergeWithCBPData(
  crossing: BorderCrossing,
  cbpWait: NormalizedCrossingWait | null,
  direction: "MX_TO_US" | "US_TO_MX"
): CrossingWithLiveData {
  if (!cbpWait) {
    return {
      ...crossing,
      status: "OPEN",
      waitTime: FALLBACK_WAIT_TIMES[crossing.id] || 20,
      isLive: false,
      hours: "Open 24 hours",
      lanes: [],
    };
  }

  const waitTime =
    direction === "MX_TO_US"
      ? cbpWait.primaryWaitTime
      : estimateSouthboundWait(cbpWait);

  return {
    ...crossing,
    status: cbpWait.status,
    waitTime,
    isLive: true,
    lastUpdated: cbpWait.lastUpdated,
    hours: cbpWait.hours,
    lanes: cbpWait.lanes,
  };
}

/** Get all crossings with live or fallback data */
export async function getCrossingsWithLiveData(
  direction: "MX_TO_US" | "US_TO_MX" = "MX_TO_US"
): Promise<CrossingWithLiveData[]> {
  const cbpData = await fetchCBPWaitTimes();

  // Index CBP data by crossing ID
  const cbpByCrossingId = new Map<string, NormalizedCrossingWait>();
  for (const wait of cbpData) {
    cbpByCrossingId.set(wait.portId, wait);
  }

  return BORDER_CROSSINGS.map((crossing) => {
    const cbpWait = cbpByCrossingId.get(crossing.id) || null;
    return mergeWithCBPData(crossing, cbpWait, direction);
  });
}

/** Get a single crossing with live data */
export async function getCrossingWithLiveData(
  crossingId: string,
  direction: "MX_TO_US" | "US_TO_MX" = "MX_TO_US"
): Promise<CrossingWithLiveData | null> {
  const crossing = BORDER_CROSSINGS.find((c) => c.id === crossingId);
  if (!crossing) return null;

  const cbpData = await fetchCBPWaitTimes();
  const cbpWait = cbpData.find((w) => w.portId === crossingId) || null;

  return mergeWithCBPData(crossing, cbpWait, direction);
}

export interface CrossingBothDirections {
  crossing: BorderCrossing;
  northbound: { waitTime: number; status: "OPEN" | "CLOSED" | "LIMITED" };
  southbound: { waitTime: number; status: "OPEN" | "CLOSED" | "LIMITED" };
  isLive: boolean;
  lastUpdated?: string;
  hours: string;
  lanes: CBPLane[];
}

/**
 * Single crossing with both directions from one fetch.
 * Used when no confident direction exists — the surface renders
 * NORTE + SUR instead of picking a side.
 */
export async function getCrossingWithBothDirections(
  crossingId: string
): Promise<CrossingBothDirections | null> {
  const crossing = BORDER_CROSSINGS.find((c) => c.id === crossingId);
  if (!crossing) return null;

  const cbpData = await fetchCBPWaitTimes();
  const cbpWait = cbpData.find((w) => w.portId === crossingId) || null;
  if (!cbpWait) return null;

  return {
    crossing,
    northbound: { waitTime: cbpWait.primaryWaitTime, status: cbpWait.status },
    southbound: {
      waitTime: estimateSouthboundWait(cbpWait),
      status: cbpWait.status,
    },
    isLive: true,
    lastUpdated: cbpWait.lastUpdated,
    hours: cbpWait.hours,
    lanes: cbpWait.lanes,
  };
}

/** Get all crossings with both northbound and southbound data */
export async function getMergedCrossingsData(): Promise<MergedCrossingData[]> {
  const cbpData = await fetchCBPWaitTimes();

  // Index CBP data by crossing ID
  const cbpByCrossingId = new Map<string, NormalizedCrossingWait>();
  for (const wait of cbpData) {
    cbpByCrossingId.set(wait.portId, wait);
  }

  return BORDER_CROSSINGS.map((crossing) => {
    const cbpWait = cbpByCrossingId.get(crossing.id) || null;

    // Northbound data
    const northboundWait = cbpWait
      ? cbpWait.primaryWaitTime
      : FALLBACK_WAIT_TIMES[crossing.id] || 20;

    // Southbound estimate
    const southboundWait = cbpWait
      ? estimateSouthboundWait(cbpWait)
      : Math.round((FALLBACK_WAIT_TIMES[crossing.id] || 20) * 0.7);

    return {
      ...crossing,
      waitTimeNorthbound: northboundWait,
      waitTimeSouthbound: southboundWait,
      statusNorthbound: cbpWait?.status || "OPEN",
      statusSouthbound: cbpWait?.status || "OPEN",
      lanesNorthbound: cbpWait?.lanes || [],
      lanesSouthbound: cbpWait?.lanes || [],
      isLive: !!cbpWait,
      lastUpdated: cbpWait?.lastUpdated,
      hours: cbpWait?.hours || "Open 24 hours",
    };
  });
}
