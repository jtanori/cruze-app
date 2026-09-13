"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { useLocationContext } from "@/components/location/LocationProvider";
import { useNearbyCrossings } from "@/hooks/useNearbyCrossings";
import { useTripStaleness } from "@/hooks/useTripStaleness";
import { useLiveCrossingSnapshot } from "@/hooks/useLiveCrossingSnapshot";
import { buildMapsUrl, buildSetupUrl, type TripDestinationSelection } from "@/lib/trip-navigation";
import { buildTripChecklistItems } from "@/lib/trip-checklist";
import { mapPlaceToDestination } from "@/lib/trip-destination";
import type { Place } from "@/types";
import { TripHero } from "@/components/trip/TripHero";
import { TripStalePrompt } from "@/components/trip/TripStalePrompt";
import { AvisoBanner } from "@/components/avisos/AvisoBanner";
import { TripStatusHeader } from "@/components/trip/TripStatusHeader";
import { TripRouteSummary } from "@/components/trip/TripRouteSummary";
import { TripActionBar } from "@/components/trip/TripActionBar";
import { TripChecklistSection } from "@/components/trip/TripChecklistSection";
import { TripNearbyCrossingsSection } from "@/components/trip/TripNearbyCrossingsSection";
import { TripNearbyCrossingRow } from "@/components/trip/TripNearbyCrossingRow";
import { DestinationSearch } from "@/components/trip/DestinationSearch";
import { LocationStatusBanner } from "@/components/location/LocationStatusBanner";

import { getDisplayName } from "@/lib/display";

export default function TripPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const { start, destination, completed, refreshActivity, reset, recommendedCrossing, direction } = useTripStore();
  const { location } = useLocationContext();
  const { crossings: nearbyCrossings, loading: loadingNearby, empty: emptyNearby } = useNearbyCrossings(location);
  const { isStale, showStalePrompt, dismissStale } = useTripStaleness();
  const { snapshot: liveSnapshot, previousSnapshot: livePreviousSnapshot } = useLiveCrossingSnapshot(
    recommendedCrossing?.crossingId ?? null,
    direction,
    recommendedCrossing?.totalJourneyTime ?? 0
  );
  const [selectedDestination, setSelectedDestination] = useState<TripDestinationSelection | null>(null);
  const hasTrip = start !== null && destination !== null;

  useEffect(() => { if (destination && !completed) refreshActivity(); }, [destination, completed, refreshActivity]);

  const handleStillCurrent = () => { refreshActivity(); dismissStale(); };
  const handleStartNew = () => { reset(); router.push(`/${locale}/trip/setup`); };
  const handleViewCrossing = () => { if (recommendedCrossing) router.push(`/${locale}/crossing/${recommendedCrossing.crossingId}`); };
  const handleNavigate = () => {
    if (recommendedCrossing) window.open(buildMapsUrl(recommendedCrossing.coordinates.lat, recommendedCrossing.coordinates.lng), "_blank");
  };

  const handleDestinationSelect = (place: Place) => {
    setSelectedDestination(mapPlaceToDestination(place));
  };

  const handleSearchNext = () => {
    if (selectedDestination) {
      router.push(buildSetupUrl(locale, selectedDestination));
    }
  };

  // Hero body follows the resolved *target* country (opposite side);
  // UNKNOWN → generic copy that promises nothing.
  const heroBody = (() => {
    if (location?.country === "MX") {
      return t("trip.empty.body", { country: t("common.unitedStatesShort") });
    }
    if (location?.country === "US") {
      return t("trip.empty.body", { country: t("common.mexicoShort") });
    }
    return t("trip.empty.bodyGeneric");
  })();

  return (
    <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6">
      {/* T01 Empty — W5 §8 TR-EMPTY-01 + §16 TR-NEAR-01 — mobile-first, 16/24/32 spacing */}
      {!hasTrip && (
        <div>
          {/* Upper section: location status + hero + destination search */}
          <section className="space-y-6 sm:space-y-8 mb-6">
            {/* LOC-STATUS-01 non-dismissible at top per W5 §7 */}
            {location && (
              <LocationStatusBanner
                placeName={location.placeName || `${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`}
                dismissible={false}
              />
            )}

            {/* W5 §8: hero + body — Sora / Inter tokens, body follows resolved target country */}
            <TripHero title={t("trip.empty.title")} body={heroBody} />

            {/* TR-EMPTY-01 DestinationSearch — Surface Elevated, 56px touch, CTA Mint */}
            <DestinationSearch
              userLat={location?.lat || 0}
              userLng={location?.lng || 0}
              userCountry={location?.country}
              onSelect={handleDestinationSelect}
              onNext={handleSearchNext}
            />
          </section>

          {/* Divider between plan (hero + search) and nearby intelligence — canon #1F3A54 1px */}
          <div aria-hidden="true" className="border-t border-border" />

          {/* TR-NEAR-01 — max 2-3, not duplicate of Cruces */}
          <div className="mt-7">
            <TripNearbyCrossingsSection
              onViewAll={() => router.push(`/${locale}/crossings`)}
            loading={loadingNearby}
            empty={emptyNearby}
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
        </div>
      )}

      {/* T08 Active Trip — W5 §27-30 */}
      {hasTrip && destination && start && (
        <div className="space-y-6">
          {showStalePrompt && isStale && (
            <TripStalePrompt
              title={t("trip.stale.title")}
              description={t("trip.stale.description")}
              stillCurrentLabel={t("trip.stale.stillCurrent")}
              startNewLabel={t("trip.stale.startNew")}
              onStillCurrent={handleStillCurrent}
              onStartNew={handleStartNew}
            />
          )}

          <AvisoBanner />

          <TripStatusHeader
            originLabel={getDisplayName(start)}
            destinationLabel={getDisplayName(destination)}
            status={isStale && showStalePrompt ? "stale" : "active"}
            crossingStatus={liveSnapshot?.status ?? recommendedCrossing?.status ?? "unknown"}
            lastUpdated={liveSnapshot?.generatedAt ?? recommendedCrossing?.generatedAt ?? null}
          />
          {recommendedCrossing && (
            <TripRouteSummary crossingName={recommendedCrossing.crossingName} waitTime={recommendedCrossing.waitTime} totalTime={recommendedCrossing.totalJourneyTime} />
          )}
          <TripActionBar onNavigate={handleNavigate} onViewCrossing={handleViewCrossing} onCompare={() => router.push(`/${locale}/crossings`)} onConfigure={() => router.push(`/${locale}/trip/setup`)} onComplete={() => router.push(`/${locale}/trip/completion`)} />
          <TripChecklistSection
            title={t("trip.checklist.title")}
            items={buildTripChecklistItems({
              liveSnapshot,
              recommendedCrossing,
              t: (key: string, values?: Record<string, any>) => t(key as any, values as any),
            })}
          />
        </div>
      )}
    </div>
  );
}
