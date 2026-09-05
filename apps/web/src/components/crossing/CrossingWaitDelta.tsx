"use client";
// CR-STATUS-04 — W5 §21
interface Props { delta: number | null; className?: string; }
export function CrossingWaitDelta({ delta, className = "" }: Props) {
  if (delta == null || delta === 0) return <span className={`text-sm text-faint ${className}`}>—</span>;
  const positive = delta < 0; // negative delta = faster
  return (
    <span className={`inline-flex items-center gap-1 text-sm font-semibold tabular ${positive ? "text-cruze-mint" : "text-cruze-amber"} ${className}`}>
      <span>{positive ? "↓" : "↑"}</span>{Math.abs(delta)} min
    </span>
  );
}
