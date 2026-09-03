"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";

interface TripCrossingCardProps {
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  status: "OPEN" | "LIMITED" | "CLOSED";
  waitTime: number;
  totalJourneyTime?: number;
  deltaMinutes?: number;
  isRecommended?: boolean;
  recommendationLabel?: string;
  onClick?: () => void;
}

/**
 * Simplified crossing card for trip view.
 * Shows essential info: country split, status, wait time, and optional journey context.
 */
export const TripCrossingCard: FC<TripCrossingCardProps> = ({
  crossingName,
  mexicanCity,
  usCity,
  status,
  waitTime,
  totalJourneyTime,
  deltaMinutes,
  isRecommended = false,
  recommendationLabel,
  onClick,
}) => {
  const t = useTranslations();

  const statusColor = {
    OPEN: "bg-cruze-green",
    LIMITED: "bg-cruze-amber",
    CLOSED: "bg-alert-red",
  }[status];

  const statusText = {
    OPEN: t("crossings.open"),
    LIMITED: t("crossings.limited"),
    CLOSED: t("crossings.closed"),
  }[status];

  return (
    <div
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`bg-surface border rounded-[var(--radius-lg)] p-4 space-y-3 ${
        isRecommended ? "border-cruze-green/30" : "border-border"
      } ${onClick ? "cursor-pointer hover:bg-surface-elevated transition-colors" : ""}`}
    >
      {/* Country Split Header */}
      <div className="flex items-center justify-between text-sm">
        <span className="text-ink font-medium">{mexicanCity}, MX</span>
        <span className="text-faint">↔</span>
        <span className="text-ink font-medium">{usCity}, CA</span>
      </div>

      {/* Status + Wait Time */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${statusColor}`} />
          <span className="text-ink text-xs font-medium">{statusText}</span>
        </div>
        <div className="flex items-baseline gap-1">
          <span className="text-ink text-lg font-bold tabular">{waitTime}</span>
          <span className="text-faint text-xs">min</span>
        </div>
      </div>

      {/* Journey Context (if available) */}
      {totalJourneyTime !== undefined && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-faint">Total journey</span>
          <span className="text-ink font-medium tabular">{totalJourneyTime} min</span>
        </div>
      )}

      {/* Delta (if available) */}
      {deltaMinutes !== undefined && deltaMinutes > 0 && (
        <div className="flex items-center justify-between text-xs">
          <span className="text-faint">Slower than recommended</span>
          <span className="text-cruze-amber font-medium tabular">+{deltaMinutes} min</span>
        </div>
      )}

      {/* Recommendation Badge */}
      {isRecommended && recommendationLabel && (
        <div className="flex items-center gap-1.5 pt-1">
          <span className="text-cruze-green text-[10px] font-semibold uppercase tracking-wider">
            ✦ {recommendationLabel}
          </span>
        </div>
      )}
    </div>
  );
};
