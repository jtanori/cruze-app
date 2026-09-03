import type { ReactNode } from "react";

interface DataMetricProps {
  label: string;
  value: string | number;
  unit?: string;
  size?: "sm" | "md" | "lg";
  unavailable?: boolean;
  icon?: ReactNode;
  className?: string;
}

export function DataMetric({
  label,
  value,
  unit,
  size = "md",
  unavailable = false,
  icon,
  className = "",
}: DataMetricProps) {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-2xl font-bold",
    lg: "text-3xl font-extrabold",
  };

  return (
    <div className={`flex flex-col ${className}`}>
      <span className="text-muted text-xs font-medium uppercase tracking-wide mb-1">
        {label}
      </span>
      <div className="flex items-baseline gap-1.5">
        {icon && <span className="text-muted shrink-0">{icon}</span>}
        {unavailable ? (
          <span className="text-muted text-sm italic">—</span>
        ) : (
          <>
            <span className={`${sizeClasses[size]} text-ink`}>{value}</span>
            {unit && <span className="text-muted text-sm">{unit}</span>}
          </>
        )}
      </div>
    </div>
  );
}
