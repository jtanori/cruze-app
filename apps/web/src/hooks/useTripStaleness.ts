"use client";

import { useCallback, useEffect, useState } from "react";
import { useTripStore } from "@/stores/trip";
import { isTripStale } from "@/lib/trip-staleness";

/**
 * Owns trip-staleness state + visibility recheck so pages don't
 * implement freshness themselves. Auto-marks stale, never unmarks
 * (recovery is an explicit user action via onStillCurrent).
 */
export function useTripStaleness() {
  const { destination, completed, lastEvaluatedAt } = useTripStore();
  const [isStale, setIsStale] = useState(false);
  const [showStalePrompt, setShowStalePrompt] = useState(false);

  const checkStaleness = useCallback(() => {
    if (!destination || completed) return;
    if (isTripStale(lastEvaluatedAt)) {
      setIsStale(true);
      setShowStalePrompt(true);
    }
  }, [destination, completed, lastEvaluatedAt]);

  useEffect(() => {
    checkStaleness();
    const onVisibility = () => {
      if (document.visibilityState === "visible") checkStaleness();
    };
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, [checkStaleness]);

  const dismissStale = useCallback(() => {
    setIsStale(false);
    setShowStalePrompt(false);
  }, []);

  return { isStale, showStalePrompt, dismissStale };
}
