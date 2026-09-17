"use client";

import { useTranslations } from "next-intl";

interface CrossingDetailServicesSectionProps {
  services: string[];
  className?: string;
}

export function CrossingDetailServicesSection({ services, className = "" }: CrossingDetailServicesSectionProps) {
  const t = useTranslations();
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("crossings.expanded.services")}</p>
      {services.length === 0 ? (
        <p className="text-sm text-muted">—</p>
      ) : (
        <div className="flex flex-wrap gap-2">
          {services.map((s) => (
            <span key={s} className="px-2.5 py-1 rounded-full bg-surface-elevated border border-border text-xs text-ink">{s}</span>
          ))}
        </div>
      )}
    </div>
  );
}
