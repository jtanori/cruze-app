"use client";

import { useTranslations } from "next-intl";
import { formatDuration } from "@/lib/display";
import { formatFreshness } from "@/lib/format-freshness";
import { CrossingStatusBadge } from "@/components/crossing/CrossingStatusBadge";
import type { CompareRow } from "@/lib/crossings-compare";

interface CrossingsCompareTableProps {
  rows: CompareRow[];
  lastUpdatedById?: Record<string, number>;
  bothDirections?: boolean;
  onSelect?: (id: string) => void;
  className?: string;
}

/**
 * CR-CMP-01 — Comparison matrix (§31). Vertically structured rows
 * per attribute with crossing names as column headers. Matrix scrolls
 * horizontally on narrow viewports; page stays fixed. Per-row action
 * below the matrix. Winner emphasis via column tint + label.
 */
export function CrossingsCompareTable({
  rows,
  lastUpdatedById = {},
  bothDirections = true,
  onSelect,
  className = "",
}: CrossingsCompareTableProps) {
  const t = useTranslations();

  const wait = (value: number | null) =>
    value !== null ? formatDuration(value) : "—";

  const freshness = (id: string) => {
    const ts = lastUpdatedById[id];
    return ts ? formatFreshness(ts, t) : "Sin datos";
  };

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Comparison matrix — horizontal scroll contained */}
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full text-sm border-collapse min-w-[480px]">
          <thead>
            <tr>
              <th className="py-3 px-4 text-left text-xs font-semibold uppercase tracking-wider text-muted w-[120px]">
                {/* Attribute label column */}
              </th>
              {rows.map((r) => (
                <th
                  key={r.id}
                  className={`py-3 px-4 text-left ${
                    r.isWinner ? "bg-cruze-mint/[0.04]" : ""
                  }`}
                >
                  <span className="font-sora text-sm font-bold text-ink block">
                    {r.crossingName}
                  </span>
                  {r.isWinner && (
                    <span className="text-[11px] font-semibold text-cruze-mint mt-0.5 block">
                      ★ Mejor opción
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {/* Estado */}
            <tr>
              <td className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Estado
              </td>
              {rows.map((r) => (
                <td
                  key={r.id}
                  className={`py-3 px-4 ${r.isWinner ? "bg-cruze-mint/[0.04]" : ""} ${r.excluded ? "opacity-40" : ""}`}
                >
                  <CrossingStatusBadge status={r.status} />
                </td>
              ))}
            </tr>

            {/* Norte */}
            <tr>
              <td className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Norte
              </td>
              {rows.map((r) => (
                <td
                  key={r.id}
                  className={`py-3 px-4 font-sora text-sm font-bold tabular-nums ${
                    r.isWinner ? "bg-cruze-mint/[0.04]" : ""
                  } ${r.excluded ? "opacity-40" : "text-ink"}`}
                >
                  {wait(r.waitNorthbound)}
                </td>
              ))}
            </tr>

            {/* Sur */}
            {bothDirections && (
              <tr>
                <td className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                  Sur
                </td>
                {rows.map((r) => (
                  <td
                    key={r.id}
                    className={`py-3 px-4 font-sora text-sm font-bold tabular-nums ${
                      r.isWinner ? "bg-cruze-mint/[0.04]" : ""
                    } ${r.excluded ? "opacity-40" : "text-ink"}`}
                  >
                    {wait(r.waitSouthbound)}
                  </td>
                ))}
              </tr>
            )}

            {/* Distancia */}
            <tr>
              <td className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Distancia
              </td>
              {rows.map((r) => (
                <td
                  key={r.id}
                  className={`py-3 px-4 font-sora text-sm font-bold tabular-nums ${
                    r.isWinner ? "bg-cruze-mint/[0.04]" : ""
                  } ${r.excluded ? "opacity-40" : "text-ink"}`}
                >
                  {r.distanceKm !== null ? `${r.distanceKm} km` : "—"}
                </td>
              ))}
            </tr>

            {/* Datos */}
            <tr>
              <td className="py-3 px-4 text-xs font-semibold uppercase tracking-wider text-muted">
                Datos
              </td>
              {rows.map((r) => (
                <td
                  key={r.id}
                  className={`py-3 px-4 text-xs text-faint ${
                    r.isWinner ? "bg-cruze-mint/[0.04]" : ""
                  }`}
                >
                  {freshness(r.id)}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      {/* Per-row candidate actions */}
      {onSelect && (
        <div className="space-y-2">
          {rows.map((r) => (
            <div
              key={r.id}
              className={`flex items-center justify-between py-3 px-4 rounded-xl border ${
                r.excluded
                  ? "border-border opacity-40"
                  : r.isWinner
                    ? "border-cruze-mint/30 bg-cruze-mint/[0.04]"
                    : "border-border"
              }`}
            >
              <div className="min-w-0">
                <span className="font-sora text-sm font-bold text-ink block truncate">
                  {r.crossingName}
                </span>
                {r.winnerLabel && (
                  <span
                    className={`text-xs font-semibold ${
                      r.isWinner
                        ? "text-cruze-mint"
                        : r.isFastest
                          ? "text-cruze-amber"
                          : "text-muted"
                    }`}
                  >
                    {r.winnerLabel}
                  </span>
                )}
                {r.excluded && (
                  <span className="text-xs text-muted">
                    No compatible
                  </span>
                )}
              </div>
              {!r.excluded && (
                <button
                  onClick={() => onSelect(r.id)}
                  className="ml-4 shrink-0 min-h-[44px] px-4 text-sm font-semibold text-cruze-mint hover:underline"
                >
                  Usar este cruce →
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
