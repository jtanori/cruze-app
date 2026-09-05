"use client";
// CR-STATUS-01 — W5 canon §18, tokens W5 §1.1
export type CrossingOperationalStatus = "OPEN" | "LIMITED" | "CLOSED" | "UNKNOWN";
interface Props { status: CrossingOperationalStatus; className?: string; }
const map: Record<CrossingOperationalStatus, { label: string; dot: string; text: string }> = {
  OPEN:    { label: "Abierto",  dot: "bg-cruze-mint", text: "text-cruze-mint" },
  LIMITED: { label: "Limitado", dot: "bg-cruze-amber", text: "text-cruze-amber" },
  CLOSED:  { label: "Cerrado",  dot: "bg-cruze-red",   text: "text-cruze-red" },
  UNKNOWN: { label: "Desconocido", dot: "bg-muted", text: "text-muted" },
};
export function CrossingStatusBadge({ status, className = "" }: Props) {
  const c = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 h-7 px-2.5 rounded-[var(--radius-pill)] bg-surface border border-border text-xs font-semibold ${c.text} ${className}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
}
