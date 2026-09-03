"use client";

import { CheckCircle, Circle, AlertTriangle } from "lucide-react";
import type { AgentChecklistResult as AgentChecklistType } from "@/lib/agent-structured-results";

interface Props {
  result: AgentChecklistType;
}

export function AgentChecklistResult({ result }: Props) {
  return (
    <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
      {result.items.map((item, i) => (
        <div key={i} className="flex items-start gap-3 px-4 py-2.5">
          {item.status === "checked" ? <CheckCircle className="w-5 h-5 text-success shrink-0" /> : item.status === "warning" ? <AlertTriangle className="w-5 h-5 text-warning shrink-0" /> : <Circle className="w-5 h-5 text-muted shrink-0" />}
          <div>
            <p className="text-sm text-ink">{item.label}</p>
            {item.detail && <p className="text-xs text-faint">{item.detail}</p>}
          </div>
        </div>
      ))}
    </div>
  );
}
