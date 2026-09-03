import type { ReactNode } from "react";

interface CruzePageHeaderProps {
  title: string;
  subtitle?: string;
  trailing?: ReactNode;
  className?: string;
}

export function CruzePageHeader({
  title,
  subtitle,
  trailing,
  className = "",
}: CruzePageHeaderProps) {
  return (
    <div className={`flex items-start justify-between ${className}`}>
      <div className="min-w-0">
        <h1 className="text-2xl font-bold text-ink leading-tight">{title}</h1>
        {subtitle && (
          <p className="text-sm text-muted mt-1 leading-snug">{subtitle}</p>
        )}
      </div>
      {trailing && <div className="shrink-0 ml-4">{trailing}</div>}
    </div>
  );
}
