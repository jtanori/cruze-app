import type { ReactNode } from "react";

interface DataMetricPairProps {
  label: string;
  primary: string | number;
  secondary: string | number;
  primaryUnit?: string;
  secondaryUnit?: string;
  icon?: ReactNode;
  className?: string;
}

export function DataMetricPair({
  label,
  primary,
  secondary,
  primaryUnit,
  secondaryUnit,
  icon,
  className = "",
}: DataMetricPairProps) {
  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-muted text-xs font-medium uppercase tracking-wide mb-1">
        {label}
      </span>
      <div className="flex items-center gap-3">
        {icon && <span className="text-muted shrink-0">{icon}</span>}
        <div className="flex items-baseline gap-1">
          <span className="text-2xl font-bold text-ink">{primary}</span>
          {primaryUnit && <span className="text-muted text-sm">{primaryUnit}</span>}
        </div>
        <span className="text-border">/</span>
        <div className="flex items-baseline gap-1">
          <span className="text-lg font-semibold text-muted">{secondary}</span>
          {secondaryUnit && <span className="text-muted text-xs">{secondaryUnit}</span>}
        </div>
      </div>
    </div>
  );
}
