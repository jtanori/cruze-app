"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useLocationContext } from "@/components/location/LocationProvider";
import { useHeaderCompanion } from "@/components/layout/HeaderCompanionContext";
import { useCrossingsDirectory } from "@/hooks/useCrossingsDirectory";
import { CrossingsDirectoryToolbar } from "@/components/crossing/CrossingsDirectoryToolbar";
import {
  CrossingsDirectoryFilterSheet,
  type DirectoryFilters,
} from "@/components/crossing/CrossingsDirectoryFilterSheet";
import { CrossingsDirectorySummary } from "@/components/crossing/CrossingsDirectorySummary";
import { CrossingsDirectoryList } from "@/components/crossing/CrossingsDirectoryList";
import type { CrossingOperationalStatus } from "@/components/crossing/CrossingsDirectoryRow";
import type { CrossingsSort } from "@/lib/crossings-query";

function toRowStatus(
  status: "OPEN" | "LIMITED" | "CLOSED" | "UNKNOWN"
): CrossingOperationalStatus {
  switch (status) {
    case "OPEN":
      return "operational";
    case "LIMITED":
      return "limited";
    case "CLOSED":
      return "closed";
    default:
      return "unknown";
  }
}

export default function CrossingsPage() {
  const router = useRouter();
  const locale = useLocale();
  const { location } = useLocationContext();
  const country = location?.country ?? "UNKNOWN";
  const defaultScope = country === "MX" || country === "US" ? "NEARBY" : "ALL";

  const [search, setSearch] = useState("");
  const [filterOverride, setFilterOverride] = useState<DirectoryFilters | null>(null);
  const [sort, setSort] = useState<CrossingsSort>("NEAREST");
  const [sheetOpen, setSheetOpen] = useState(false);

  const filters: DirectoryFilters = useMemo(
    () =>
      filterOverride ?? { scope: defaultScope, mode: "ALL", status: "ALL" },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [filterOverride, defaultScope]
  );

  const directory = useCrossingsDirectory({
    location,
    search,
    filters,
    sort,
  });

  const activeFilterCount =
    (filters.scope !== defaultScope ? 1 : 0) +
    (filters.mode !== "ALL" ? 1 : 0) +
    (filters.status !== "ALL" ? 1 : 0);
  const hasActiveFilters =
    activeFilterCount > 0 || search.trim().length > 0;

  const { setHeaderCompanion } = useHeaderCompanion();

  useEffect(() => {
    setHeaderCompanion(
      <div className="px-4 sm:px-5 py-2">
        <CrossingsDirectoryToolbar
          query={search}
          onQueryChange={setSearch}
          activeFilterCount={activeFilterCount}
          onOpenFilters={() => setSheetOpen(true)}
        />
      </div>
    );
    return () => setHeaderCompanion(null);
  }, [search, activeFilterCount, setHeaderCompanion]);

  const clearFilters = () => {
    setFilterOverride(null);
    setSearch("");
  };

  return (
    <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-4">
      <CrossingsDirectoryFilterSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        filters={filters}
        onApply={setFilterOverride}
        nearbyAvailable={country === "MX" || country === "US"}
      />
      {!directory.loading && !directory.unavailable && (
        <CrossingsDirectorySummary
          total={directory.total}
          scope={directory.scope}
          sort={sort}
          onSortChange={setSort}
        />
      )}
      <CrossingsDirectoryList
        items={directory.items.map((c) => ({
          id: c.id,
          crossingName: c.name,
          status: toRowStatus(c.status),
          northboundWait: c.waitTimeNorthbound,
          southboundWait: c.waitTimeSouthbound,
          lanes: c.lanes.map((l) => ({
            type: l.name,
            waitTime: l.waitTime,
          })),
          hours: c.isLive ? (c.hours ?? undefined) : undefined,
        }))}
        loading={directory.loading}
        loadingMore={directory.loadingMore}
        unavailable={directory.unavailable}
        hasActiveFilters={hasActiveFilters}
        hasMore={directory.hasMore}
        onRetry={directory.retry}
        onLoadMore={directory.loadMore}
        onClearFilters={clearFilters}
        onViewDetail={(id) => router.push(`/${locale}/crossing/${id}`)}
      />
    </div>
  );
}
