"use client";

import { useState } from "react";
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
  const [expandedId, setExpandedId] = useState<string | null>(null);

  if (loading) {
    return (
      <div className={`space-y-3 ${className}`} role="status" aria-label="Cargando cruces">
        {Array.from({ length: 5 }, (_, i) => (
          <LoadingSkeleton key={i} variant="card" height="5rem" />
        ))}
      </div>
    );
  }

  if (unavailable) {
    return (
      <ErrorState
        title="Cruces no disponibles"
        message="No se pudo cargar la información de cruces. Intenta nuevamente."
        action={{ label: "Reintentar", onClick: onRetry }}
        className={className}
      />
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        title="No encontramos cruces"
        description="Prueba con otro término o filtro."
        action={
          hasActiveFilters ? (
            <button
              onClick={onClearFilters}
              className="text-cruze-mint text-sm font-medium hover:underline min-h-[44px] px-4"
            >
              Limpiar filtros
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
