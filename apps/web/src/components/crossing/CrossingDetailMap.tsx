"use client";

import { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";

interface CrossingDetailMapProps {
  lat?: number;
  lng?: number;
  crossingName?: string;
  className?: string;
}

export function CrossingDetailMap({ lat, lng, crossingName, className = "" }: CrossingDetailMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current || lat === undefined || lng === undefined) return;

    if (!process.env.NEXT_PUBLIC_MAPBOX_TOKEN) {
      setMapError("Map token not configured");
      return;
    }

    mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

    map.current = new mapboxgl.Map({
      container: mapContainer.current!,
      style: "mapbox://styles/mapbox/dark-v11",
      center: [lng!, lat!],
      zoom: 14,
      interactive: true,
      attributionControl: false,
    });

    // Add crossing marker
    new mapboxgl.Marker({ color: "#00E0A0" })
      .setLngLat([lng!, lat!])
      .addTo(map.current!);

    // Add popup with crossing name
    new mapboxgl.Popup({ offset: 25, closeButton: false })
      .setLngLat([lng!, lat!])
      .setHTML(`<strong>${crossingName || "Crossing"}</strong>`)
      .addTo(map.current!);

    return () => {
      map.current?.remove();
      map.current = null;
    };
  }, [lat, lng, crossingName]);

  if (mapError) {
    return (
      <div className={`w-full h-48 rounded-[var(--radius-lg)] bg-surface-elevated border border-border flex flex-col items-center justify-center ${className}`}>
        <span className="text-muted text-sm">Map unavailable</span>
        <span className="text-faint text-xs mt-1">{mapError}</span>
      </div>
    );
  }

  return (
    <div ref={mapContainer} className={`w-full h-48 rounded-[var(--radius-lg)] bg-surface-elevated border border-border ${className}`} />
  );
}