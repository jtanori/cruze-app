"use client";

import { useTranslations } from "next-intl";
import { Clock, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { formatDuration } from "@/lib/display";

interface Alternative {
  crossingId: string;
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  deltaMinutes: number;
}

interface TripAlternativeListSectionProps {
  alternatives: Alternative[];
  onSelect?: (id: string) => void;
  className?: string;
}

export function TripAlternativeListSection({ alternatives, onSelect, className = "" }: TripAlternativeListSectionProps) {
  const t = useTranslations();
  const [expanded, setExpanded] = useState<string | null>(null);

  if (alternatives.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("trip.recommendation.otherOptions")}</p>
      {alternatives.map((alt) => {
        const isExpanded = expanded === alt.crossingId;
        return (
          <div key={alt.crossingId} className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <button
              onClick={() => setExpanded(isExpanded ? null : alt.crossingId)}
              aria-expanded={isExpanded}
              className="w-full flex items-center justify-between px-4 py-3 text-left"
            >
              <div>
                <p className="text-ink text-sm font-medium">{alt.crossingName}</p>
                <p className="text-faint text-xs">{alt.mexicanCity} ↔ {alt.usCity}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-warning text-xs font-medium tabular">{t("trip.recommendation.deltaTotal", { minutes: alt.deltaMinutes })}</span>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-faint" /> : <ChevronDown className="w-4 h-4 text-faint" />}
              </div>
            </button>
            {isExpanded && (
              <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-faint" />
                    <span className="text-ink text-lg font-bold tabular">{formatDuration(alt.waitTime)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-faint" />
                    <span className="text-ink text-lg font-bold tabular">{formatDuration(alt.totalJourneyTime)}</span>
                  </div>
                </div>
                {onSelect && (
                  <button
                    onClick={() => onSelect(alt.crossingId)}
                    className="w-full h-10 rounded-[var(--radius-md)] bg-surface-elevated border border-border text-ink text-sm font-medium"
                  >
                    {t("trip.recommendation.card.useCrossing")}
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
