"use client";

import { ChevronDown, ChevronUp } from "lucide-react";
import { DataStatus } from "@/components/primitives/DataStatus";
import { formatDuration } from "@/lib/display";

export type CrossingOperationalStatus = "operational" | "limited" | "closed" | "unknown";

interface CrossingsDirectoryRowProps {
  crossingName: string;
  status: CrossingOperationalStatus;
  northboundWait: number | null;
  southboundWait: number | null;
  expanded?: boolean;
  onToggle?: () => void;
  onSelect?: () => void;
  className?: string;
}

export function CrossingsDirectoryRow({
  crossingName,
  status,
  northboundWait,
  southboundWait,
  expanded = false,
  onToggle,
  onSelect,
  className = "",
}: CrossingsDirectoryRowProps) {
  return (
    <div className={`bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden ${className}`}>
      <button
        onClick={onToggle ?? onSelect}
        className="w-full px-4 py-2.5 flex items-center justify-between text-left"
      >
        <div className="min-w-0 flex-1">
          <p className="text-ink text-sm font-semibold truncate">{crossingName}</p>
          <DataStatus status={status} size="sm" />
        </div>
        <div className="flex items-center gap-4 sm:gap-6 shrink-0 ml-4">
          <div className="text-right">
            <p className="text-xs text-muted">Norte</p>
            <p className="text-sm font-bold tabular text-ink">{northboundWait !== null ? formatDuration(northboundWait) : "—"}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted">Sur</p>
            <p className="text-sm font-bold tabular text-ink">{southboundWait !== null ? formatDuration(southboundWait) : "—"}</p>
          </div>
          {onToggle && (
            <span className="text-muted">
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </span>
          )}
        </div>
      </button>
    </div>
  );
}
