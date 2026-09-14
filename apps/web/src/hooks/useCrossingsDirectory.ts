"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { LocationData } from "@/lib/location-state-machine";
import {
  contextualDirectionForCountry,
  type ResolvedCountry,
} from "@/lib/country-resolution";
import type {
  CrossingsScope,
  CrossingsMode,
  CrossingsStatusFilter,
  CrossingsSort,
} from "@/lib/crossings-query";
import type { DirectoryFilters } from "@/components/crossing/CrossingsDirectoryFilterSheet";

export interface DirectoryCrossingItem {
  id: string;
  name: string;
  mexicanCity: string;
  usCity: string;
  status: "OPEN" | "LIMITED" | "CLOSED" | "UNKNOWN";
  waitTimeNorthbound: number | null;
  waitTimeSouthbound: number | null;
  isLive: boolean;
  lastUpdated?: string | null;
  hours: string | null;
  coordinates: { lat: number; lng: number };
  lanes: Array<{ name: string; waitTime: number | null }>;
}

interface UseCrossingsDirectoryParams {
  location: LocationData | null;
  search: string;
  filters: DirectoryFilters;
  sort: CrossingsSort;
  limit?: number;
}

interface UseCrossingsDirectoryResult {
  items: DirectoryCrossingItem[];
  total: number;
  scope: CrossingsScope;
  loading: boolean;
  loadingMore: boolean;
  unavailable: boolean;
  hasMore: boolean;
  retry: () => void;
  loadMore: () => void;
}

const SEARCH_DEBOUNCE_MS = 300;
const PAGE_LIMIT = 10;

/**
 * C01 data owner: builds the §34 query from UI state + location,
 * fetches pages, appends on cursor. Pages pass params and render.
 */
export function useCrossingsDirectory({
  location,
  search,
  filters,
  sort,
  limit = PAGE_LIMIT,
}: UseCrossingsDirectoryParams): UseCrossingsDirectoryResult {
  const [debouncedSearch, setDebouncedSearch] = useState(search);
  const [items, setItems] = useState<DirectoryCrossingItem[]>([]);
  const [total, setTotal] = useState(0);
  const [scope, setScope] = useState<CrossingsScope>("ALL");
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unavailable, setUnavailable] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const requestId = useRef(0);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [search]);

  const country: ResolvedCountry = location?.country ?? "UNKNOWN";

  const fetchPage = useCallback(
    async (cursor: string | null, append: boolean) => {
      const params = new URLSearchParams({
        scope: filters.scope,
        mode: filters.mode,
        status: filters.status,
        sort,
        limit: String(limit),
      });
      if (debouncedSearch) params.set("search", debouncedSearch);
      if (cursor) params.set("cursor", cursor);
      const direction = contextualDirectionForCountry(country);
      if (direction) params.set("direction", direction);
      if (location) {
        params.set("lat", String(location.lat));
        params.set("lng", String(location.lng));
      }
      const id = ++requestId.current;
      if (append) setLoadingMore(true);
      else setLoading(true);
      setUnavailable(false);
      try {
        const response = await fetch(`/api/crossings?${params.toString()}`);
        if (!response.ok) throw new Error(`directory fetch: ${response.status}`);
        const data = await response.json();
        if (requestId.current !== id) return;
        const page: DirectoryCrossingItem[] = Array.isArray(data.crossings)
          ? data.crossings
          : [];
        setItems((prev) => (append ? [...prev, ...page] : page));
        setTotal(typeof data.total === "number" ? data.total : page.length);
        setScope(data.scope ?? filters.scope);
        setNextCursor(data.nextCursor ?? null);
      } catch (err) {
        if (requestId.current !== id) return;
        console.warn("[Cruze:C01] Directory fetch failed:", err);
        if (!append) {
          setItems([]);
          setTotal(0);
          setUnavailable(true);
        }
      } finally {
        if (requestId.current === id) {
          setLoading(false);
          setLoadingMore(false);
        }
      }
    },
    [
      debouncedSearch,
      filters.scope,
      filters.mode,
      filters.status,
      sort,
      limit,
      country,
      location?.lat,
      location?.lng,
    ]
  );

  useEffect(() => {
    setNextCursor(null);
    void fetchPage(null, false);
  }, [fetchPage, retryKey]);

  const loadMore = useCallback(() => {
    if (!nextCursor || loadingMore) return;
    void fetchPage(nextCursor, true);
  }, [fetchPage, nextCursor, loadingMore]);

  const retry = useCallback(() => {
    setRetryKey((k) => k + 1);
  }, []);

  return {
    items,
    total,
    scope,
    loading,
    loadingMore,
    unavailable,
    hasMore: nextCursor !== null,
    retry,
    loadMore,
  };
}

export type {
  CrossingsScope,
  CrossingsMode,
  CrossingsStatusFilter,
  CrossingsSort,
};
