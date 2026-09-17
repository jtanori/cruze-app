"use client";

import { useTranslations } from "next-intl";

interface CrossingDetailRestrictionsSectionProps {
  restrictions: string[];
  className?: string;
}

export function CrossingDetailRestrictionsSection({ restrictions, className = "" }: CrossingDetailRestrictionsSectionProps) {
  const t = useTranslations();
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("crossings.expanded.restrictions")}</p>
      {restrictions.length === 0 ? (
        <p className="text-sm text-muted">{t("crossings.expanded.restrictionsEmpty")}</p>
      ) : (
        <ul className="space-y-1.5">
          {restrictions.map((r) => (
            <li key={r} className="text-sm text-ink flex gap-2"><span className="text-warning">•</span> {r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
