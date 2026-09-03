"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { TripSummary } from "@/components/viaje/TripSummary";
import { useTripStore } from "@/stores/trip";
import { AlertTriangle } from "lucide-react";

const STALENESS_THRESHOLD_MS = 12 * 60 * 60 * 1000; // 12 hours

export default function ViajePage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const { start, destination, completed, lastEvaluatedAt, refreshActivity, reset } = useTripStore();

  const [isStale, setIsStale] = useState(false);
  const [showStalePrompt, setShowStalePrompt] = useState(false);
  const [ready, setReady] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // A trip exists if we have both start and destination (regardless of completed flag)
  // The completed flag might not be set if user refreshed or came from SSR
  const hasTrip = start !== null && destination !== null;

  // Wait for store hydration
  useEffect(() => {
    setHydrated(true);
  }, []);

  // Redirect to configure if no trip (must be in useEffect to avoid render-time setState)
  useEffect(() => {
    if (!hasTrip) {
      router.push(`/${locale}/viaje/configure`);
    } else {
      setReady(true);
    }
  }, [hasTrip, router, locale]);

  const checkStaleness = useCallback(() => {
    if (!destination || completed || !lastEvaluatedAt) return;

    const elapsed = Date.now() - new Date(lastEvaluatedAt).getTime();
    if (elapsed > STALENESS_THRESHOLD_MS) {
      setIsStale(true);
      setShowStalePrompt(true);
    }
  }, [destination, completed, lastEvaluatedAt]);

  // Check staleness on mount and visibility change
  useEffect(() => {
    checkStaleness();

    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        checkStaleness();
      }
    };

    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [checkStaleness]);

  // Refresh activity on mount (user interacted by navigating here)
  useEffect(() => {
    if (destination && !completed) {
      refreshActivity();
    }
  }, [destination, completed, refreshActivity]);

  const handleStillCurrent = () => {
    refreshActivity();
    setIsStale(false);
    setShowStalePrompt(false);
  };

  const handleStartNew = () => {
    reset();
    router.push(`/${locale}/viaje/configure`);
  };

  const handleViewCrossing = () => {
    const rec = useTripStore.getState().recommendedCrossing;
    if (rec) {
      router.push(`/${locale}/crossing/${rec.crossingId}`);
    }
  };

  const handleNavigate = () => {
    const rec = useTripStore.getState().recommendedCrossing;
    if (rec) {
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${rec.coordinates.lat},${rec.coordinates.lng}`,
        "_blank"
      );
    }
  };

  if (!ready) return null;

  return (
    <div className="px-5 py-6 space-y-6">
      {/* Staleness Prompt */}
      {showStalePrompt && isStale && (
        <div className="bg-caution/10 border border-caution/30 rounded-[var(--radius-lg)] p-4 space-y-3">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
            <div className="space-y-1">
              <p className="text-ink text-sm font-medium">{t("viaje.stale.title")}</p>
              <p className="text-faint text-xs">{t("viaje.stale.description")}</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleStillCurrent}
              className="flex-1 h-9 flex items-center justify-center bg-cruze-green text-dark text-sm font-medium rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
            >
              {t("viaje.stale.stillCurrent")}
            </button>
            <button
              onClick={handleStartNew}
              className="flex-1 h-9 flex items-center justify-center bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
            >
              {t("viaje.stale.startNew")}
            </button>
          </div>
        </div>
      )}

      {/* Trip Summary */}
      <TripSummary
        onStartNew={handleStartNew}
        onEdit={() => router.push(`/${locale}/viaje/configure`)}
        onNavigate={handleNavigate}
        onViewCrossing={handleViewCrossing}
        onEndTrip={handleStartNew}
      />
    </div>
  );
}