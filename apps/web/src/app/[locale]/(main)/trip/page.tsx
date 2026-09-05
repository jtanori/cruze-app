"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { useLocationContext } from "@/components/location/LocationProvider";
import { TripStatusHeader } from "@/components/trip/TripStatusHeader";
import { TripRouteSummary } from "@/components/trip/TripRouteSummary";
import { TripActionBar } from "@/components/trip/TripActionBar";
import { TripChecklistSection } from "@/components/trip/TripChecklistSection";
import { TripNearbyCrossingsSection } from "@/components/trip/TripNearbyCrossingsSection";
import { TripNearbyCrossingRow } from "@/components/trip/TripNearbyCrossingRow";
import { DestinationSearch } from "@/components/trip/DestinationSearch";
import { LocationStatusBanner } from "@/components/location/LocationStatusBanner";
import { getDisplayName } from "@/lib/display";
import { AlertTriangle } from "lucide-react";

const TRIP_STALENESS_THRESHOLD_MS = 12 * 60 * 60 * 1000;

interface NearbyCrossing {
  id: string;
  name: string;
  waitTime: number;
  direction: "MX_TO_US" | "US_TO_MX";
  status: "open" | "closed" | "limited";
  lastUpdated: number;
}

interface SelectedDestination {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: "MX" | "US";
}

export default function TripPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { start, destination, completed, lastEvaluatedAt, refreshActivity, reset, recommendedCrossing } = useTripStore();
  const { location } = useLocationContext();
  const [isStale, setIsStale] = useState(false);
  const [showStalePrompt, setShowStalePrompt] = useState(false);
  const [ready, setReady] = useState(false);
  const [nearbyCrossings, setNearbyCrossings] = useState<NearbyCrossing[]>([]);
  const [loadingNearby, setLoadingNearby] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<SelectedDestination | null>(null);
  const hasTrip = start !== null && destination !== null;

  useEffect(() => {
    if (!hasTrip) {
      if (location) fetchNearbyCrossings();
      setReady(true);
    } else {
      setReady(true);
    }
  }, [hasTrip, location]);

  const fetchNearbyCrossings = async () => {
    if (!location) return;
    setLoadingNearby(true);
    try {
      const response = await fetch(`/api/crossings?lat=${location.lat}&lng=${location.lng}&limit=3&direction=MX_TO_US`);
      if (response.ok) {
        const data = await response.json();
        if (data.crossings && Array.isArray(data.crossings)) {
          setNearbyCrossings(data.crossings.slice(0, 3).map((c: any) => ({
            id: c.id,
            name: c.name,
            waitTime: c.waitTime ?? c.dominantWaitMinutes ?? 0,
            direction: (String(c.direction || "MX_TO_US").toUpperCase() as "MX_TO_US" | "US_TO_MX"),
            status: String(c.status || "open").toLowerCase() as "open" | "closed" | "limited",
            lastUpdated: c.lastUpdated ? new Date(c.lastUpdated).getTime() : Date.now(),
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
    if (elapsed > TRIP_STALENESS_THRESHOLD_MS) { setIsStale(true); setShowStalePrompt(true); }
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

  const handleDestinationSelect = (place: any) => {
    setSelectedDestination({
      id: place.id,
      name: place.name,
      lat: place.latitude,
      lng: place.longitude,
      country: place.country,
    });
  };

  const handleSearchNext = () => {
    if (selectedDestination) {
      router.push(`/${locale}/trip/setup?dest=${encodeURIComponent(JSON.stringify(selectedDestination))}`);
    }
  };

  if (!ready) return null;

  return (
    <div className="px-5 py-6 space-y-6">
      {/* T01 Empty — W5 §8 TR-EMPTY-01 + §16 TR-NEAR-01 — mobile-first, 16/24/32 spacing */}
      {!hasTrip && (
        <div className="space-y-6">
          {/* LOC-STATUS-01 non-dismissible at top per W5 §7 */}
          {location && (
            <LocationStatusBanner
              placeName={location.placeName || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
              dismissible={false}
            />
          )}

          {/* W5 §8: TU VIAJE eyebrow + hero + body — Sora / Inter tokens */}
          <div className="space-y-3">
            <p className="font-display font-bold text-sm tracking-widest uppercase text-cruze-mint">
              {t("trip.yourTrip")}
            </p>
            <h1 className="font-display font-bold text-[32px] leading-tight text-ink">
              {t("trip.empty.title")}
            </h1>
            <p className="font-sans text-[17px] leading-relaxed text-faint">
              {t("trip.empty.body")}
            </p>
          </div>

          {/* TR-EMPTY-01 DestinationSearch — Surface Elevated, 56px touch, CTA Mint */}
          <div className="space-y-3">
            <DestinationSearch
              userLat={location?.lat || 0}
              userLng={location?.lng || 0}
              onSelect={handleDestinationSelect}
              onNext={handleSearchNext}
              className="space-y-3"
            />
            {!selectedDestination && (
              <p className="text-center font-sans text-xs text-muted">
                {t("trip.empty.selectToContinue")}
              </p>
            )}
          </div>

          {/* TR-NEAR-01 — max 2-3, not duplicate of Cruces */}
          <TripNearbyCrossingsSection
            onViewAll={() => router.push(`/${locale}/crossings`)}
            loading={loadingNearby}
            empty={!loadingNearby && nearbyCrossings.length === 0}
            emptyMessage={t("trip.empty.noNearby")}
            showViewAllAtBottom={true}
          >
            {nearbyCrossings.map((crossing) => (
              <TripNearbyCrossingRow
                key={crossing.id}
                name={crossing.name}
                waitTime={crossing.waitTime}
                direction={crossing.direction}
                status={crossing.status}
                lastUpdated={crossing.lastUpdated}
                onClick={() => router.push(`/${locale}/crossing/${crossing.id}`)}
              />
            ))}
          </TripNearbyCrossingsSection>
        </div>
      )}

      {/* T08 Active Trip — W5 §27-30 */}
      {hasTrip && destination && start && (
        <div className="space-y-6">
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
            title={t("trip.checklist.title")}
            items={[
              { id: "operational", label: t("trip.checklist.operational"), status: "checked" },
              { id: "freshness", label: t("trip.checklist.freshness"), status: "checked", detail: recommendedCrossing ? t("trip.checklist.freshnessDetail", { minutes: Math.floor((Date.now() - new Date(recommendedCrossing.generatedAt).getTime())/60000) }) : undefined },
              { id: "docs", label: t("trip.checklist.docs"), status: "unchecked" },
              { id: "restrictions", label: t("trip.checklist.restrictions"), status: "unchecked" },
            ]}
          />
        </div>
      )}
    </div>
  );
}
