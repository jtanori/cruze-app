"use client";

import { useTranslations } from "next-intl";
import type { CrossingsSort, CrossingsScope } from "@/lib/crossings-query";

interface CrossingsDirectorySummaryProps {
  total: number;
  scope: CrossingsScope;
  sort: CrossingsSort;
  onSortChange: (sort: CrossingsSort) => void;
  /** When true, results come from a search term — not the scope filter. */
  isSearching?: boolean;
  className?: string;
}

const SCOPE_KEYS: Record<CrossingsScope, string> = {
  NEARBY: "crossings.filter.nearby",
  MX: "crossings.filter.mx",
  US: "crossings.filter.us",
  ALL: "crossings.filter.allBorder",
};

const SORT_OPTIONS: Array<{ value: CrossingsSort; labelKey: string }> = [
  { value: "NEAREST", labelKey: "crossings.directory.sortNearest" },
  { value: "RELEVANCE", labelKey: "crossings.directory.sortRelevance" },
  { value: "FASTEST", labelKey: "crossings.directory.sortFastest" },
  { value: "NAME", labelKey: "crossings.directory.sortName" },
];

/**
 * CR-DIR-07 + CR-DIR-08 — result count (total matching query) + compact sort.
 */
export function CrossingsDirectorySummary({
  total,
  scope,
  sort,
  onSortChange,
  isSearching = false,
  className = "",
}: CrossingsDirectorySummaryProps) {
  const t = useTranslations();
  const singular = total === 1;
  const countText = isSearching
    ? t(singular ? "crossings.directory.foundSingular" : "crossings.directory.foundPlural", { count: total })
    : t(singular ? "crossings.directory.scopedSingular" : "crossings.directory.scopedPlural", { count: total, scope: t(SCOPE_KEYS[scope]) });
  return (
    <div className={`flex items-center justify-between gap-3 ${className}`}>
      <p className="text-sm text-ink tabular" role="status">
        {countText}
      </p>
      <label className="flex items-center gap-1.5 text-sm text-faint shrink-0">
        <span className="sr-only">{t("crossings.directory.sortBy")}</span>
        <select
          value={sort}
          onChange={(e) => onSortChange(e.target.value as CrossingsSort)}
          aria-label={t("crossings.directory.sortBy")}
          className="h-9 bg-transparent text-sm text-faint focus:outline-none focus:text-ink cursor-pointer appearance-none pr-4"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value} className="bg-surface text-ink">
              {t(o.labelKey)}
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
