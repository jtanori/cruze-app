"use client";

import { DataStatus } from "@/components/primitives/DataStatus";
import { DataTimestamp } from "@/components/primitives/DataTimestamp";
import { formatDuration } from "@/lib/display";

interface CrossingDetailHeroProps {
  crossingName: string;
  status: "operational" | "limited" | "closed" | "unknown";
  waitTime: number | null;
  direction?: "northbound" | "southbound";
  updatedAt: string;
  className?: string;
}

export function CrossingDetailHero({ crossingName, status, waitTime, direction = "northbound", updatedAt, className = "" }: CrossingDetailHeroProps) {
  return (
    <div className={`space-y-4 ${className}`}>
      <h1 className="text-2xl font-bold text-ink uppercase tracking-tight">{crossingName}</h1>
      <div className="w-full h-40 rounded-[var(--radius-lg)] bg-surface-elevated border border-border flex items-center justify-center">
        <span className="text-muted text-sm">MAP</span>
      </div>
      <div className="flex items-center gap-3">
        <DataStatus status={status} />
      </div>
      <div>
        <p className="text-3xl font-extrabold tabular text-ink">{waitTime !== null ? formatDuration(waitTime) : "—"}</p>
        <p className="text-sm text-muted capitalize">{direction === "northbound" ? "Norte" : "Sur"}</p>
      </div>
      <DataTimestamp timestamp={updatedAt} variant="compact" />
    </div>
  );
}
