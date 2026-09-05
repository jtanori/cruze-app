"use client";
// TR-REC-04 — W5 §26  Min 56-64px, padding 12-16, Sora for wait
import { ChevronRight } from "lucide-react";
interface Props {
  name: string; accessLabel?: string; waitMinutes: number | null;
  status?: "open" | "limited" | "closed"; direction?: string; freshnessMinutes?: number | null;
  onClick?: () => void; className?: string;
}
export function TripAlternativeListRow({ name, accessLabel, waitMinutes, status = "open", direction = "Norte", freshnessMinutes, onClick, className = "" }: Props) {
  return (
    <button onClick={onClick} className={`w-full flex items-center justify-between min-h-[56px] px-4 py-3 bg-surface border border-border rounded-[var(--radius-md)] hover:bg-surface-elevated transition-colors text-left ${className}`}>
      <div className="min-w-0">
        <p className="text-ink text-sm font-semibold truncate">{name}{accessLabel ? ` ${accessLabel}` : ""}</p>
        <p className="text-faint text-xs truncate">{direction} · {status === "open" ? "Abierto" : status === "limited" ? "Limitado" : "Cerrado"}{freshnessMinutes != null ? ` · Actualizado ${freshnessMinutes} min` : ""}</p>
      </div>
      <div className="flex items-center gap-2 shrink-0 ml-3">
        <span className="font-display font-semibold text-ink tabular text-lg">{waitMinutes != null ? `${waitMinutes} min` : "—"}</span>
        <ChevronRight className="w-4 h-4 text-faint" />
      </div>
    </button>
  );
}
