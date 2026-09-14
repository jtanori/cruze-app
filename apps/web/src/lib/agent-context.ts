/**
 * AGENT-01 — Agent live context aggregation.
 *
 * Non-React function that reads from stores directly.
 * Used by agent-templates for response generation.
 */

import { useTripStore } from "../stores/trip";
import { useLiveCrossingStore } from "../stores/live-crossing";
import { useAvisosStore } from "../stores/avisos";
import type { CrossingFreshness } from "./live-crossing/types";
import type { Aviso } from "./avisos";

export interface AgentLiveContext {
  // Trip identity
  origin: string | null;
  destination: string | null;
  direction: string | null;
  travelMode: string | null;

  // Selected crossing
  selectedCrossingId: string | null;
  selectedCrossingName: string | null;

  // Live crossing intelligence
  crossingStatus: "open" | "limited" | "closed" | null;
  crossingWaitTime: number | null;
  crossingFreshness: CrossingFreshness | null;

  // Avisos
  unreadAvisoCount: number;
  latestAviso: Aviso | null;

  // Computed
  hasActiveTrip: boolean;
  hasLiveCrossingData: boolean;
}

/**
 * Get the current agent live context from stores.
 * Called per processMessage() — not cached.
 */
export function getAgentContext(): AgentLiveContext {
  const trip = useTripStore.getState();
  const live = useLiveCrossingStore.getState();
  const avisos = useAvisosStore.getState();

  const snapshot = live.snapshot;
  const activeAvisos = avisos.activeAvisos();

  return {
    origin: trip.start?.name ?? null,
    destination: trip.destination?.name ?? null,
    direction: trip.direction ?? null,
    travelMode: trip.travelMode ?? null,

    selectedCrossingId: trip.recommendedCrossing?.crossingId ?? null,
    selectedCrossingName: trip.recommendedCrossing?.crossingName ?? null,

    crossingStatus: snapshot?.status ?? null,
    crossingWaitTime: snapshot?.waitTime ?? null,
    crossingFreshness: snapshot?.freshness ?? null,

    unreadAvisoCount: avisos.unreadCount(),
    latestAviso: activeAvisos[0] ?? null,

    hasActiveTrip: trip.start !== null && trip.destination !== null,
    hasLiveCrossingData: snapshot !== null,
  };
}
