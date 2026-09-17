"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/primitives/EmptyState";
import { ErrorState } from "@/components/primitives/ErrorState";
import { LoadingSkeleton } from "@/components/primitives/LoadingSkeleton";
import { CrossingsDirectoryExpandedRow } from "./CrossingsDirectoryExpandedRow";
import type { CrossingOperationalStatus } from "./CrossingsDirectoryRow";
import { CrossingsDirectoryLoadMoreState } from "./CrossingsDirectoryLoadMoreState";

export interface DirectoryListItem {
  id: string;
  crossingName: string;
  status: CrossingOperationalStatus;
  northboundWait: number | null;
  southboundWait: number | null;
  lanes: Array<{ type: string; waitTime: number | null }>;
  hours?: string;
}

interface CrossingsDirectoryListProps {
  items: DirectoryListItem[];
  loading: boolean;
  loadingMore: boolean;
  unavailable: boolean;
  hasActiveFilters: boolean;
  hasMore: boolean;
  onRetry: () => void;
  onLoadMore: () => void;
  onClearFilters: () => void;
  onViewDetail?: (id: string) => void;
  className?: string;
}

/**
 * CR-DIR-01 — presentational directory list. Data, filtering, ranking,
 * and pagination live server-side (see useCrossingsDirectory).
 * Empty ≠ unavailable: distinct states with distinct recovery.
 */
export function CrossingsDirectoryList({
  items,
  loading,
  loadingMore,
  unavailable,
  hasActiveFilters,
  hasMore,
  onRetry,
  onLoadMore,
  onClearFilters,
  onViewDetail,
  className = "",
}: CrossingsDirectoryListProps) {
  const t = useTranslations();
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-label={t("crossings.directory.loading")}>
        {Array.from({ length: 5 }, (_, i) => (
          <LoadingSkeleton key={i} variant="card" height="5rem" />
        ))}
      </div>
    );
  }

  if (unavailable) {
    return (
      <ErrorState
        title={t("crossings.directory.unavailableTitle")}
        message={t("crossings.directory.unavailableMessage")}
        action={{ label: t("common.retry"), onClick: onRetry }}
        className={className}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title={t("crossings.noResults")}
        description={t("crossings.noResultsDescription")}
        action={
          hasActiveFilters ? (
            <button
              onClick={onClearFilters}
              className="text-cruze-mint text-sm font-medium hover:underline min-h-[44px] px-4"
            >
              {t("crossings.directory.clearFilters")}
            </button>
          ) : undefined
        }
        className={className}
      />
    );
  }

  return (
    <div className={`space-y-3 ${className}`}>
      {items.map((c) => (
        <CrossingsDirectoryExpandedRow
          key={c.id}
          crossingName={c.crossingName}
          status={c.status}
          northboundWait={c.northboundWait}
          southboundWait={c.southboundWait}
          lanes={c.lanes}
          hours={c.hours}
          expanded={expandedId === c.id}
          onToggle={() => setExpandedId(expandedId === c.id ? null : c.id)}
          onViewDetail={onViewDetail ? () => onViewDetail(c.id) : undefined}
        />
      ))}
      {hasMore && (
        <CrossingsDirectoryLoadMoreState
          loadingMore={loadingMore}
          onLoadMore={onLoadMore}
        />
      )}
    </div>
  );
}
