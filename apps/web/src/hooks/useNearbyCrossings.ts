"use client";

import { useEffect, useState } from "react";
import type { LocationData } from "@/lib/location-state-machine";
import { contextualDirectionForCountry } from "@/lib/country-resolution";
import {
  normalizeCrossings,
  rankCrossings,
  type NearbyCrossing,
} from "@/lib/crossings";

const CANDIDATE_LIMIT = 10;
const DISPLAY_LIMIT = 3;

interface UseNearbyCrossingsResult {
  crossings: NearbyCrossing[];
  loading: boolean;
  empty: boolean;
}

/**
 * T01 nearby intelligence: fetch candidates → normalize → rank → present 2–3.
 * Direction is contextual (from location country, UNKNOWN → unfiltered),
 * never the trip direction — trip direction derives from origin + destination.
 */
export function useNearbyCrossings(
  location: LocationData | null,
  displayLimit: number = DISPLAY_LIMIT
): UseNearbyCrossingsResult {
  const [candidates, setCandidates] = useState<NearbyCrossing[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!location) {
      setCandidates([]);
      return;
    }
    let cancelled = false;
    const fetchCandidates = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          lat: String(location.lat),
          lng: String(location.lng),
          limit: String(CANDIDATE_LIMIT),
        });
        const direction = location.country
          ? contextualDirectionForCountry(location.country)
          : null;
        if (direction) params.set("direction", direction);
        const response = await fetch(`/api/crossings?${params.toString()}`);
        if (response.ok) {
          const data = await response.json();
          if (!cancelled && data.crossings) {
            setCandidates(normalizeCrossings(data.crossings));
          }
        }
      } catch (err) {
        console.warn("[Cruze:Trip] Failed to fetch nearby crossings:", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void fetchCandidates();
    return () => {
      cancelled = true;
    };
  }, [location?.lat, location?.lng, location?.country]);

  const crossings = rankCrossings(candidates).slice(0, displayLimit);
  return { crossings, loading, empty: !loading && crossings.length === 0 };
}
