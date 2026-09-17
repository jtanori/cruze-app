"use client";
// CR-STATUS-02 — W5 §19
import { useTranslations } from "next-intl";
interface Props { direction: "MX_TO_US" | "US_TO_MX" | "BOTH"; northWait?: number | null; southWait?: number | null; className?: string; }
export function CrossingDirectionTimes({ direction, northWait, southWait, className = "" }: Props) {
  const t = useTranslations();
  // Direction codes are locale-invariant ISO pairs — intentionally literal, not t().
  const fmt = (v: number | null | undefined) => v == null ? "—" : `${v} ${t("common.min")}`;
  return (
    <div className={`flex gap-4 text-sm ${className}`}>
      {(direction === "MX_TO_US" || direction === "BOTH") && (
        <span><span className="text-faint mr-1">MX → US</span><span className="font-display font-semibold text-ink tabular">{fmt(northWait)}</span></span>
      )}
      {(direction === "US_TO_MX" || direction === "BOTH") && (
        <span><span className="text-faint mr-1">US → MX</span><span className="font-display font-semibold text-ink tabular">{fmt(southWait)}</span></span>
      )}
    </div>
  );
}
