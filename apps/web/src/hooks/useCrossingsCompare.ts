"use client";

import { useEffect, useMemo, useState } from "react";
import type { LocationData } from "@/lib/location-state-machine";
import {
  contextualDirectionForCountry,
  type ResolvedCountry,
} from "@/lib/country-resolution";
import {
  compareCrossings,
  type CompareRow,
  type CompareTravelMode,
} from "@/lib/crossings-compare";

interface UseCrossingsCompareParams {
  ids: string[];
  location: LocationData | null;
  tripDirection: "MX_TO_US" | "US_TO_MX" | null;
  tripOrigin?: { lat: number; lng: number } | null;
  tripDestinationName?: string | null;
  tripOriginName?: string | null;
  mode?: CompareTravelMode;
}

interface UseCrossingsCompareResult {
  rows: CompareRow[];
  lastUpdatedById: Record<string, number>;
  bothDirections: boolean;
  contextLabel: string;
  loading: boolean;
  unavailable: boolean;
  retry: () => void;
}

const DIRECTION_LABEL: Record<string, string> = {
  MX_TO_US: "Norte",
  US_TO_MX: "Sur",
};

const MODE_LABEL: Record<string, string> = {
  VEHICLE: "Vehículo",
  WALK: "A pie",
  COMMERCIAL: "Comercial",
};

/**
 * C04 data owner: fetches the directory payload once, selects the
 * requested ids, and runs the pure compare domain. Origin prefers
 * the trip origin, falling back to user location.
 *
 * `mode` from the route is requested comparison context — the domain
 * still owns compatibility. Direction null → bothDirections, never
 * defaults to MX_TO_US.
 */
export function useCrossingsCompare({
  ids,
  location,
  tripDirection,
  tripOrigin = null,
  tripDestinationName = null,
  tripOriginName = null,
  mode = null,
}: UseCrossingsCompareParams): UseCrossingsCompareResult {
  const [rows, setRows] = useState<CompareRow[]>([]);
  const [lastUpdatedById, setLastUpdatedById] = useState<Record<string, number>>({});
  const [bothDirections, setBothDirections] = useState(true);
  const [loading, setLoading] = useState(true);
  const [unavailable, setUnavailable] = useState(false);
  const [retryKey, setRetryKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      setLoading(true);
      setUnavailable(false);
      try {
        const country: ResolvedCountry = location?.country ?? "UNKNOWN";
        // Direction: trip wins, then contextual country, then null (both).
        // Never defaults to MX_TO_US.
        const direction =
          tripDirection ?? contextualDirectionForCountry(country) ?? null;

        const params = new URLSearchParams({ limit: "50" });
        // Only send direction when resolved — null means both, skip param.
        if (direction) params.set("direction", direction);

        const response = await fetch(`/api/crossings?${params}`);
        if (!response.ok) throw new Error(`compare fetch: ${response.status}`);
        const data = await response.json();
        if (cancelled || !Array.isArray(data.crossings)) return;

        const byId = new Map<string, (typeof data.crossings)[number]>();
        for (const c of data.crossings) byId.set(c.id, c);

        const inputs = ids
          .map((id) => byId.get(id))
          .filter((c) => !!c)
          .map((c) => ({
            id: String(c.id),
            crossingName: String(c.name ?? c.id),
            waitNorthbound:
              typeof c.waitTimeNorthbound === "number" ? c.waitTimeNorthbound : null,
            waitSouthbound:
              typeof c.waitTimeSouthbound === "number" ? c.waitTimeSouthbound : null,
            status: (["OPEN", "LIMITED", "CLOSED"] as const).includes(c.status)
              ? c.status
              : ("UNKNOWN" as const),
            lastUpdated: typeof c.lastUpdated === "string" ? c.lastUpdated : null,
            laneCategories: Array.isArray(c.lanes)
              ? c.lanes
                  .map((l: { category?: string }) => l.category)
                  .filter((cat: string) =>
                    ["passenger", "commercial", "pedestrian"].includes(cat)
                  )
              : [],
            coordinates: {
              lat: Number(c.coordinates?.lat),
              lng: Number(c.coordinates?.lng),
            },
          }));

        const origin =
          tripOrigin ?? (location ? { lat: location.lat, lng: location.lng } : null);

        const result = compareCrossings(inputs, {
          origin,
          direction,
          mode,
        });

        if (cancelled) return;
        setRows(result.rows);
        setBothDirections(result.bothDirections);

        const stamps: Record<string, number> = {};
        for (const c of inputs) {
          if (c.lastUpdated) {
            const ts = new Date(c.lastUpdated).getTime();
            if (Number.isFinite(ts)) stamps[c.id] = ts;
          }
        }
        setLastUpdatedById(stamps);
      } catch (err) {
        if (!cancelled) {
          console.warn("[Cruze:C04] Compare fetch failed:", err);
          setRows([]);
          setUnavailable(true);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    JSON.stringify(ids),
    tripDirection,
    mode,
    retryKey,
    location?.lat,
    location?.lng,
    location?.country,
    tripOrigin?.lat,
    tripOrigin?.lng,
  ]);

  const contextLabel = useMemo(() => {
    const hasTrip = tripOriginName && tripDestinationName;
    if (hasTrip) {
      const parts = [`${tripOriginName} → ${tripDestinationName}`];
      if (mode && MODE_LABEL[mode]) parts.push(MODE_LABEL[mode]);
      if (tripDirection && DIRECTION_LABEL[tripDirection]) {
        parts.push(DIRECTION_LABEL[tripDirection]);
      }
      return `Tu viaje · ${parts.join(" · ")}`;
    }
    return "Cruces cercanos";
  }, [tripOriginName, tripDestinationName, tripDirection, mode]);

  return {
    rows,
    lastUpdatedById,
    bothDirections,
    contextLabel,
    loading,
    unavailable,
    retry: () => setRetryKey((k) => k + 1),
  };
}
