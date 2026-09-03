"use client";

import { EmptyState } from "@/components/primitives/EmptyState";
import { groupAvisosByTime, type Aviso } from "@/lib/avisos";
import { AvisoRow } from "./AvisoRow";

interface AvisosListProps {
  avisos: Aviso[];
  onSelect?: (aviso: Aviso) => void;
  className?: string;
}

export function AvisosList({ avisos, onSelect, className = "" }: AvisosListProps) {
  if (avisos.length === 0) {
    return <EmptyState title="Sin cambios — la frontera est\u00E1 estable" description="Recibir\u00E1s notificaciones cuando los tiempos cambien." />;
  }

  const groups = groupAvisosByTime(avisos);

  return (
    <div className={`space-y-6 ${className}`}>
      {groups.map((g) => (
        <div key={g.label} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{g.label}</p>
          <div className="space-y-2">
            {g.items.map((a) => (
              <AvisoRow key={a.id} aviso={a} onClick={onSelect ? () => onSelect(a) : undefined} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
