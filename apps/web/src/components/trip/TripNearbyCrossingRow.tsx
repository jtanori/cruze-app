"use client";

import { useTranslations } from "next-intl";
import { MapPin, Circle, Clock } from "lucide-react";

interface TripNearbyCrossingRowProps {
  name: string;
  waitTime: number;
  direction: "MX_TO_US" | "US_TO_MX";
  status: "open" | "closed" | "limited";
  lastUpdated: number; // timestamp
  onClick: () => void;
}

export function TripNearbyCrossingRow({
  name,
  waitTime,
  direction,
  status,
  lastUpdated,
  onClick,
}: TripNearbyCrossingRowProps) {
  const t = useTranslations();

  const now = Date.now();
  const minutesAgo = Math.floor((now - lastUpdated) / 60000);
  const freshnessText = minutesAgo < 1
    ? t("common.justNow")
    : minutesAgo < 60
      ? t("common.minutesAgo", { count: minutesAgo })
      : t("common.hoursAgo", { count: Math.floor(minutesAgo / 60) });

  const statusConfig = {
    open: { label: t("common.open"), color: "text-cruze-green", dotColor: "bg-cruze-green" },
    closed: { label: t("common.closed"), color: "text-critical", dotColor: "bg-critical" },
    limited: { label: t("common.limited"), color: "text-warning", dotColor: "bg-warning" },
  };

  const normalizedStatus = (String(status ?? "open").toLowerCase() as keyof typeof statusConfig);
  const currentStatus = statusConfig[normalizedStatus] ?? statusConfig.open;

  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between p-3 bg-surface border border-border rounded-[var(--radius-md)] hover:bg-surface-elevated transition-colors"
    >
      <div className="flex items-center gap-3">
        <MapPin className="w-5 h-5 text-cruze-green" />
        <div>
          <p className="text-ink text-sm font-medium">{name}</p>
          <div className="flex items-center gap-2 mt-0.5 text-xs">
            <span className="flex items-center gap-1">
              <Circle className={`${currentStatus.dotColor} w-1.5 h-1.5`} />
              <span className={currentStatus.color}>{currentStatus.label}</span>
            </span>
            <span className="text-faint">{direction === "MX_TO_US" ? t("common.northbound") : t("common.southbound")}</span>
            <span className="text-faint flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />
              {t("common.updated", { time: freshnessText })}
            </span>
          </div>
        </div>
      </div>
      <div className="text-right">
        <p className="text-ink text-lg font-bold">{waitTime} min</p>
        <p className="text-faint text-xs">{t("common.waitTime")}</p>
      </div>
    </button>
  );
}