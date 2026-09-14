"use client";

import { DataStatus } from "@/components/primitives/DataStatus";
import { DataTimestamp } from "@/components/primitives/DataTimestamp";
import { formatDuration } from "@/lib/display";

interface CrossingDetailHeroProps {
  crossingName: string;
  status: "operational" | "limited" | "closed" | "unknown";
  waitTime: number | null;
  direction?: "northbound" | "southbound" | "both";
  secondaryWaitTime?: number | null;
  /** Southbound waits are modeled estimates — label the slot honestly. */
  secondaryEstimated?: boolean;
  secondaryEstimatedLabel?: string;
  updatedAt?: string;
  children?: React.ReactNode;
  className?: string;
}

export function CrossingDetailHero({
  crossingName,
  status,
  waitTime,
  direction = "northbound",
  secondaryWaitTime = null,
  secondaryEstimated = false,
  secondaryEstimatedLabel = "Sur · est.",
  updatedAt,
  children,
  className = "",
}: CrossingDetailHeroProps) {
  const showBoth = direction === "both";
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex items-start justify-between gap-4">
        <h1 className="text-2xl font-bold text-ink uppercase tracking-tight">{crossingName}</h1>
        {children}
      </div>
      <div className="flex items-center gap-3">
        <DataStatus status={status} />
      </div>
      {showBoth ? (
        <div className="flex gap-6">
          <div>
            <p className="text-3xl font-extrabold tabular text-ink">
              {waitTime !== null ? formatDuration(waitTime) : "—"}
            </p>
            <p className="text-sm text-muted capitalize">Norte</p>
          </div>
          <div>
            <p className="text-3xl font-extrabold tabular text-ink">
              {secondaryWaitTime !== null ? formatDuration(secondaryWaitTime) : "—"}
            </p>
            <p className="text-sm text-muted capitalize">
              {secondaryEstimated ? secondaryEstimatedLabel : "Sur"}
            </p>
          </div>
        </div>
      ) : (
        <div>
          <p className="text-3xl font-extrabold tabular text-ink">
            {waitTime !== null ? formatDuration(waitTime) : "—"}
          </p>
          <p className="text-sm text-muted capitalize">
            {direction === "northbound" ? "Norte" : "Sur"}
          </p>
        </div>
      )}
      {updatedAt && <DataTimestamp timestamp={updatedAt} />}
    </div>
  );
}
