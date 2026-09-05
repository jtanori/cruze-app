/*── USE LOCATION FILTER ────────────────────────────────────────────────────╭
  Purpose: Direction + "My area" (geo) + "Open now" filtering — live, no hardcoded city.
   Single source: border-data.ts (42 ports) + border-data-service live + useLocationContext
  No mock Tijuana filter — uses haversineDistance to user location.
──────────────────────────────────────────────────────────────────────────*/
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocationContext } from "@/components/location/LocationProvider";
import { haversineDistance } from "@/lib/border-data";

export type FilterOption =
  | "all"
  | "mx_to_us"
  | "us_to_mx"
  | "open"
  | "my-area";

export function useLocationFilter(
  crossings: any[],
  locale: string,
  selectedFilter: FilterOption
) {
  const { location, status } = useLocationContext();
  const hasLocation = status === "ready" && location !== null;

  /* ─── Direction derived from selectedFilter (not locale) ──────────────── */
  const direction = useMemo<"mx_to_us" | "us_to_mx" | null>(() => {
    if (selectedFilter === "mx_to_us" || selectedFilter === "us_to_mx") return selectedFilter;
    // Fallback: infer from user location country when on "my-area" or "open"
    // Not from locale — locale is UI language, not trip direction
    return null;
  }, [selectedFilter]);

  const filterByDirection = useCallback((crossing: any): boolean => {
    if (!direction) return true;
    const dir = (crossing.direction ?? crossing.corridor ?? "").toString().toUpperCase();
    // crossings store direction as "MX_TO_US" via border-data-service; be tolerant
    const normalized = dir.includes("MX") ? "mx_to_us" : dir.includes("US") ? "us_to_mx" : null;
    if (selectedFilter === "mx_to_us") return normalized === "mx_to_us" || !normalized;
    if (selectedFilter === "us_to_mx") return normalized === "us_to_mx";
    return true;
  }, [direction, selectedFilter]);

  /* ─── "My Area" — geo aggregation (live, not hardcoded Tijuana) ──────── */
  const [myAreaIds, setMyAreaIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!hasLocation || !location || selectedFilter !== "my-area") {
      if (selectedFilter !== "my-area") setMyAreaIds(new Set());
      return;
    }
    // Nearest N by haversine, 100km radius, cap 5 — works for any border city, not just Tijuana
    const withDist = crossings
      .map((c) => {
        const coord = c.coordinates ?? c.center ?? null;
        if (!coord || typeof coord.lat !== "number") return null;
        return { id: c.id, dist: haversineDistance({ lat: location.lat, lng: location.lng }, coord) };
      })
      .filter(Boolean) as { id: string; dist: number }[];

    withDist.sort((a, b) => a.dist - b.dist);
    const nearby = withDist.filter((x) => x.dist <= 100).slice(0, 5);
    // If none within 100km (e.g. far from border), fall back to 3 nearest
    const ids = (nearby.length ? nearby : withDist.slice(0, 3)).map((x) => x.id);
    setMyAreaIds(new Set(ids));
  }, [hasLocation, location, crossings, selectedFilter]);

  const filterByOpenStatus = useCallback((crossing: any): boolean => {
    const s = (crossing.status ?? "").toString().toUpperCase();
    return s === "OPEN";
  }, []);

  const applyFilters = useCallback((list: any[]): any[] => {
    return list
      .filter(filterByDirection)
      .filter(selectedFilter === "open" ? filterByOpenStatus : () => true)
      .filter(selectedFilter === "my-area" ? (c: any) => myAreaIds.has(c.id) : () => true);
  }, [filterByDirection, filterByOpenStatus, selectedFilter, myAreaIds]);

  const filteredCrossings = useMemo(() => applyFilters(crossings), [applyFilters, crossings]);

  return {
    filteredCrossings,
    directionOptions: ["all", "mx_to_us", "us_to_mx"] as const,
    currentDirection: direction,
    hasLocation,
    myAreaIds,
  };
}
