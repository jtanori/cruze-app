"use client";
// CR-STATUS-05 — W5 §22 — keep operational vs freshness independent
import { useTranslations } from "next-intl";
export type FreshnessState = "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE";
interface Props { state: FreshnessState; minutesAgo?: number | null; className?: string; }
export function CrossingFreshness({ state, minutesAgo, className = "" }: Props) {
  const t = useTranslations();
  if (state === "UNAVAILABLE") return <span className={`text-xs text-faint ${className}`}>{t("crossings.freshness.unavailable")}</span>;
  if (state === "STALE") return <span className={`text-xs text-cruze-amber ${className}`}>{t("crossings.freshness.stale", { minutes: minutesAgo ?? "?" })}</span>;
  if (state === "LIVE") return <span className={`text-xs text-cruze-mint ${className}`}>{t("crossings.freshness.live", { minutes: minutesAgo ?? 0 })}</span>;
  return <span className={`text-xs text-faint ${className}`}>{t("crossings.freshness.recent", { minutes: minutesAgo ?? "?" })}</span>;
}
