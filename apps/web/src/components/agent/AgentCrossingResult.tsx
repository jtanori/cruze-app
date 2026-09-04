"use client";

import { Clock, Navigation } from "lucide-react";
import { formatDuration } from "@/lib/display";
import type { AgentCrossingResult } from "@/lib/agent-structured-results";

interface Props {
  result: AgentCrossingResult;
  onView?: () => void;
  onNavigate?: () => void;
}

export function AgentCrossingResult({ result, onView, onNavigate }: Props) {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
      <h4 className="text-ink font-semibold text-sm">{result.crossingName}</h4>
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Clock className="w-4 h-4" /> {result.waitTime !== null ? formatDuration(result.waitTime) : "—"}
        </span>
        {result.totalJourney != null && <span className="text-sm text-muted">{formatDuration(result.totalJourney)} total</span>}
      </div>
      <p className="text-xs text-muted">{result.status}</p>
      <div className="flex gap-2">
        {onView && <button onClick={onView} className="flex-1 h-[36px] rounded-[var(--radius-md)] bg-surface-elevated border border-border text-ink text-xs font-medium">Ver cruce</button>}
        {onNavigate && <button onClick={onNavigate} className="flex-1 h-[36px] rounded-[var(--radius-md)] bg-cruze-mint text-midnight text-xs font-semibold flex items-center justify-center gap-1"><Navigation className="w-3.5 h-3.5" /> Navegar</button>}
      </div>
    </div>
  );
}
