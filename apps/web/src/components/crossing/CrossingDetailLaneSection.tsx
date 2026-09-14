"use client";

import { useTranslations } from "next-intl";
import { formatDuration } from "@/lib/display";

type LaneCategory = "passenger" | "commercial" | "pedestrian";

const CATEGORY_LABEL: Record<LaneCategory, string> = {
  passenger: "Vehículo",
  commercial: "Comercial",
  pedestrian: "A pie",
};

interface LaneRow {
  type: string;
  waitTime: number | null;
  /** Present when sourced; always rendered as qualifier (no duplicate labels). */
  category?: LaneCategory;
}

interface CrossingDetailLaneSectionProps {
  lanes: LaneRow[];
  /** Why the list is empty (shown under the empty notice). */
  emptyNote?: string;
  className?: string;
}

export function CrossingDetailLaneSection({ lanes, emptyNote, className = "" }: CrossingDetailLaneSectionProps) {
  const t = useTranslations();
  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">TIEMPOS POR CARRIL</p>
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
        {lanes.map((l, i) => (
          <div key={`${l.type}-${l.category ?? "na"}-${i}`} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-ink">
              {l.type}
              {l.category && (
                <span className="text-faint text-xs"> · {CATEGORY_LABEL[l.category]}</span>
              )}
            </span>
            <span className="text-sm font-bold tabular text-ink">{l.waitTime !== null ? formatDuration(l.waitTime) : "—"}</span>
          </div>
        ))}
        {lanes.length === 0 && (
          <div className="px-4 py-3 space-y-1">
            <p className="text-sm text-muted">{t("crossing.lanesEmpty")}</p>
            {emptyNote && <p className="text-xs text-faint">{emptyNote}</p>}
          </div>
        )}
      </div>
    </div>
  );
}
