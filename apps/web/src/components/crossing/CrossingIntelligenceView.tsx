"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { ArrowLeft, Bookmark, BookmarkCheck, Share2 } from "lucide-react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import { Clock, TrendingUp, CheckCircle2, ArrowRight, MapPin, Car, User, Truck, CircleAlert, ChevronDown, Info } from "lucide-react";
import { useTranslations } from "next-intl";
import { getDisplayName, formatDuration } from "@/lib/display";
import { useFavoritesStore } from "@/stores/favorites";
import { useTravelerStore } from "@/stores/traveler";
import { BORDER_CROSSINGS } from "@/lib/border-data";
import { getMergedCrossingsData, type MergedCrossingData } from "@/lib/border-data-service";
import { CrossingDetailsModal } from "./CrossingDetailsModal";
import { BottomNavigation } from "@/components/layout/BottomNavigation";
import type { Place, CrossingRecommendation, BottomNavDestination, TravelerProfile, CrossingMode } from "@/types";

interface CrossingIntelligenceViewProps {
  recommendation: CrossingRecommendation | null;
  origin: Place | null;
  destination: Place | null;
  hasJourneyContext: boolean;
  onBack: () => void;
  crossingName?: string;
}

// Lane eligibility logic based on traveler profile
function getLaneEligibility(
  laneName: string,
  profile: TravelerProfile | null
): { eligible: boolean; preferred: boolean; reason?: string } {
  if (!profile) return { eligible: true, preferred: false };

  const lane = laneName.toLowerCase();
  const isPedestrian = lane.includes("pedestrian") || lane.includes("peatonal");
  const isSENTRI = lane.includes("sentri");
  const isReadyLane = lane.includes("ready");
  const isCommercial = lane.includes("commercial") || lane.includes("camiones");
  const isStandard = lane.includes("standard") || lane.includes("general");

  // Walking mode
  if (profile.crossingMode === "walking") {
    if (isPedestrian) return { eligible: true, preferred: true };
    if (isStandard) return { eligible: true, preferred: false };
    if (isSENTRI && profile.trustedTraveler === "sentri") return { eligible: true, preferred: false };
    if (isCommercial) return { eligible: false, preferred: false, reason: "crossing.notEligible.commercialOnly" };
    return { eligible: false, preferred: false, reason: "crossing.notEligible.pedestrianOnly" };
  }

  // Commercial vehicle mode
  if (profile.crossingMode === "commercial_vehicle") {
    if (isCommercial) return { eligible: true, preferred: true };
    if (isStandard) return { eligible: true, preferred: false };
    return { eligible: false, preferred: false, reason: "crossing.notEligible.commercialLaneRequired" };
  }

  // Personal vehicle or public transport
  if (isPedestrian) return { eligible: false, preferred: false, reason: "crossing.notEligible.notPedestrian" };
  if (isCommercial) return { eligible: false, preferred: false, reason: "crossing.notEligible.notCommercial" };

  // SENTRI eligibility
  if (isSENTRI) {
    if (profile.trustedTraveler === "sentri") return { eligible: true, preferred: true };
    return { eligible: false, preferred: false, reason: "crossing.notEligible.requiresSentri" };
  }

  // Ready Lane eligibility (requires RFID-enabled document)
  if (isReadyLane) {
    if (profile.accessType === "readyLane") {
      return { eligible: true, preferred: false };
    }
    return { eligible: true, preferred: false };
  }

  // Standard lane - always eligible
  return { eligible: true, preferred: false };
}

export function CrossingIntelligenceView({
  recommendation,
  origin,
  destination,
  hasJourneyContext,
  onBack,
  crossingName,
}: CrossingIntelligenceViewProps) {
  const t = useTranslations();
  const locale = useLocale();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [showAllLanes, setShowAllLanes] = useState(false);
  const [selectedLane, setSelectedLane] = useState<string | null>(null);
  const [otherCrossings, setOtherCrossings] = useState<MergedCrossingData[]>([]);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const { addFavorite, removeFavorite, isFavorite } = useFavoritesStore();
  const { profile: travelerProfile } = useTravelerStore();

  // Use crossing name from props if no recommendation
  const displayName = recommendation?.crossingName || crossingName || "Crossing";
  const isFavorited = recommendation ? isFavorite(recommendation.crossingId) : false;

  // Get the selected lane's wait time, or default to first lane
  const activeLane = selectedLane
    ? recommendation?.lanes.find((l) => l.name === selectedLane)
    : recommendation?.lanes[0];
  const activeWaitTime = activeLane?.waitTime || recommendation?.waitTime || 0;

  // Fetch other crossings in the same corridor
  useEffect(() => {
    if (!recommendation) return;

    const fetchOtherCrossings = async () => {
      const currentCrossing = BORDER_CROSSINGS.find((c) => c.id === recommendation.crossingId);
      if (!currentCrossing) return;

      // Find other crossings in the same corridor
      const sameCorridorCrossings = BORDER_CROSSINGS.filter(
        (c) => c.corridor === currentCrossing.corridor && c.id !== currentCrossing.id
      );

      // Also find nearby crossings in adjacent corridors (within ~50km)
      const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // Earth's radius in km
        const dLat = ((lat2 - lat1) * Math.PI) / 180;
        const dLng = ((lng2 - lng1) * Math.PI) / 180;
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos((lat1 * Math.PI) / 180) *
            Math.cos((lat2 * Math.PI) / 180) *
            Math.sin(dLng / 2) *
            Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
      };

      const nearbyCrossings = BORDER_CROSSINGS.filter(
        (c) =>
          c.id !== currentCrossing.id &&
          !sameCorridorCrossings.some((sc) => sc.id === c.id) &&
          calculateDistance(
            currentCrossing.coordinates.lat,
            currentCrossing.coordinates.lng,
            c.coordinates.lat,
            c.coordinates.lng
          ) < 50 // 50km radius
      );

      const allPotentialCrossings = [...sameCorridorCrossings, ...nearbyCrossings];

      if (allPotentialCrossings.length === 0) return;

      // Fetch live data for all crossings
      const allCrossings = await getMergedCrossingsData();

      // Filter to get only open crossings and sort by distance
      const openOtherCrossings = allCrossings
        .filter(
          (c) =>
            allPotentialCrossings.some((pc) => pc.id === c.id) &&
            c.statusNorthbound === "OPEN"
        )
        .sort((a, b) => {
          // Sort by distance from current crossing
          const distA = calculateDistance(
            currentCrossing.coordinates.lat,
            currentCrossing.coordinates.lng,
            a.coordinates.lat,
            a.coordinates.lng
          );
          const distB = calculateDistance(
            currentCrossing.coordinates.lat,
            currentCrossing.coordinates.lng,
            b.coordinates.lat,
            b.coordinates.lng
          );
          return distA - distB;
        });

      setOtherCrossings(openOtherCrossings);
    };

    fetchOtherCrossings();
  }, [recommendation]);

  const handleToggleFavorite = () => {
    if (!recommendation) return;
    if (isFavorited) {
      removeFavorite(recommendation.crossingId);
    } else {
      addFavorite(recommendation.crossingId);
    }
  };

  const handleShare = async () => {
    if (!recommendation) return;
    const shareData = {
      title: recommendation.crossingName,
      text: `Check wait times at ${recommendation.crossingName} (${recommendation.mexicanCity}, MX ↔ ${recommendation.usCity}, US)`,
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
      }
    } catch {
      // User cancelled or error
    }
  };

  useEffect(() => {
    if (!mapContainer.current || !recommendation) return;

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    // Calculate center point: middle of three points if journey context, else crossing gate
    let centerLng = recommendation.coordinates.lng;
    let centerLat = recommendation.coordinates.lat;
    
    if (hasJourneyContext && origin && destination) {
      // Calculate centroid of the three points
      centerLng = (origin.longitude + recommendation.coordinates.lng + destination.longitude) / 3;
      centerLat = (origin.latitude + recommendation.coordinates.lat + destination.latitude) / 3;
    }

    // Use higher zoom when no journey context to show crossing gate surroundings
    const initialZoom = hasJourneyContext ? 6 : 14;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [centerLng, centerLat],
      zoom: initialZoom,
      interactive: true,
      attributionControl: false,
    });

    const fetchRoute = async (
      start: [number, number],
      end: [number, number]
    ): Promise<[number, number][]> => {
      const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${start[0]},${start[1]};${end[0]},${end[1]}?geometries=geojson&access_token=${mapboxgl.accessToken}`;
      const response = await fetch(url);
      const data = await response.json();
      if (data.routes && data.routes.length > 0) {
        return data.routes[0].geometry.coordinates;
      }
      return [start, end];
    };

    const drawRoute = async () => {
      if (!map.current) return;

      let allCoords: [number, number][] = [];

      if (origin && destination) {
        // Fetch route from origin to crossing gate
        const routeToCrossing = await fetchRoute(
          [origin.longitude, origin.latitude],
          [recommendation.coordinates.lng, recommendation.coordinates.lat]
        );

        // Fetch route from crossing gate to destination
        const routeFromCrossing = await fetchRoute(
          [recommendation.coordinates.lng, recommendation.coordinates.lat],
          [destination.longitude, destination.latitude]
        );

        // Combine routes, avoiding duplicate point at crossing gate
        allCoords = [
          ...routeToCrossing,
          ...routeFromCrossing.slice(1),
        ];
      } else {
        allCoords = [[recommendation.coordinates.lng, recommendation.coordinates.lat]];
      }

      map.current.addSource("route", {
        type: "geojson",
        data: {
          type: "Feature",
          properties: {},
          geometry: {
            type: "LineString",
            coordinates: allCoords,
          },
        },
      });

      map.current.addLayer({
        id: "route-glow",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#43E0B0",
          "line-width": 6,
          "line-opacity": 0.25,
          "line-blur": 4,
        },
      });

      map.current.addLayer({
        id: "route-line",
        type: "line",
        source: "route",
        layout: { "line-join": "round", "line-cap": "round" },
        paint: {
          "line-color": "#43E0B0",
          "line-width": 3,
        },
      });

      // Fit bounds to show entire route including all three points
      if (origin && destination) {
        const bounds = new mapboxgl.LngLatBounds();
        bounds.extend([origin.longitude, origin.latitude]);
        bounds.extend([recommendation.coordinates.lng, recommendation.coordinates.lat]);
        bounds.extend([destination.longitude, destination.latitude]);
        map.current.fitBounds(bounds, { padding: 50, maxZoom: 12 });
      } else {
        // Center on crossing gate with appropriate zoom
        map.current.jumpTo({
          center: [recommendation.coordinates.lng, recommendation.coordinates.lat],
          zoom: 14,
        });
      }
    };

    map.current.on("load", () => {
      // Add markers with labels attached
      if (origin) {
        const originEl = document.createElement("div");
        originEl.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: flex-start;">
            <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(7, 26, 49, 0.85); backdrop-filter: blur(8px); border-radius: 9999px; border: 1px solid rgba(31, 58, 90, 0.5); white-space: nowrap;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #FFFFFF;"></div>
              <span style="color: #FFFFFF; font-size: 11px; font-weight: 500; font-family: Inter, sans-serif;">${getDisplayName(origin)}</span>
            </div>
            <svg style="margin-left: 12px;" viewBox="0 0 24 32" width="24" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#FFFFFF"/>
              <circle cx="12" cy="12" r="5" fill="#081830"/>
            </svg>
          </div>
        `;
        new mapboxgl.Marker({ element: originEl, anchor: "bottom-left" })
          .setLngLat([origin.longitude, origin.latitude])
          .addTo(map.current!);
      }

      if (destination) {
        const destEl = document.createElement("div");
        destEl.innerHTML = `
          <div style="position: relative; display: flex; flex-direction: column; align-items: flex-end;">
            <div style="display: flex; align-items: center; gap: 6px; padding: 4px 10px; background: rgba(7, 26, 49, 0.85); backdrop-filter: blur(8px); border-radius: 9999px; border: 1px solid rgba(31, 58, 90, 0.5); white-space: nowrap;">
              <div style="width: 8px; height: 8px; border-radius: 50%; background: #43D69A;"></div>
              <span style="color: #FFFFFF; font-size: 11px; font-weight: 500; font-family: Inter, sans-serif;">${getDisplayName(destination)}</span>
            </div>
            <svg style="margin-right: 12px;" viewBox="0 0 24 32" width="24" height="32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12 0C5.4 0 0 5.4 0 12c0 9 12 20 12 20s12-11 12-20C24 5.4 18.6 0 12 0z" fill="#43D69A"/>
              <circle cx="12" cy="12" r="5" fill="#081830"/>
            </svg>
          </div>
        `;
        new mapboxgl.Marker({ element: destEl, anchor: "bottom-right" })
          .setLngLat([destination.longitude, destination.latitude])
          .addTo(map.current!);
      }

      // Crossing gate marker
      const crossingEl = document.createElement("div");
      crossingEl.innerHTML = `
        <div style="position: relative; width: 28px; height: 28px;">
          <div style="position: absolute; inset: 0; border-radius: 50%; background: rgba(67, 214, 154, 0.4); animation: pulse 2s infinite;"></div>
          <div style="position: absolute; inset: 4px; border-radius: 50%; background: #43D69A; border: 2px solid #FFFFFF;"></div>
        </div>
        <style>
          @keyframes pulse {
            0%, 100% { transform: scale(1); opacity: 0.6; }
            50% { transform: scale(1.4); opacity: 0; }
          }
        </style>
      `;
      new mapboxgl.Marker({ element: crossingEl })
        .setLngLat([recommendation.coordinates.lng, recommendation.coordinates.lat])
        .addTo(map.current!);

      // Draw route asynchronously (don't block markers)
      drawRoute().catch(() => {
        // Route drawing failed, but markers are still visible
      });
    });

    return () => {
      map.current?.remove();
    };
  }, [origin, destination, recommendation, hasJourneyContext]);

  const getFreshnessLabel = (generatedAt: string) => {
    const diff = Date.now() - new Date(generatedAt).getTime();
    const mins = Math.floor(diff / 60000);
    return t("shared.updatedMinAgo", { minutes: mins });
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <header
        className="fixed top-0 left-0 right-0 z-[var(--z-header)] bg-background border-b border-border-subtle"
        style={{ height: "var(--nav-header-height)" }}
      >
        <div className="h-full flex items-center justify-between px-5">
          <div className="min-w-[44px] flex items-center justify-start">
            <button
              onClick={onBack}
              className="w-[44px] h-[44px] flex items-center justify-center -ml-2 rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
              aria-label={t("common.back")}
            >
              <ArrowLeft className="w-5 h-5 text-ink" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center gap-2">
            {recommendation ? (
              <>
                <div className="text-right">
                  <span className="text-ink font-semibold text-xs block">
                    {recommendation.mexicanCity}
                  </span>
                  <span className="text-faint text-xs block">
                    {recommendation.mexicanState}
                  </span>
                </div>
                <span className="text-faint text-xs">/</span>
                <div className="text-left">
                  <span className="text-ink font-semibold text-xs block">
                    {recommendation.usCity}
                  </span>
                  <span className="text-faint text-xs block">
                    {recommendation.usState}
                  </span>
                </div>
              </>
            ) : (
              <span className="text-ink font-semibold text-xs">
                {displayName}
              </span>
            )}
          </div>
          <div className="min-w-[44px] flex items-center justify-end">
            {recommendation && (
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-cruze-green" />
                <span className="text-cruze-green text-xs font-medium">Open</span>
              </div>
            )}
          </div>
        </div>
      </header>

      <main
        className="pt-[var(--nav-header-height)]"
        style={{
          paddingBottom: "calc(var(--nav-bottom-height) + env(safe-area-inset-bottom) + 24px)",
        }}
        >
          {/* Map */}
        <div className="relative">
          <div
            ref={mapContainer}
            className="w-full h-[300px] bg-surface"
          />
        </div>

        {/* Best Crossing Section */}
        {recommendation && (
          <div className="px-5 space-y-4 -mt-[50px] relative z-10">
            {hasJourneyContext && (
              <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
                {t("onboarding.recommendation.bestCrossingNow")}
              </h2>
            )}

            {/* Crossing Card */}
            <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-ink text-2xl font-bold">
                    {recommendation.crossingName}
                  </h3>
                  <p className="text-faint text-sm mt-1">
                    {recommendation.mexicanCity}, MX ↔ {recommendation.usCity}, US
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleToggleFavorite}
                    className="w-9 h-9 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                    aria-label={t("crossing.bookmark")}
                  >
                    {isFavorited ? (
                      <BookmarkCheck className="w-5 h-5 text-cruze-green" />
                    ) : (
                      <Bookmark className="w-5 h-5 text-ink" />
                    )}
                  </button>
                  <button
                    onClick={handleShare}
                    className="w-9 h-9 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                    aria-label={t("crossing.share")}
                  >
                    <Share2 className="w-5 h-5 text-ink" />
                  </button>
                </div>
              </div>

              {/* Live Status */}
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cruze-green" />
                <span className="text-cruze-green text-xs font-semibold uppercase tracking-wider">
                  {t("common.live")}
                </span>
                <span className="text-faint text-xs">
                  {getFreshnessLabel(recommendation.generatedAt)}
                </span>
              </div>

              {/* Journey Metrics */}
              <div className={`flex ${hasJourneyContext ? 'gap-0' : ''}`}>
                <div className={`flex items-center gap-3 p-3 bg-surface-raised rounded-[var(--radius-md)] ${hasJourneyContext ? 'flex-1' : 'w-full'}`}>
                  <Clock className="w-5 h-5 text-faint shrink-0" />
                  <div>
                    <span className="text-ink text-xl font-bold tabular">
                      {formatDuration(activeWaitTime)}
                    </span>
                    <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.borderWait")}</p>
                    {/* Selected Lane Chip */}
                    <div className="mt-2">
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cruze-green/10 border border-cruze-green/20 rounded-full">
                        <CheckCircle2 className="w-3 h-3 text-cruze-green" />
                        <span className="text-cruze-green text-xs font-medium">
                          {activeLane?.name || "Standard"}
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                {hasJourneyContext && (
                  <>
                    <div className="w-px bg-border mx-2" />
                    <div className="flex items-center gap-3 p-3 bg-surface-raised rounded-[var(--radius-md)] flex-1">
                      <TrendingUp className="w-5 h-5 text-faint shrink-0" />
                      <div>
                        <span className="text-ink text-xl font-bold tabular">
                          {formatDuration(activeWaitTime + (recommendation.totalJourneyTime - recommendation.waitTime))}
                        </span>
                        <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.totalJourney")}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Lane Times */}
              <div className="space-y-3">
                <p className="text-muted text-xs font-medium uppercase tracking-wider">
                  {t("crossing.laneTimes")}
                </p>
                <div className="space-y-2">
                  {(() => {
                    // On first render, show Standard at top. On click, keep original order.
                    const lanesToShow = [...recommendation.lanes];
                    if (!selectedLane) {
                      // First render: sort Standard to top
                      lanesToShow.sort((a, b) => {
                        if (a.name === "Standard") return -1;
                        if (b.name === "Standard") return 1;
                        return 0;
                      });
                    }
                    return lanesToShow.slice(0, showAllLanes ? undefined : 3).map((lane) => {
                      const isSelected = selectedLane === lane.name || (!selectedLane && lane.name === "Standard");
                      const eligibility = getLaneEligibility(lane.name, travelerProfile);
                      return (
                        <button
                          key={lane.name}
                          onClick={() => lane.isOpen && eligibility.eligible && setSelectedLane(lane.name)}
                          disabled={!lane.isOpen || !eligibility.eligible}
                          className={`w-full flex items-center justify-between px-3 py-2 rounded-[var(--radius-md)] transition-colors ${
                            isSelected
                              ? "bg-cruze-green/10 border border-cruze-green/30"
                              : lane.isOpen && eligibility.eligible
                                ? "bg-surface-raised border border-border active:bg-surface"
                                : "bg-surface border border-border opacity-50"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSelected && (
                              <CheckCircle2 className="w-4 h-4 text-cruze-green" />
                            )}
                            <span className={`text-sm font-medium ${isSelected ? "text-cruze-green" : "text-ink"}`}>
                              {lane.name}
                            </span>
                            {/* Eligibility badges */}
                            {travelerProfile && !isSelected && (
                              <>
                                {eligibility.preferred && (
                                  <span className="px-2 py-1 min-h-[20px] bg-cruze-green/10 text-cruze-green text-xs font-semibold rounded">
                                    {t("crossing.preferred")}
                                  </span>
                                )}
                                {eligibility.eligible && !eligibility.preferred && (
                                  <span className="px-2 py-1 min-h-[20px] bg-improving/10 text-improving text-xs font-semibold rounded">
                                    {t("crossing.eligible")}
                                  </span>
                                )}
                                {!eligibility.eligible && eligibility.reason && (
                                  <span className="px-2 py-1 min-h-[20px] bg-faint/10 text-faint text-xs font-semibold rounded">
                                    {t(eligibility.reason)}
                                  </span>
                                )}
                              </>
                            )}
                          </div>
                          <span className={`text-sm font-bold tabular ${isSelected ? "text-cruze-green" : "text-ink"}`}>
                            {formatDuration(lane.waitTime)}
                          </span>
                        </button>
                      );
                    });
                  })()}
                </div>
                {recommendation.lanes.length > 3 && !showAllLanes && (
                  <button
                    onClick={() => setShowAllLanes(true)}
                    className="flex items-center gap-1 text-cruze-green text-xs font-medium"
                  >
                    {t("common.showMore")}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                )}
              </div>

              <div className="border-t border-border" />

              {/* Crossing Facts */}
              <div className="space-y-3">
                <p className="text-muted text-xs font-medium uppercase tracking-wider">
                  {t("crossing.about")}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-3">
                    <Clock className="w-4 h-4 text-faint" />
                    <span className="text-sm text-muted">{recommendation.facts.hours}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <User className="w-4 h-4 text-faint" />
                    <span className="text-sm text-muted">
                      {recommendation.facts.pedestrianAccess
                        ? t("crossing.pedestrianAvailable")
                        : t("crossing.pedestrianNotAvailable")}
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Truck className="w-4 h-4 text-faint" />
                    <span className="text-sm text-muted">
                      {recommendation.facts.commercialAccess
                        ? t("crossing.commercialAvailable")
                        : t("crossing.commercialNotAvailable")}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(true)}
                  className="w-full h-[40px] flex items-center justify-center gap-2 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium active:bg-surface-subtle transition-colors"
                >
                  <Info className="w-4 h-4" />
                  {t("crossing.showAllDetails")}
                </button>
              </div>

            </div>
          </div>
        )}

        {/* Other Crossings in Same Corridor */}
        {otherCrossings.length > 0 && (
          <div className="px-5 mt-6 space-y-4">
            <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
              {t("crossing.otherCrossings")}
            </h2>
            <div className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden">
              {otherCrossings.map((crossing, index) => (
                <div
                  key={crossing.id}
                  className={`flex items-center justify-between px-4 py-3 ${
                    index < otherCrossings.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div>
                    <p className="text-ink text-sm font-medium">{crossing.name}</p>
                    <p className="text-faint text-xs">{crossing.mexicanCity}, MX ↔ {crossing.usCity}, US</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-right">
                      <span className="text-ink text-sm font-medium tabular">
                        {formatDuration(crossing.waitTimeNorthbound)}
                      </span>
                      {crossing.waitTimeNorthbound !== activeWaitTime && (
                        <p className={`text-xs tabular ${
                          crossing.waitTimeNorthbound < activeWaitTime ? "text-improving" : "text-caution"
                        }`}>
                          {crossing.waitTimeNorthbound > activeWaitTime ? "+" : ""}
                          {crossing.waitTimeNorthbound - activeWaitTime} min
                        </p>
                      )}
                    </div>
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        crossing.statusNorthbound === "OPEN"
                          ? "bg-improving"
                          : crossing.statusNorthbound === "LIMITED"
                          ? "bg-caution"
                          : "bg-critical"
                      }`}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Alternatives */}
        {recommendation && recommendation.alternatives.length > 0 && (
          <div className="px-5 mt-8 space-y-4">
            <h2 className="text-muted text-xs font-medium uppercase tracking-wider">
              {t("onboarding.recommendation.otherOptions")}
            </h2>
            <div className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden">
              {recommendation.alternatives.map((alt, index) => (
                <div
                  key={alt.crossingId}
                  className={`flex items-center justify-between px-4 py-3 ${
                    index < recommendation.alternatives.length - 1 ? "border-b border-border" : ""
                  }`}
                >
                  <div>
                    <p className="text-ink text-sm font-medium">{alt.crossingName}</p>
                    <p className="text-faint text-xs">{alt.mexicanCity}, MX ↔ {alt.usCity}, US</p>
                  </div>
                  <div className="text-right">
                    <p className="text-ink text-sm font-medium tabular">{formatDuration(alt.totalJourneyTime)}</p>
                    <p className="text-caution text-xs tabular">+{alt.deltaMinutes} {t("common.min")}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Compare Crossings Button */}
        <div className="px-5 mt-8">
          <button className="w-full h-[48px] flex items-center justify-center gap-2 bg-cruze-green text-dark font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors">
            {t("crossing.compareCrossings")}
          </button>
        </div>

        {/* Disclaimer */}
        <div className="px-5 mt-4">
          <p className="text-faint text-xs leading-relaxed">
            {t("crossing.disclaimer")}
          </p>
        </div>

        {/* Bottom padding for nav bar */}
        <div className="h-20" />
      </main>

      {/* Bottom Navigation */}
      <BottomNavigation active="crossings" onSelect={(dest: BottomNavDestination) => {
        if (dest === "viaje") {
          window.location.href = `/${locale}/viaje`;
        } else if (dest === "crossings") {
          window.location.href = `/${locale}/crossings`;
        } else if (dest === "agent") {
          window.location.href = `/${locale}/agent`;
        }
      }} />

      {/* Crossing Details Modal */}
      {showDetailsModal && recommendation && (
        <CrossingDetailsModal
          recommendation={recommendation}
          onClose={() => setShowDetailsModal(false)}
        />
      )}
    </div>
  );
}
