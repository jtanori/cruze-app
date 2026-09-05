"use client";
// CR-STATUS-02 — W5 §19
interface Props { direction: "MX_TO_US" | "US_TO_MX" | "BOTH"; northWait?: number | null; southWait?: number | null; className?: string; }
export function CrossingDirectionTimes({ direction, northWait, southWait, className = "" }: Props) {
  const fmt = (v: number | null | undefined) => v == null ? "—" : `${v} min`;
  return (
    <div className={`flex gap-4 text-sm ${className}`}>
      {(direction === "MX_TO_US" || direction === "BOTH") && (
        <span><span className="text-faint mr-1">Norte</span><span className="font-display font-semibold text-ink tabular">{fmt(northWait)}</span></span>
      )}
      {(direction === "US_TO_MX" || direction === "BOTH") && (
        <span><span className="text-faint mr-1">Sur</span><span className="font-display font-semibold text-ink tabular">{fmt(southWait)}</span></span>
      )}
    </div>
  );
}
