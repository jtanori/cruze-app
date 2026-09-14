"use client";

import type { CrossingsSort, CrossingsScope } from "@/lib/crossings-query";

interface CrossingsDirectorySummaryProps {
  total: number;
  scope: CrossingsScope;
  sort: CrossingsSort;
  onSortChange: (sort: CrossingsSort) => void;
  className?: string;
}

const SCOPE_COPY: Record<CrossingsScope, string> = {
  NEARBY: "Cerca de ti",
  MX: "México",
  US: "Estados Unidos",
  ALL: "Toda la frontera",
};

const SORT_OPTIONS: Array<{ value: CrossingsSort; label: string }> = [
  { value: "NEAREST", label: "Más cercanos" },
  { value: "RELEVANCE", label: "Relevancia" },
  { value: "FASTEST", label: "Más rápidos" },
  { value: "NAME", label: "Nombre" },
];

/**
 * CR-DIR-07 + CR-DIR-08 — result count (total matching query) + compact sort.
 */
export function CrossingsDirectorySummary({
  total,
  scope,
  sort,
  onSortChange,
  className = "",
}: CrossingsDirectorySummaryProps) {
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <p className="text-sm text-ink tabular" role="status">
        {total} {total === 1 ? "cruce" : "cruces"} · {SCOPE_COPY[scope]}
      </p>
      <label className="flex items-center gap-1.5 text-sm text-faint shrink-0">
        <span className="sr-only">Ordenar por</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as CrossingsSort)}
          aria-label="Ordenar por"
          className="h-9 bg-transparent text-sm text-faint focus:outline-none focus:text-ink cursor-pointer appearance-none pr-4"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface text-ink">
              {o.label}
            </option>
          ))}
        </select>
        <span aria-hidden="true" className="pointer-events-none -ml-3 text-faint">
          ↓
        </span>
      </label>
    </div>
  );
}
