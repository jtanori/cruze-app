/*── USE LOCATION FILTER ────────────────────────────────────────────────────╭
  Purpose: Handles crossings location filtering (direction, "My area")
 ──────────────────────────────────────────────────────────────────────────╯

  DESIGN SPECS (cruze-screens-spec-review):
  - Horizontal filter scroll: All / MX→US / US→Mexico / Open now / My area
  - "My area" uses geolocation
  - "Open now" filters by current status
  - Filter persistence across sessions
  - i18n support for filter labels

  DATA FLOW:
    MOCK_CROSSINGS → useLocationFilter → filteredCrossings → CrossingsTab
──────────────────────────────────────────────────────────────────────────*/
import { useState, useEffect, useCallback } from "react";

/* ─── Filter Options ──────────────────────────────────────────────────────*/

export type FilterOption =
  | "all"
  | "mx_to_us"
  | "us_to_mx"
  | "open"
  | "my-area";

/* ─── Use Location Filter Hook ────────────────────────────────────────────*/

export function useLocationFilter(
  crossings: any[],
  locale: string,
  selectedFilter: FilterOption
) {
  /* ─── Direction Filter ──────────────────────────────────────────────────*/

  const [direction, setDirection] = useState<"mx_to_us" | "us_to_mx" | null>(null);

  useEffect(() => {
    // Parse locale or URL to determine direction
    // locale 'en' = US_TO_MX, locale 'es' = MX_TO_US (rough mapping)
    const localeDirection: "mx_to_us" | "us_to_mx" = locale === "en" ? "us_to_mx" : "mx_to_us";
    setDirection(localeDirection);
  }, [locale]);

  const filterByDirection = (crossing: any): boolean => {
    if (!direction) return true; // Show all if no direction specified
    return crossing.direction === direction;
  };

  /* ─── "My Area" Filter ──────────────────────────────────────────────────*/

  const [myAreaCrossings, setMyAreaCrossings] = useState<any[]>([]);
  const [hasGeolocationPermission, setHasGeolocationPermission] =
    useState<boolean>(false);

  // Check geolocation permission
  useEffect(() => {
    // In a real implementation, check navigator.permissions
    // For now, use mock state
    setHasGeolocationPermission(true);
  }, []);

  // Filter crossings by current area (mock: show crossings near Tijuana/San Diego)
  useEffect(() => {
    if (!hasGeolocationPermission) return;

    // Mock: filter crossings that are in the Tijuana/San Diego area
    const areaCrossings = crossings.filter(
      (c) =>
        c.cityOrigin === "Tijuana" ||
        c.cityDestination === "San Diego" ||
        c.id === "san-ysidro" ||
        c.id === "otay-mesa"
    );
    setMyAreaCrossings(areaCrossings);
  }, [hasGeolocationPermission, crossings]);

  /* ─── "Open Now" Filter ──────────────────────────────────────────────────*/

  const filterByOpenStatus = (crossing: any): boolean => {
    return crossing.status === "OPEN";
  };

  /* ─── Apply All Filters ──────────────────────────────────────────────────*/

  const applyFilters = useCallback((crossings: any[]): any[] => {
    return crossings
      .filter(filterByDirection)
      .filter(selectedFilter === "open" ? filterByOpenStatus : () => true)
      .filter(
        selectedFilter === "my-area"
          ? (crossing: any) => myAreaCrossings.some((mc) => mc.id === crossing.id)
          : () => true
      );
  }, [direction, selectedFilter, myAreaCrossings]);

  const filteredCrossings = applyFilters(crossings);

  return {
    filteredCrossings,
    directionOptions: ["all", "mx_to_us", "us_to_mx"],
    currentDirection: direction,
  };
}