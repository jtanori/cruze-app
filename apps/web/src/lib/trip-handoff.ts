/**
 * Trip-setup handoff (?dest= / ?crossing=) — parse → resolve → guard.
 *
 * The crossing is a CANDIDATE, never an instruction: compatibility is
 * evaluated before anything touches trip context, and a conflict
 * rejects with a reason the UI must explain (never silent overwrite).
 */
import { BORDER_CROSSINGS } from "./border-data";
import type { TripDestinationSelection } from "./trip-navigation";

export interface HandoffRequest {
  destination: TripDestinationSelection | null;
  crossingId: string | null;
}

export interface CrossingCandidate {
  id: string;
  name: string;
}

export interface ActiveTripContext {
  destinationId: string | null;
}

export type HandoffVerdict =
  | { compatible: true; candidate: CrossingCandidate | null }
  | { compatible: false; reason: "unknown-crossing" | "active-trip-conflict" };

function isValidDestination(value: unknown): value is TripDestinationSelection {
  if (!value || typeof value !== "object") return false;
  const d = value as Record<string, unknown>;
  return (
    typeof d.id === "string" &&
    typeof d.name === "string" &&
    typeof d.lat === "number" &&
    typeof d.lng === "number" &&
    (d.country === "MX" || d.country === "US")
  );
}

export function parseSetupParams(search: string): HandoffRequest {
  const params = new URLSearchParams(search);
  const rawDest = params.get("dest");
  const rawCrossing = params.get("crossing");

  let destination: TripDestinationSelection | null = null;
  if (rawDest) {
    try {
      const parsed: unknown = JSON.parse(decodeURIComponent(rawDest));
      if (isValidDestination(parsed)) destination = parsed;
    } catch {
      destination = null;
    }
  }

  // Unknown ids stay in the request so the guard can reject with a reason.
  return { destination, crossingId: rawCrossing || null };
}

export function resolveCrossingCandidate(
  crossingId: string | null
): CrossingCandidate | null {
  if (!crossingId) return null;
  const crossing = BORDER_CROSSINGS.find((c) => c.id === crossingId);
  return crossing ? { id: crossing.id, name: crossing.name } : null;
}

export function checkHandoffCompatibility(
  request: HandoffRequest,
  activeTrip: ActiveTripContext | null
): HandoffVerdict {
  const candidate = resolveCrossingCandidate(request.crossingId);
  if (request.crossingId && !candidate) {
    return { compatible: false, reason: "unknown-crossing" };
  }
  if (
    request.destination &&
    activeTrip?.destinationId &&
    request.destination.id !== activeTrip.destinationId
  ) {
    return { compatible: false, reason: "active-trip-conflict" };
  }
  return { compatible: true, candidate };
}
