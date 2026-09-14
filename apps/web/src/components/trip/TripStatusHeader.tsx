"use client";

import { useTranslations } from "next-intl";

type TripStatus = "active" | "stale";
type CrossingStatus = "open" | "limited" | "closed" | "unknown";

interface TripStatusHeaderProps {
  originLabel: string;
  destinationLabel: string;
  status: TripStatus;
  crossingStatus: CrossingStatus;
  lastUpdated: string | null;
  className?: string;
}

function getRelativeTime(iso: string): { key: string; count?: number } {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000);
  if (mins < 1) return { key: "common.justNow" };
  if (mins < 60) return { key: "common.minutesAgo", count: mins };
  const hours = Math.floor(mins / 60);
  return { key: "common.hoursAgo", count: hours };
}

const STATUS_DOT_COLORS: Record<CrossingStatus, string> = {
  open: "text-success",
  limited: "text-warning",
  closed: "text-error",
  unknown: "text-muted",
};

const STATUS_LABELS: Record<CrossingStatus, string> = {
  open: "common.open",
  limited: "common.limited",
  closed: "common.closed",
  unknown: "common.unknown",
};

export function TripStatusHeader({
  originLabel,
  destinationLabel,
  status,
  crossingStatus,
  lastUpdated,
  className = "",
}: TripStatusHeaderProps) {
  const t = useTranslations();

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Status badge */}
      <div className="flex items-center gap-1.5">
        <span className={`w-2 h-2 rounded-full bg-current ${status === "active" ? "text-cruze-mint" : "text-caution"}`} />
        <span className="text-[11px] font-bold uppercase tracking-wider text-muted">
          {status === "active" ? t("trip.status.active") : t("trip.status.stale")}
        </span>
      </div>

      {/* Trip identity */}
      <div className="flex items-center gap-2">
        <span className="text-ink font-sora font-bold text-base">{originLabel}</span>
        <span className="text-faint text-sm">→</span>
        <span className="text-ink font-sora font-bold text-base">{destinationLabel}</span>
      </div>

      {/* Operational context */}
      <div className="flex items-center gap-2 text-[13px]">
        <span className={`w-2 h-2 rounded-full bg-current ${STATUS_DOT_COLORS[crossingStatus]}`} />
        <span className="text-muted">{t(STATUS_LABELS[crossingStatus])}</span>
        {lastUpdated && (
          <>
            <span className="text-faint">·</span>
            <span className="text-muted">
              {(() => {
                const { key, count } = getRelativeTime(lastUpdated);
                return t(key, count !== undefined ? { count } : undefined);
              })()}
            </span>
          </>
        )}
      </div>
    </div>
  );
}
