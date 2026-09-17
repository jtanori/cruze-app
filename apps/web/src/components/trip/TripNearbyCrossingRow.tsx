"use client";

import { useTranslations } from "next-intl";
import { Clock } from "lucide-react";
import { formatFreshness } from "@/lib/format-freshness";
import { formatDuration, formatDistance } from "@/lib/display";

interface TripNearbyCrossingRowProps {
  name: string;
  waitTime: number;
  direction: "MX_TO_US" | "US_TO_MX";
  status: "open" | "closed" | "limited";
  lastUpdated: number; // timestamp
  mexicanCity?: string;
  usCity?: string;
  distanceKm?: number;
  onClick: () => void;
}

export function TripNearbyCrossingRow({
  name,
  waitTime,
  direction,
  status,
  lastUpdated,
  mexicanCity,
  usCity,
  distanceKm,
  onClick,
}: TripNearbyCrossingRowProps) {
  const placeLine =
    mexicanCity && usCity && mexicanCity !== name && usCity !== name
      ? `${mexicanCity} ↔ ${usCity}`
      : (mexicanCity && mexicanCity !== name ? mexicanCity : null) ??
        (usCity && usCity !== name ? usCity : null);
  const t = useTranslations();

  const freshnessText = formatFreshness(lastUpdated, t);

  const statusConfig = {
    open: { label: t("common.open"), color: "text-cruze-green", dotColor: "bg-cruze-green" },
    closed: { label: t("common.closed"), color: "text-critical", dotColor: "bg-critical" },
    limited: { label: t("common.limited"), color: "text-warning", dotColor: "bg-warning" },
    unknown: { label: t("common.unknown"), color: "text-muted", dotColor: "bg-muted" },
  };

  const normalizedStatus = (String(status ?? "unknown").toLowerCase() as keyof typeof statusConfig);
  const currentStatus = statusConfig[normalizedStatus] ?? statusConfig.unknown;

  return (
    <button
      onClick={onClick}
      className="w-full flex flex-col space-y-1 p-3 bg-surface border border-border-subtle rounded-[var(--radius-lg)] hover:bg-surface-elevated transition-colors text-left"
    >
      <div className="flex items-center gap-2">
        <span className="text-ink text-sm font-medium truncate">{name}</span>
        <span className="ml-auto text-ink text-sm font-semibold tabular-nums shrink-0">
          {distanceKm !== undefined ? formatDistance(distanceKm) : formatDuration(waitTime)}
        </span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-faint text-xs truncate">
          {placeLine ?? ""}
        </span>
        {distanceKm !== undefined && (
          <span className="ml-auto text-ink text-sm font-semibold tabular-nums shrink-0">
            {formatDuration(waitTime)}
          </span>
        )}
      </div>
      <div className="flex items-center gap-2 text-xs">
        <span className="flex items-center gap-1.5 shrink-0">
          <span aria-hidden="true" className={`w-1.5 h-1.5 rounded-full shrink-0 ${currentStatus.dotColor}`} />
          <span className={currentStatus.color}>{currentStatus.label}</span>
        </span>
        <span className="text-faint shrink-0">{direction === "MX_TO_US" ? "MX → US" : "US → MX"}</span>
        <span className="ml-auto flex items-center gap-1 text-faint truncate">
          <Clock className="w-3 h-3 shrink-0" />
          {/* freshnessText already includes the Updated/Actualizado prefix — do not re-wrap. */}
          <span className="truncate">{freshnessText}</span>
        </span>
      </div>
    </button>
  );
}