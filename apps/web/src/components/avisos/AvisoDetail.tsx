"use client";

import { Badge } from "@/components/primitives/Badge";
import type { Aviso } from "@/lib/avisos";
import { trackEvent } from "@/lib/analytics";

interface AvisoDetailProps {
  aviso: Aviso;
  onAskAgent?: () => void;
  onViewRecommendation?: () => void;
  className?: string;
}

export function AvisoDetail({ aviso, onAskAgent, onViewRecommendation, className = "" }: AvisoDetailProps) {
  const date = new Date(aviso.timestamp).toLocaleString();

  return (
    <div className={`bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-4 ${className}`}>
      <div className="flex items-center gap-2">
        <Badge variant={aviso.severity === "critical" ? "new" : aviso.severity === "warning" ? "count" : "neutral"}>{aviso.type}</Badge>
        <span className="text-xs text-muted">{date}</span>
      </div>
      <h3 className="text-ink font-semibold">{aviso.title}</h3>
      <p className="text-sm text-muted">{aviso.description}</p>
      {aviso.crossingName && <p className="text-sm text-ink">{aviso.crossingName}</p>}
      <div className="flex gap-2">
        {onViewRecommendation && <button onClick={() => { trackEvent("aviso_action_view_recommendation", { avisoType: aviso.type }); onViewRecommendation?.(); }} className="flex-1 h-[40px] rounded-[var(--radius-md)] bg-cruze-mint text-midnight text-sm font-semibold">Ver recomendación</button>}
        {onAskAgent && <button onClick={() => { trackEvent("aviso_action_ask_agent", { avisoType: aviso.type }); onAskAgent?.(); }} className="flex-1 h-[40px] rounded-[var(--radius-md)] bg-surface-elevated border border-border text-ink text-sm font-medium">Preguntar al Agente</button>}
      </div>
    </div>
  );
}
