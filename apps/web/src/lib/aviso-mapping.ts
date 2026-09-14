/**
 * AV-01 — Mapping functions for Aviso creation.
 *
 * Converts CrossingChange (from LIVE-01) and BorderAlertEvent (legacy)
 * into the unified Aviso type.
 */

import type { Aviso, AvisoType, AvisoSeverity } from "./avisos";
import type { CrossingChange } from "../lib/live-crossing/types";
import type { BorderAlertEvent } from "../types";

let avisoCounter = 0;

function generateAvisoId(): string {
  avisoCounter += 1;
  return `aviso-${Date.now()}-${avisoCounter}`;
}

function severityForStatusChange(
  previous: string,
  current: string
): AvisoSeverity {
  if (current === "closed") return "critical";
  if (previous === "closed" && current === "open") return "info";
  return "warning";
}

function titleForStatusChange(
  crossingName: string,
  current: string
): string {
  const statusLabels: Record<string, string> = {
    open: "abierto",
    limited: "limitado",
    closed: "cerrado",
  };
  return `${crossingName} ahora ${statusLabels[current] || current}`;
}

function descriptionForStatusChange(
  crossingName: string,
  previous: string,
  current: string
): string {
  return `El cruce ${crossingName} cambió de ${previous} a ${current}.`;
}

/**
 * Map a CrossingChange (from LIVE-01 detectCrossingChanges) to an Aviso.
 */
export function mapCrossingChangeToAviso(change: CrossingChange): Aviso {
  let type: AvisoType = "crossing_changed";
  let severity: AvisoSeverity = "warning";
  let title = "";
  let description = "";

  switch (change.type) {
    case "STATUS_CHANGE":
      type = "crossing_changed";
      severity = severityForStatusChange(change.previousStatus, change.currentStatus);
      title = titleForStatusChange(change.crossingId, change.currentStatus);
      description = descriptionForStatusChange(
        change.crossingId,
        change.previousStatus,
        change.currentStatus
      );
      break;

    case "WAIT_SURGE":
      type = "wait_surge";
      severity = "warning";
      title = `Espera aumentó en ${change.crossingId}`;
      description = `El tiempo de espera aumentó de ${change.previousWait} a ${change.currentWait} min.`;
      break;

    case "WAIT_DROP":
      type = "wait_drop";
      severity = "info";
      title = `Espera reducida en ${change.crossingId}`;
      description = `El tiempo de espera bajó de ${change.previousWait} a ${change.currentWait} min.`;
      break;
  }

  return {
    id: generateAvisoId(),
    type,
    severity,
    title,
    description,
    crossingId: change.crossingId,
    previousValue: String(change.previousWait),
    currentValue: String(change.currentWait),
    timestamp: change.detectedAt,
    read: false,
    dismissed: false,
  };
}

/**
 * Map a BorderAlertEvent (legacy) to an Aviso.
 * Used for backward compatibility during migration.
 */
export function mapBorderAlertEventToAviso(event: BorderAlertEvent): Aviso {
  const typeMap: Record<BorderAlertEvent["type"], AvisoType> = {
    QUEUE_SURGE: "wait_surge",
    LANE_STATUS_CHANGE: "crossing_changed",
    PORT_CLOSURE: "crossing_changed",
    WEATHER_INCIDENT: "unusual_condition",
  };

  const severityMap: Record<BorderAlertEvent["severity"], AvisoSeverity> = {
    NORMAL: "info",
    NOTABLE: "info",
    IMPORTANT: "warning",
    CRITICAL: "critical",
  };

  return {
    id: event.id || generateAvisoId(),
    type: typeMap[event.type],
    severity: severityMap[event.severity],
    title: event.headline,
    description: event.description,
    crossingId: event.crossingId,
    crossingName: event.crossingName,
    previousValue: event.previousValue,
    currentValue: event.currentValue,
    timestamp: event.timestamp,
    read: false,
    dismissed: false,
  };
}
