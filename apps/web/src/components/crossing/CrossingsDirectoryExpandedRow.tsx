"use client";

import { CrossingsDirectoryRow, type CrossingOperationalStatus } from "./CrossingsDirectoryRow";

interface LaneInfo {
  type: string;
  waitTime: number | null;
}

interface CrossingsDirectoryExpandedRowProps {
  crossingName: string;
  status: CrossingOperationalStatus;
  northboundWait: number | null;
  southboundWait: number | null;
  lanes?: LaneInfo[];
  accessTypes?: string[];
  hours?: string;
  services?: string[];
  expanded: boolean;
  onToggle: () => void;
  onViewDetail?: () => void;
  className?: string;
}

export function CrossingsDirectoryExpandedRow({
  crossingName,
  status,
  northboundWait,
  southboundWait,
  lanes = [],
  accessTypes = [],
  hours,
  services = [],
  expanded,
  onToggle,
  onViewDetail,
  className = "",
}: CrossingsDirectoryExpandedRowProps) {
  return (
    <div className={className}>
      <CrossingsDirectoryRow
        crossingName={crossingName}
        status={status}
        northboundWait={northboundWait}
        southboundWait={southboundWait}
        expanded={expanded}
        onToggle={onToggle}
      />
      {expanded && (
        <div className="bg-surface border-x border-b border-border rounded-b-[var(--radius-lg)] -mt-1 pt-1 px-4 pb-4 space-y-3">
          {lanes.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Carriles</p>
              <div className="space-y-1">
                {lanes.map((l, i) => (
                  <div key={`${l.type}-${i}`} className="flex justify-between text-sm">
                    <span className="text-muted">{l.type}</span>
                    <span className="text-ink font-medium tabular">{l.waitTime !== null ? `${l.waitTime} min` : "—"}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          {accessTypes.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Acceso</p>
              <p className="text-sm text-ink">{accessTypes.join(" · ")}</p>
            </div>
          )}
          {hours && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Horarios</p>
              <p className="text-sm text-ink">{hours}</p>
            </div>
          )}
          {services.length > 0 && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-1">Servicios</p>
              <p className="text-sm text-ink">{services.join(" · ")}</p>
            </div>
          )}
          {onViewDetail && (
            <button onClick={onViewDetail} className="w-full h-[40px] rounded-[var(--radius-md)] bg-surface-elevated border border-border text-ink text-sm font-medium">
              Ver detalle
            </button>
          )}
        </div>
      )}
    </div>
  );
}
