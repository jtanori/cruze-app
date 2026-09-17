"use client";

import { useTranslations } from "next-intl";

interface CrossingDetailAccessSectionProps {
  accessTypes: string[];
  className?: string;
}

export function CrossingDetailAccessSection({ accessTypes, className = "" }: CrossingDetailAccessSectionProps) {
  const t = useTranslations();
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("crossings.expanded.access")}</p>
      <div className="flex flex-wrap gap-2">
        {accessTypes.map((a) => (
          <span key={a} className="px-4 py-2 min-h-[44px] rounded-full bg-surface border border-border text-xs font-medium text-ink">{a}</span>
        ))}
        {accessTypes.length === 0 && <span className="text-sm text-muted">—</span>}
      </div>
    </div>
  );
}
