"use client";

import { useTranslations } from "next-intl";
import { Clock, Navigation } from "lucide-react";
import { formatDuration } from "@/lib/display";

interface TripRouteSummaryProps {
  crossingName: string;
  waitTime: number;
  totalTime: number;
  className?: string;
}

export function TripRouteSummary({ crossingName, waitTime, totalTime, className = "" }: TripRouteSummaryProps) {
  const t = useTranslations();

  return (
    <div className={`bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("trip.routeSummary.title")}</p>
      <h3 className="text-ink text-lg font-bold">{crossingName}</h3>
      <div className="flex items-center gap-4 sm:gap-6">
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Clock className="w-4 h-4" /> {formatDuration(waitTime)}
        </span>
        <span className="flex items-center gap-1.5 text-sm text-muted">
          <Navigation className="w-4 h-4" /> {formatDuration(totalTime)} total
        </span>
      </div>
    </div>
  );
}
