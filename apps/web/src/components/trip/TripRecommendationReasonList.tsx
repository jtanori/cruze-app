"use client";

import { useTranslations } from "next-intl";
import { Check } from "lucide-react";

interface TripRecommendationReasonListProps {
  reasons: string[];
  className?: string;
}

export function TripRecommendationReasonList({ reasons, className = "" }: TripRecommendationReasonListProps) {
  const t = useTranslations();
  if (reasons.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("trip.recommendation.card.whyThis")}</p>
      <ul className="space-y-2">
        {reasons.map((r, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className="w-5 h-5 rounded-full bg-success/15 flex items-center justify-center shrink-0 mt-0.5">
              <Check className="w-3 h-3 text-success" />
            </span>
            <span className="text-sm text-muted">{r}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
