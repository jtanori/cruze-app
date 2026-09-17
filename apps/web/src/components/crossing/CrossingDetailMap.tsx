"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  fetchDirectionsRoute,
  drawRouteLayers,
  fitJourneyBounds,
  addJourneyMarkers,
  addCrossingMarker,
  type MapPoint,
} from "@/lib/map-route";

interface CrossingDetailMapProps {
  lat?: number;
  lng?: number;
  crossingName?: string;
  origin?: MapPoint | null;
  destination?: MapPoint | null;
  className?: string;
}

/**
 * CR-DET-02 — Contextual map for a crossing.
 *
 * Two modes:
 *   Crossing-only: marker + popup (no trip context)
 *   Journey mode:  origin → crossing → destination route overlay + 3 markers + bounds
 *
 * Graceful degradation: interactive GL → static image → "Mapa no disponible"
 * Route failure is non-fatal: map stays usable without the overlay.
 */
export function CrossingDetailMap({
  lat,
  lng,
  crossingName,
  origin = null,
  destination = null,
  className = "",
}: CrossingDetailMapProps) {
  const t = useTranslations();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [staticFailed, setStaticFailed] = useState(false);

  const hasJourneyContext = Boolean(
    origin && destination && lat !== undefined && lng !== undefined
  );

  useEffect(() => {
    if (!mapContainer.current || lat === undefined || lng === undefined) return;

    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      console.warn("[Cruze:Map] Map token not configured");
      setMapError("Map token not configured");
      return;
    }

    // mapbox-gl v3 requires WebGL2
    const webgl2 = mapboxgl.supported();
    if (!webgl2) {
      console.warn("[Cruze:Map] mapboxgl.supported() === false (needs WebGL2); using static map");
      setMapError("static");
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    // Tear down previous instance (StrictMode remounts, prop changes)
    map.current?.remove();
    map.current = null;
    mapContainer.current.innerHTML = "";

    // Journey mode: center on centroid; crossing-only: center on crossing
    let centerLng = lng;
    let centerLat = lat;
    let initialZoom = 14;

    if (hasJourneyContext && origin && destination) {
      centerLng = (origin.lng + lng + destination.lng) / 3;
      centerLat = (origin.lat + lat + destination.lat) / 3;
      initialZoom = 6;
    }

    let mapInstance: mapboxgl.Map | null = null;
    try {
      mapInstance = new mapboxgl.Map({
        container: mapContainer.current!,
        style: "mapbox://styles/mapbox/dark-v11",
        center: [centerLng, centerLat],
        zoom: initialZoom,
        interactive: true,
        attributionControl: false,
        failIfMajorPerformanceCaveat: false,
      });
    } catch (err) {
      console.warn(
        "[Cruze:Map] Map constructor threw, falling back to static map:",
        err instanceof Error ? err.message : err
      );
      setMapError("static");
      return;
    }
    map.current = mapInstance;

    const crossing: MapPoint = { lat, lng, label: crossingName };

    mapInstance.on("load", () => {
      if (hasJourneyContext && origin && destination) {
        // Journey mode: 3 markers + route overlay + bounds
        addJourneyMarkers(mapInstance!, origin, crossing, destination);

        const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
        fetchDirectionsRoute(
          [origin.lng, origin.lat],
          [lng, lat],
          token
        )
          .then((routeToCrossing) =>
            fetchDirectionsRoute([lng, lat], [destination.lng, destination.lat], token).then(
              (routeFromCrossing) => {
                if (!mapInstance || mapInstance !== map.current) return;
                const allCoords = [
                  ...routeToCrossing,
                  ...routeFromCrossing.slice(1),
                ];
                drawRouteLayers(mapInstance, allCoords);
                fitJourneyBounds(mapInstance, origin, crossing, destination);
              }
            )
          )
          .catch(() => {
            // Directions failed — markers are still visible, map is usable
            console.warn("[Cruze:Map] Directions failed; showing markers without route");
          });
      } else {
        // Crossing-only mode: simple marker + popup
        addCrossingMarker(mapInstance!, crossing, crossingName);
      }
    });

    return () => {
      mapInstance.remove();
      if (map.current === mapInstance) map.current = null;
    };
  }, [lat, lng, crossingName, origin?.lat, origin?.lng, origin?.label, destination?.lat, destination?.lng, destination?.label, hasJourneyContext]);

  // Static map fallback (no WebGL needed)
  if (mapError === "static" && !staticFailed && lat !== undefined && lng !== undefined) {
    const token = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";
    const src =
      `https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/` +
      `pin-s+00e0a0(${lng},${lat})/${lng},${lat},14,0/600x300@2x?access_token=${token}`;
    return (
      <div className={`w-full h-48 rounded-[var(--radius-lg)] bg-surface-elevated border border-border overflow-hidden ${className}`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={crossingName ? t("crossings.map.altWithName", { name: crossingName }) : t("crossings.map.altDefault")}
          className="w-full h-full object-cover"
          onError={() => setStaticFailed(true)}
        />
      </div>
    );
  }

  if (mapError) {
    // Internal error codes ("static", token state) never reach the UI verbatim.
    const reason = t("crossings.map.loadFailed");
    return (
      <div className={`w-full rounded-[var(--radius-lg)] bg-surface border border-border-subtle px-4 py-6 text-center ${className}`}>
        <p className="text-ink text-sm font-medium">{t("crossings.map.unavailable")}</p>
        <p className="text-faint text-xs mt-1">{reason}</p>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className={`w-full h-48 rounded-[var(--radius-lg)] bg-surface-elevated border border-border ${className}`} />
  );
}
