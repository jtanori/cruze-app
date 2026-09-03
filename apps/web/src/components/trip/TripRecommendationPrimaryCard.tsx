"use client";

import { Clock, TrendingUp, CheckCircle2 } from "lucide-react";
import { formatDuration } from "@/lib/display";

export type RecommendationRank = "recommended" | "fastest" | "best_overall" | "alternative";

interface TripRecommendationPrimaryCardProps {
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  rank?: RecommendationRank;
  status?: "open" | "limited" | "closed";
  generatedAt: string;
  onUseCrossing?: () => void;
  className?: string;
}

const rankLabels: Record<RecommendationRank, string> = {
  recommended: "Recomendado",
  fastest: "M\u00E1s r\u00E1pido",
  best_overall: "Mejor opci\u00F3n",
  alternative: "Alternativa",
};

export function TripRecommendationPrimaryCard({
  crossingName,
  mexicanCity,
  usCity,
  waitTime,
  totalJourneyTime,
  rank = "recommended",
  status = "open",
  generatedAt,
  onUseCrossing,
  className = "",
}: TripRecommendationPrimaryCardProps) {
  const mins = Math.floor((Date.now() - new Date(generatedAt).getTime()) / 60000);

  return (
    <div className={`bg-surface border border-cruze-mint/30 rounded-[var(--radius-lg)] overflow-hidden ${className}`}>
      <div className="px-5 py-5 space-y-4">
        <div>
          <p className="text-faint text-xs uppercase tracking-wider mb-1">MEJOR CRUCE PARA TU VIAJE</p>
          <h2 className="text-ink text-xl font-bold">{crossingName}</h2>
          <p className="text-faint text-xs">{mexicanCity}, MX ↔ {usCity}, US</p>
          <div className="flex items-center gap-2 mt-2">
            <span className={`w-2 h-2 rounded-full ${status === "open" ? "bg-success" : status === "limited" ? "bg-warning" : "bg-danger"}`} />
            <span className="text-xs font-semibold uppercase tracking-wider text-muted">{status === "open" ? "Abierto" : status === "limited" ? "Limitado" : "Cerrado"}</span>
            <span className="ml-auto text-xs font-semibold px-2 py-0.5 rounded-full bg-cruze-mint/15 text-cruze-mint">{rankLabels[rank]}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex-1 flex items-center gap-3 p-3 bg-surface-elevated rounded-[var(--radius-md)]">
            <Clock className="w-5 h-5 text-faint shrink-0" />
            <div>
              <span className="text-ink text-xl font-bold tabular">{formatDuration(waitTime)}</span>
              <p className="text-faint text-xs">Tiempo de espera</p>
            </div>
          </div>
          <div className="flex-1 flex items-center gap-3 p-3 bg-surface-elevated rounded-[var(--radius-md)]">
            <TrendingUp className="w-5 h-5 text-faint shrink-0" />
            <div>
              <span className="text-ink text-xl font-bold tabular">{formatDuration(totalJourneyTime)}</span>
              <p className="text-faint text-xs">Viaje total</p>
            </div>
          </div>
        </div>

        <p className="text-faint text-xs">Actualizado hace {mins} min</p>

        {onUseCrossing && (
          <button
            onClick={onUseCrossing}
            className="w-full h-[48px] flex items-center justify-center gap-2 bg-cruze-mint text-midnight text-sm font-semibold rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
          >
            <CheckCircle2 className="w-4 h-4" />
            Usar este cruce
          </button>
        )}
      </div>
    </div>
  );
}
