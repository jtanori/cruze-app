"use client";

import { SlidersHorizontal } from "lucide-react";
import { SearchInput } from "@/components/primitives/SearchInput";

interface CrossingsDirectoryToolbarProps {
  query: string;
  onQueryChange: (value: string) => void;
  activeFilterCount: number;
  onOpenFilters: () => void;
  className?: string;
}

/**
 * CR-DIR-06 — compact utility row: search entry + filter trigger.
 * Replaces the permanent multi-row filter bar.
 */
export function CrossingsDirectoryToolbar({
  query,
  onQueryChange,
  activeFilterCount,
  onOpenFilters,
  className = "",
}: CrossingsDirectoryToolbarProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 min-w-0">
        <SearchInput
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          placeholder="Buscar cruces..."
          aria-label="Buscar cruces"
        />
      </div>
      <button
        onClick={onOpenFilters}
        aria-label={
          activeFilterCount > 0
            ? `Filtros, ${activeFilterCount} activos`
            : "Filtros"
        }
        className="relative w-11 h-11 shrink-0 flex items-center justify-center bg-surface border border-border rounded-[var(--radius-md)] text-ink hover:bg-surface-elevated transition-colors"
      >
        <SlidersHorizontal className="w-5 h-5" />
        {activeFilterCount > 0 && (
          <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1 flex items-center justify-center rounded-full bg-cruze-mint text-midnight text-[11px] font-bold tabular leading-none">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
}
