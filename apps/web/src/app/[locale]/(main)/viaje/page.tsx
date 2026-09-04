"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { TripStatusHeader } from "@/components/trip/TripStatusHeader";
import { TripRouteSummary } from "@/components/trip/TripRouteSummary";
import { TripActionBar } from "@/components/trip/TripActionBar";
import { TripChecklistSection } from "@/components/trip/TripChecklistSection";
import { getDisplayName } from "@/lib/display";
import { AlertTriangle } from "lucide-react";

const STALENESS_THRESHOLD_MS = 12 * 60 * 60 * 1000;

export default function ViajePage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { start, destination, completed, lastEvaluatedAt, refreshActivity, reset, recommendedCrossing } = useTripStore();
  const [isStale, setIsStale] = useState(false);
  const [showStalePrompt, setShowStalePrompt] = useState(false);
  const [ready, setReady] = useState(false);
  const hasTrip = start !== null && destination !== null;

  useEffect(() => {
    if (!hasTrip) router.push(`/${locale}/viaje/configure`);
    else setReady(true);
  }, [hasTrip, router, locale]);

  const checkStaleness = useCallback(() => {
    if (!destination || completed || !lastEvaluatedAt) return;
    const elapsed = Date.now() - new Date(lastEvaluatedAt).getTime();
    if (elapsed > STALENESS_THRESHOLD_MS) { setIsStale(true); setShowStalePrompt(true); }
  }, [destination, completed, lastEvaluatedAt]);

  useEffect(() => {
    checkStaleness();
    const h = () => { if (document.visibilityState === "visible") checkStaleness(); };
    document.addEventListener("visibilitychange", h);
    return () => document.removeEventListener("visibilitychange", h);
  }, [checkStaleness]);

  useEffect(() => { if (destination && !completed) refreshActivity(); }, [destination, completed, refreshActivity]);

  const handleStillCurrent = () => { refreshActivity(); setIsStale(false); setShowStalePrompt(false); };
  const handleStartNew = () => { reset(); router.push(`/${locale}/trip/setup`); };
  const handleViewCrossing = () => { if (recommendedCrossing) router.push(`/${locale}/crossing/${recommendedCrossing.crossingId}`); };
  const handleNavigate = () => {
    if (recommendedCrossing) window.open(`https://www.google.com/maps/dir/?api=1&destination=${recommendedCrossing.coordinates.lat},${recommendedCrossing.coordinates.lng}`, "_blank");
  };

  if (!ready) return null;

  return (
    <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6">
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
            <button onClick={handleStillCurrent} className="flex-1 h-9 bg-cruze-mint text-midnight text-sm font-medium rounded-[var(--radius-md)]">{t("viaje.stale.stillCurrent")}</button>
            <button onClick={handleStartNew} className="flex-1 h-9 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)]">{t("viaje.stale.startNew")}</button>
          </div>
        </div>
      )}

      {hasTrip && destination && start && (
        <>
          <TripStatusHeader originLabel={getDisplayName(start)} destinationLabel={getDisplayName(destination)} />
          {recommendedCrossing && (
            <TripRouteSummary crossingName={recommendedCrossing.crossingName} waitTime={recommendedCrossing.waitTime} totalTime={recommendedCrossing.totalJourneyTime} />
          )}
          <TripActionBar onNavigate={handleNavigate} onViewCrossing={handleViewCrossing} onCompare={() => router.push(`/${locale}/crossings`)} onConfigure={() => router.push(`/${locale}/trip/setup`)} onComplete={() => router.push(`/${locale}/trip/completion`)} />
          <TripChecklistSection
            items={[
              { id: "operational", label: "Cruce abierto", status: "checked" },
              { id: "freshness", label: "Datos recientes", status: "checked", detail: recommendedCrossing ? `Actualizado hace ${Math.floor((Date.now() - new Date(recommendedCrossing.generatedAt).getTime())/60000)} min` : undefined },
              { id: "docs", label: "Revisar documentación", status: "unchecked" },
              { id: "restrictions", label: "Revisar restricciones", status: "unchecked" },
            ]}
          />
        </>
      )}
    </div>
  );
}
