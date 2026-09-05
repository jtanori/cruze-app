"use client";

import { EmptyState } from "@/components/primitives/EmptyState";
import { groupAvisosByTime, type Aviso } from "@/lib/avisos";
import { AvisoRow } from "./AvisoRow";
import { useTranslations } from "next-intl";

interface AvisosListProps {
  avisos: Aviso[];
  onSelect?: (aviso: Aviso) => void;
  className?: string;
}

export function AvisosList({ avisos, onSelect, className = "" }: AvisosListProps) {
  const t = useTranslations();
  if (avisos.length === 0) {
    return <EmptyState title={t("alerts.empty")} description={t("alerts.emptyDescription")} />;
  }

  const groups = groupAvisosByTime(avisos);

  return (
    <div className={`space-y-4 sm:space-y-6 ${className}`}>
      {groups.map((g) => (
        <div key={g.labelKey} className="space-y-3">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t(g.labelKey)}</p>
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
