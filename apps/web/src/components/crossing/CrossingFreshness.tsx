"use client";
// CR-STATUS-05 — W5 §22 — keep operational vs freshness independent
export type FreshnessState = "LIVE" | "RECENT" | "STALE" | "UNAVAILABLE";
interface Props { state: FreshnessState; minutesAgo?: number | null; className?: string; }
export function CrossingFreshness({ state, minutesAgo, className = "" }: Props) {
  if (state === "UNAVAILABLE") return <span className={`text-xs text-faint ${className}`}>Datos no disponibles</span>;
  if (state === "STALE") return <span className={`text-xs text-cruze-amber ${className}`}>Hace {minutesAgo ?? "?"} min · desactualizado</span>;
  if (state === "LIVE") return <span className={`text-xs text-cruze-mint ${className}`}>Hace {minutesAgo ?? 0} min</span>;
  return <span className={`text-xs text-faint ${className}`}>Hace {minutesAgo ?? "?"} min</span>;
}
