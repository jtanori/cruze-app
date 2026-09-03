"use client";

import { formatDuration } from "@/lib/display";

interface LaneRow {
  type: string;
  waitTime: number | null;
}

interface CrossingDetailLaneSectionProps {
  lanes: LaneRow[];
  className?: string;
}

export function CrossingDetailLaneSection({ lanes, className = "" }: CrossingDetailLaneSectionProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">TIEMPOS POR CARRIL</p>
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
        {lanes.map((l) => (
          <div key={l.type} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm text-ink">{l.type}</span>
            <span className="text-sm font-bold tabular text-ink">{l.waitTime !== null ? formatDuration(l.waitTime) : "—"}</span>
          </div>
        ))}
        {lanes.length === 0 && <p className="px-4 py-3 text-sm text-muted">No hay datos de carriles</p>}
      </div>
    </div>
  );
}
