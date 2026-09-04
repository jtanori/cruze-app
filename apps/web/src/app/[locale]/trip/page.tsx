"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { useLocationStore } from "@/stores/location";
import { TripStatusHeader } from "@/components/trip/TripStatusHeader";
import { TripRouteSummary } from "@/components/trip/TripRouteSummary";
import { TripActionBar } from "@/components/trip/TripActionBar";
import { TripChecklistSection } from "@/components/trip/TripChecklistSection";
import { getDisplayName } from "@/lib/display";
import { AlertTriangle, MapPin } from "lucide-react";

const STALENESS_THRESHOLD_MS = 12 * 60 * 60 * 1000;

interface NearbyCrossing {
  id: string;
  name: string;
  waitTime: number;
  direction: "MX_TO_US" | "US_TO_MX";
}

export default function TripPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { start, destination, completed, lastEvaluatedAt, refreshActivity, reset, recommendedCrossing } = useTripStore();
  const { location } = useLocationStore();
  const [isStale, setIsStale] = useState(false);
  const [showStalePrompt, setShowStalePrompt] = useState(false);
  const [ready, setReady] = useState(false);
  const [nearbyCrossings, setNearbyCrossings] = useState<NearbyCrossing[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const hasTrip = start !== null && destination !== null;

  useEffect(() => {
    console.log("[Cruze:Trip] hasTrip:", hasTrip, "start:", start?.name, "dest:", destination?.name);
    if (!hasTrip) {
      console.log("[Cruze:Trip] No trip → showing empty state (T01)");
      // Fetch nearby crossings if we have location
      if (location) {
        fetchNearbyCrossings();
      }
      setReady(true);
    } else {
      console.log("[Cruze:Trip] Trip found → rendering dashboard");
      setReady(true);
    }
  }, [hasTrip, location]);

  const fetchNearbyCrossings = async () => {
    if (!location) return;
    setLoadingNearby(true);
    try {
      // Use the crossings API with user's location
      const response = await fetch(`/${locale}/api/crossings?lat=${location.lat}&lng=${location.lng}&limit=3`);
      if (response.ok) {
        const data = await response.json();
        if (data.crossings && Array.isArray(data.crossings)) {
          setNearbyCrossings(data.crossings.slice(0, 3).map((c: any) => ({
            id: c.id,
            name: c.name,
            waitTime: c.waitTime || 0,
            direction: c.direction,
          })));
        }
      }
    } catch (err) {
      console.warn("[Cruze:Trip] Failed to fetch nearby crossings:", err);
    } finally {
      setLoadingNearby(false);
    }
  };

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
      {/* Empty State (T01) - No active trip */}
      {!hasTrip && (
        <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-ink text-xl font-bold">{t("trip.empty.title")}</h1>
            <p className="text-muted text-sm">{t("trip.empty.subtitle")}</p>
          </div>

          {/* Primary CTA */}
          <button
            onClick={handleStartNew}
            className="w-full h-[48px] flex items-center justify-center gap-2 bg-cruze-mint text-midnight font-semibold text-sm rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
          >
            <MapPin className="w-4 h-4" />
            {t("trip.empty.startTrip")}
          </button>

          {/* Nearby Crossings */}
          <section className="space-y-3">
            <div className="flex items-center justify-between">
              <h2 className="text-ink font-semibold text-sm uppercase tracking-wider">{t("trip.empty.nearby")}</h2>
              <button
                onClick={() => router.push(`/${locale}/crossings`)}
                className="text-cruze-mint text-sm font-medium hover:underline"
              >
                {t("trip.empty.viewAll")}
              </button>
            </div>

            {loadingNearby ? (
              <div className="space-y-2" role="status" aria-label="Loading nearby crossings">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-16 bg-surface-elevated rounded-[var(--radius-md)] animate-pulse" />
                ))}
              </div>
            ) : nearbyCrossings.length > 0 ? (
              <div className="space-y-2">
                {nearbyCrossings.map((crossing) => (
                  <button
                    key={crossing.id}
                    onClick={() => router.push(`/${locale}/crossing/${crossing.id}`)}
                    className="w-full flex items-center justify-between p-3 bg-surface border border-border rounded-[var(--radius-md)] hover:bg-surface-elevated transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-cruze-green" />
                      <div>
                        <p className="text-ink text-sm font-medium">{crossing.name}</p>
                        <p className="text-faint text-xs">
                          {crossing.direction === "MX_TO_US" ? t("common.northbound") : t("common.southbound")}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-ink text-lg font-bold">{crossing.waitTime} min</p>
                      <p className="text-faint text-xs">{t("common.waitTime")}</p>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-6">
                <MapPin className="w-8 h-8 text-faint mx-auto mb-2" />
                <p className="text-muted text-sm">{t("trip.empty.noNearby")}</p>
              </div>
            )}
          </section>
        </div>
      )}

      {/* Active Trip Dashboard */}
      {hasTrip && destination && start && (
        <>
          {showStalePrompt && isStale && (
            <div className="bg-caution/10 border border-caution/30 rounded-[var(--radius-lg)] p-4 space-y-3">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <p className="text-ink text-sm font-medium">{t("trip.stale.title")}</p>
                  <p className="text-faint text-xs">{t("trip.stale.description")}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <button onClick={handleStillCurrent} className="flex-1 h-9 bg-cruze-mint text-midnight text-sm font-medium rounded-[var(--radius-md)]">{t("trip.stale.stillCurrent")}</button>
                <button onClick={handleStartNew} className="flex-1 h-9 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)]">{t("trip.stale.startNew")}</button>
              </div>
            </div>
          )}

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