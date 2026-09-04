"use client";

import { Clock, TrendingUp, Check } from "lucide-react";
import { formatDuration } from "@/lib/display";
import type { AgentRecommendationResult } from "@/lib/agent-structured-results";

interface Props {
  result: AgentRecommendationResult;
  onUse?: () => void;
  onCompare?: () => void;
}

export function AgentRecommendationResult({ result, onUse, onCompare }: Props) {
  return (
    <div className="bg-surface border border-cruze-mint/30 rounded-[var(--radius-lg)] p-4 space-y-3">
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">Recomendado</p>
      <h4 className="text-ink font-bold">{result.crossingName}</h4>
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="flex items-center gap-1 text-sm text-ink font-bold tabular"><Clock className="w-4 h-4 text-faint" /> {formatDuration(result.waitTime)}</span>
        <span className="flex items-center gap-1 text-sm text-ink font-bold tabular"><TrendingUp className="w-4 h-4 text-faint" /> {formatDuration(result.totalJourney)}</span>
      </div>
      {result.reasons.length > 0 && (
        <ul className="space-y-1">
          {result.reasons.map((r, i) => (
            <li key={i} className="flex gap-2 text-sm text-muted"><Check className="w-4 h-4 text-success shrink-0 mt-0.5" /> {r}</li>
          ))}
        </ul>
      )}
      <div className="flex gap-2">
        {onUse && <button onClick={onUse} className="flex-1 h-[36px] rounded-[var(--radius-md)] bg-cruze-mint text-midnight text-xs font-semibold">Usar este cruce</button>}
        {onCompare && <button onClick={onCompare} className="flex-1 h-[36px] rounded-[var(--radius-md)] bg-surface-elevated border border-border text-ink text-xs font-medium">Comparar</button>}
      </div>
    </div>
  );
}
