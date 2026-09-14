/**
 * AV-01 — Hook for consuming Avisos.
 *
 * Bridges useLiveCrossingSnapshot changes into the AvisosStore.
 * Provides aviso state and actions to UI components.
 *
 * All parameters have defaults for standalone usage (e.g., AvisoBanner).
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { useLiveCrossingSnapshot } from "./useLiveCrossingSnapshot";
import { useAvisosStore } from "../stores/avisos";
import { mapCrossingChangeToAviso } from "../lib/aviso-mapping";
import type { TripDirection } from "../types";
import type { Aviso } from "../lib/avisos";

interface UseAvisosResult {
  unreadCount: number;
  activeAvisos: Aviso[];
  markRead: (id: string) => void;
  markAllRead: () => void;
  dismiss: (id: string) => void;
  refresh: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

interface UseAvisosParams {
  crossingId?: string | null;
  direction?: TripDirection | null;
  totalJourneyTime?: number;
}

export function useAvisos(
  crossingId: string | null = null,
  direction: TripDirection | null = null,
  totalJourneyTime: number = 0
): UseAvisosResult {
  const { changes, refresh, isLoading, error } = useLiveCrossingSnapshot(
    crossingId,
    direction,
    totalJourneyTime
  );

  const { addAvisos } = useAvisosStore.getState();

  const changesRef = useRef<string>("");
  const storeState = useAvisosStore.getState();

  // Convert crossing changes to avisos
  useEffect(() => {
    if (changes.length === 0) return;

    // Deduplicate by change signature
    const signature = changes
      .map((c) => `${c.crossingId}:${c.type}:${c.currentWait}`)
      .join("|");

    if (signature === changesRef.current) return;
    changesRef.current = signature;

    const newAvisos = changes.map(mapCrossingChangeToAviso);
    addAvisos(newAvisos);
  }, [changes, addAvisos]);

  // Visibility change
  useEffect(() => {
    if (!crossingId) return;

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        // Refresh live data on window focus
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [crossingId]);

  // Clear on crossing change
  useEffect(() => {
    if (!crossingId) {
      // Use store ref to reset
      const { reset } = useAvisosStore.getState();
      reset();
    }
  }, [crossingId]);

  return {
    unreadCount: useAvisosStore.getState().unreadCount(),
    activeAvisos: useAvisosStore.getState().activeAvisos(),
    markRead: useAvisosStore.getState().markRead,
    markAllRead: useAvisosStore.getState().markAllRead,
    dismiss: useAvisosStore.getState().dismiss,
    refresh,
    isLoading,
    error,
  };
}