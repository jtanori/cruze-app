"use client";
// CR-STATUS-03 — W5 §20 — primary metric, Sora 28-40px, 600-700
import { useTranslations } from "next-intl";
interface Props { minutes: number | null; variant?: "normal" | "positive" | "warning"; className?: string; }
export function CrossingWaitTime({ minutes, variant = "normal", className = "" }: Props) {
  const t = useTranslations();
  if (minutes == null) return <span className={`font-display text-2xl text-muted italic ${className}`}>—</span>;
  const color = variant === "positive" ? "text-cruze-mint" : variant === "warning" ? "text-cruze-amber" : "text-ink";
  return <span className={`font-display text-[28px] font-bold tabular ${color} ${className}`}>{minutes} {t("common.min")}</span>;
}
