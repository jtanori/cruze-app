"use client";

import { formatDuration } from "@/lib/display";

interface CompareRow {
  id: string;
  crossingName: string;
  waitTime: number | null;
  totalJourney?: number | null;
  status: string;
}

interface CrossingsCompareTableProps {
  crossings: CompareRow[];
  onSelect?: (id: string) => void;
  className?: string;
}

export function CrossingsCompareTable({ crossings, onSelect, className = "" }: CrossingsCompareTableProps) {
  return (
    <div className={`overflow-x-auto ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Cruce</th>
            <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Espera</th>
            <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Total</th>
            <th className="py-2 px-3 text-xs font-semibold uppercase tracking-wider text-muted">Estado</th>
            {onSelect && <th className="py-2 px-3" />}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {crossings.map((c) => (
            <tr key={c.id} className="hover:bg-surface-elevated">
              <td className="py-3 px-3 font-medium text-ink">{c.crossingName}</td>
              <td className="py-3 px-3 tabular text-ink">{c.waitTime !== null ? formatDuration(c.waitTime) : "—"}</td>
              <td className="py-3 px-3 tabular text-ink">{c.totalJourney != null ? formatDuration(c.totalJourney) : "—"}</td>
              <td className="py-3 px-3 text-muted text-xs">{c.status}</td>
              {onSelect && (
                <td className="py-3 px-3">
                  <button onClick={() => onSelect(c.id)} className="text-xs font-medium text-cruze-mint hover:underline">Usar</button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
