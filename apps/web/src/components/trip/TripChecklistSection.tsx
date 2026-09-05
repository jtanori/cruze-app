"use client";

import { useTranslations } from "next-intl";
import { CheckCircle, Circle, AlertTriangle } from "lucide-react";

export interface ChecklistItem {
  id: string;
  label: string;
  status: "checked" | "unchecked" | "warning";
  detail?: string;
}

interface TripChecklistSectionProps {
  items: ChecklistItem[];
  className?: string;
  title?: string;
}

export function TripChecklistSection({ items, className = "", title }: TripChecklistSectionProps) {
  const t = useTranslations();
  const displayTitle = title || t("trip.checklist.title");

  return (
    <div className={`space-y-3 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{displayTitle}</p>
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
        {items.map((item) => (
          <div key={item.id} className="flex items-start gap-3 px-4 py-3">
            {item.status === "checked" ? (
              <CheckCircle className="w-5 h-5 text-success shrink-0 mt-0.5" />
            ) : item.status === "warning" ? (
              <AlertTriangle className="w-5 h-5 text-warning shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-5 h-5 text-muted shrink-0 mt-0.5" />
            )}
            <div>
              <p className="text-sm text-ink">{item.label}</p>
              {item.detail && <p className="text-xs text-faint mt-0.5">{item.detail}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
