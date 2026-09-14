"use client";

import { AlertTriangle } from "lucide-react";

interface TripStalePromptProps {
  title: string;
  description: string;
  stillCurrentLabel: string;
  startNewLabel: string;
  onStillCurrent: () => void;
  onStartNew: () => void;
  className?: string;
}

/**
 * Stale-trip recovery prompt — confirms the trip is still current
 * or starts a new one. Used on T08 when the trip exceeds the
 * staleness threshold.
 */
export function TripStalePrompt({
  title,
  description,
  stillCurrentLabel,
  startNewLabel,
  onStillCurrent,
  onStartNew,
  className = "",
}: TripStalePromptProps) {
  return (
    <div className={`bg-caution/10 border border-caution/30 rounded-[var(--radius-lg)] p-4 space-y-3 ${className}`}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="w-5 h-5 text-caution shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="text-ink text-sm font-medium">{title}</p>
          <p className="text-faint text-xs">{description}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <button onClick={onStillCurrent} className="flex-1 h-9 bg-cruze-mint text-midnight text-sm font-medium rounded-[var(--radius-md)]">{stillCurrentLabel}</button>
        <button onClick={onStartNew} className="flex-1 h-9 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)]">{startNewLabel}</button>
      </div>
    </div>
  );
}
