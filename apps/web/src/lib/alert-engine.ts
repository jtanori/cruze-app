/**
 * Alert Engine
 * Compares current snapshot against baseline to detect significant changes.
 * Generates alert events based on predefined thresholds.
 */

import type { MergedCrossingData } from "./border-data-service";
import type { BorderAlertEvent, AlertEventType, AlertSeverity } from "@/types";
import {
  updateLaneBaseline,
  getLaneBaseline,
  getCrossingAverageBaseline,
} from "./alert-baseline";

const WAIT_SURGE_ABSOLUTE_THRESHOLD = 15; // +15 min = significant
const WAIT_SURGE_PERCENTAGE_THRESHOLD = 0.4; // +40% = significant
const WAIT_DROP_THRESHOLD = -15; // -15 min = notable improvement
const CONFIDENCE_DROP_THRESHOLD = 15; // -15 points

/**
 * Analyze a crossing snapshot and generate alerts.
 * Also updates baseline with new data.
 */
export function analyzeCrossing(
  current: MergedCrossingData,
  previous: MergedCrossingData | null
): BorderAlertEvent[] {
  const alerts: BorderAlertEvent[] = [];
  const now = new Date().toISOString();

  // Update baselines for all lanes
  for (const lane of current.lanesNorthbound) {
    updateLaneBaseline(current.id, `nb:${lane.name}`, lane.waitTime);
  }
  for (const lane of current.lanesSouthbound) {
    updateLaneBaseline(current.id, `sb:${lane.name}`, lane.waitTime);
  }

  // If no previous snapshot, just return (first load)
  if (!previous) return alerts;

  // Check wait time changes (northbound)
  const currentAvgNb = current.lanesNorthbound.length > 0
    ? current.lanesNorthbound.reduce((sum, l) => sum + l.waitTime, 0) / current.lanesNorthbound.length
    : current.waitTimeNorthbound;
  const prevAvgNb = previous.lanesNorthbound.length > 0
    ? previous.lanesNorthbound.reduce((sum, l) => sum + l.waitTime, 0) / previous.lanesNorthbound.length
    : previous.waitTimeNorthbound;

  const waitDeltaNb = currentAvgNb - prevAvgNb;
  const waitDeltaPctNb = prevAvgNb > 0 ? waitDeltaNb / prevAvgNb : 0;

  // WAIT_SURGE detection
  if (
    waitDeltaNb >= WAIT_SURGE_ABSOLUTE_THRESHOLD ||
    waitDeltaPctNb >= WAIT_SURGE_PERCENTAGE_THRESHOLD
  ) {
    alerts.push(createWaitSurgeAlert(current, waitDeltaNb, "northbound", now));
  }

  // WAIT_DROP detection
  if (waitDeltaNb <= WAIT_DROP_THRESHOLD) {
    alerts.push(createWaitDropAlert(current, Math.abs(waitDeltaNb), "northbound", now));
  }

  // Lane status changes
  const laneAlerts = detectLaneStatusChanges(current, previous, now);
  alerts.push(...laneAlerts);

  return alerts;
}

/**
 * Analyze all crossings and generate alerts.
 */
export function analyzeAllCrossings(
  current: MergedCrossingData[],
  previous: MergedCrossingData[]
): BorderAlertEvent[] {
  const alerts: BorderAlertEvent[] = [];
  const prevMap = new Map(previous.map((c) => [c.id, c]));

  for (const crossing of current) {
    const prev = prevMap.get(crossing.id) || null;
    const crossingAlerts = analyzeCrossing(crossing, prev);
    alerts.push(...crossingAlerts);
  }

  return alerts;
}

/**
 * Detect lane status changes between snapshots.
 */
function detectLaneStatusChanges(
  current: MergedCrossingData,
  previous: MergedCrossingData,
  timestamp: string
): BorderAlertEvent[] {
  const alerts: BorderAlertEvent[] = [];

  // Compare northbound lanes
  for (const currentLane of current.lanesNorthbound) {
    const prevLane = previous.lanesNorthbound.find((l) => l.name === currentLane.name);
    if (!prevLane) continue;

    if (prevLane.isOpen && !currentLane.isOpen) {
      alerts.push({
        id: `${current.id}:${currentLane.name}:closed:${timestamp}`,
        crossingId: current.id,
        crossingName: current.name,
        direction: "MX_TO_US",
        timestamp,
        type: "LANE_STATUS_CHANGE",
        severity: "CRITICAL",
        headline: `${currentLane.name} closed`,
        description: `${currentLane.name} at ${current.name} is now closed.`,
        previousValue: "Open",
        currentValue: "Closed",
      });
    } else if (!prevLane.isOpen && currentLane.isOpen) {
      alerts.push({
        id: `${current.id}:${currentLane.name}:opened:${timestamp}`,
        crossingId: current.id,
        crossingName: current.name,
        direction: "MX_TO_US",
        timestamp,
        type: "LANE_STATUS_CHANGE",
        severity: "NORMAL",
        headline: `${currentLane.name} reopened`,
        description: `${currentLane.name} at ${current.name} is now open.`,
        previousValue: "Closed",
        currentValue: "Open",
      });
    }

    // Lane count changes
    if (prevLane.isOpen && currentLane.isOpen) {
      const prevOpen = prevLane.lanesOpen;
      const currOpen = currentLane.lanesOpen;
      if (prevOpen !== currOpen && Math.abs(prevOpen - currOpen) >= 1) {
        alerts.push({
          id: `${current.id}:${currentLane.name}:count:${timestamp}`,
          crossingId: current.id,
          crossingName: current.name,
          direction: "MX_TO_US",
          timestamp,
          type: "LANE_STATUS_CHANGE",
          severity: currOpen < prevOpen ? "IMPORTANT" : "NOTABLE",
          headline: `${currentLane.name} lanes ${currOpen < prevOpen ? "reduced" : "increased"}`,
          description: `${currentLane.name} at ${current.name}: ${prevOpen} → ${currOpen} lanes open.`,
          previousValue: `${prevOpen} lanes`,
          currentValue: `${currOpen} lanes`,
        });
      }
    }
  }

  return alerts;
}

function createWaitSurgeAlert(
  crossing: MergedCrossingData,
  delta: number,
  direction: "northbound" | "southbound",
  timestamp: string
): BorderAlertEvent {
  const dirLabel = direction === "northbound" ? "Northbound" : "Southbound";
  return {
    id: `${crossing.id}:surge:${direction}:${timestamp}`,
    crossingId: crossing.id,
    crossingName: crossing.name,
    direction: direction === "northbound" ? "MX_TO_US" : "US_TO_MX",
    timestamp,
    type: "QUEUE_SURGE",
    severity: "IMPORTANT",
    headline: `Wait increased +${Math.round(delta)} min`,
    description: `${dirLabel} wait times at ${crossing.name} have increased significantly.`,
    previousValue: `${Math.round(crossing.waitTimeNorthbound - delta)} min`,
    currentValue: `${crossing.waitTimeNorthbound} min`,
  };
}

function createWaitDropAlert(
  crossing: MergedCrossingData,
  delta: number,
  direction: "northbound" | "southbound",
  timestamp: string
): BorderAlertEvent {
  const dirLabel = direction === "northbound" ? "Northbound" : "Southbound";
  return {
    id: `${crossing.id}:drop:${direction}:${timestamp}`,
    crossingId: crossing.id,
    crossingName: crossing.name,
    direction: direction === "northbound" ? "MX_TO_US" : "US_TO_MX",
    timestamp,
    type: "QUEUE_SURGE",
    severity: "NOTABLE",
    headline: `Wait decreased -${Math.round(delta)} min`,
    description: `${dirLabel} wait times at ${crossing.name} have improved.`,
    previousValue: `${Math.round(crossing.waitTimeNorthbound + delta)} min`,
    currentValue: `${crossing.waitTimeNorthbound} min`,
  };
}
