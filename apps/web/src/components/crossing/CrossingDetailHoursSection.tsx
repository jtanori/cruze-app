"use client";

import { useTranslations } from "next-intl";

interface CrossingDetailHoursSectionProps {
  hours: string;
  note?: string;
  className?: string;
}

export function CrossingDetailHoursSection({ hours, note, className = "" }: CrossingDetailHoursSectionProps) {
  const t = useTranslations();
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("crossings.expanded.hours")}</p>
      <p className="text-sm text-ink">{hours}</p>
      {note && <p className="text-xs text-faint">{note}</p>}
    </div>
  );
}
