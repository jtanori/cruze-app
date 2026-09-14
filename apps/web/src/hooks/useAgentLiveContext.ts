/**
 * AGENT-01 — React hook for agent live context.
 *
 * Wraps getAgentContext() with React state for component rendering.
 * Re-evaluates when trip, live crossing, or avisos state changes.
 */

"use client";

import { useMemo } from "react";
import { useTripStore } from "../stores/trip";
import { useLiveCrossingStore } from "../stores/live-crossing";
import { useAvisosStore } from "../stores/avisos";
import { getAgentContext, type AgentLiveContext } from "../lib/agent-context";

export function useAgentLiveContext(): AgentLiveContext {
  // Subscribe to store changes for reactivity
  const start = useTripStore((s) => s.start);
  const destination = useTripStore((s) => s.destination);
  const direction = useTripStore((s) => s.direction);
  const travelMode = useTripStore((s) => s.travelMode);
  const recommendedCrossing = useTripStore((s) => s.recommendedCrossing);

  const snapshot = useLiveCrossingStore((s) => s.snapshot);

  const avisos = useAvisosStore((s) => s.avisos);

  // Re-compute context when any dependency changes
  const context = useMemo(() => getAgentContext(), [
    start,
    destination,
    direction,
    travelMode,
    recommendedCrossing,
    snapshot,
    avisos,
  ]);

  return context;
}
