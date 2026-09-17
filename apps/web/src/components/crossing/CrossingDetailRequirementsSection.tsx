"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp } from "lucide-react";

interface RequirementCategory {
  label: string;
  items: string[];
}

interface CrossingDetailRequirementsSectionProps {
  requirements: RequirementCategory[];
  className?: string;
}

function RequirementCategoryItem({
  category,
  defaultExpanded = false,
}: {
  category: RequirementCategory;
  defaultExpanded?: boolean;
}) {
  const [expanded, setExpanded] = useState(defaultExpanded);

  if (category.items.length === 0) return null;

  return (
    <div className="border-b border-border last:border-b-0">
      <button
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="w-full flex items-center justify-between py-3 min-h-[44px]"
      >
        <span className="text-sm font-medium text-ink">{category.label}</span>
        {expanded ? (
          <ChevronUp className="w-4 h-4 text-muted" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted" />
        )}
      </button>
      {expanded && (
        <ul className="space-y-1.5 pb-3">
          {category.items.map((item) => (
            <li key={item} className="text-sm text-ink flex gap-2 pl-2">
              <span className="text-muted">•</span> {item}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export function CrossingDetailRequirementsSection({
  requirements,
  className = "",
}: CrossingDetailRequirementsSectionProps) {
  const t = useTranslations();
  const hasAnyItems = requirements.some((c) => c.items.length > 0);

  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("crossings.expanded.requirements")}</p>
      {hasAnyItems ? (
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
          {requirements.map((category) => (
            <RequirementCategoryItem key={category.label} category={category} />
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted">{t("crossings.expanded.requirementsEmpty")}</p>
      )}
    </div>
  );
}
