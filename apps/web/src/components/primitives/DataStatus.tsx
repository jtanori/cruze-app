import type { ReactNode } from "react";

type Status = "operational" | "limited" | "closed" | "unknown";

interface DataStatusProps {
  status: Status;
  label?: string;
  showDot?: boolean;
  size?: "sm" | "md";
  className?: string;
}

const statusConfig: Record<Status, { color: string; dot: string; label: string }> = {
  operational: { color: "text-success", dot: "bg-success", label: "Operational" },
  limited: { color: "text-warning", dot: "bg-warning", label: "Limited" },
  closed: { color: "text-danger", dot: "bg-danger", label: "Closed" },
  unknown: { color: "text-muted", dot: "bg-muted", label: "Unknown" },
};

export function DataStatus({
  status,
  label,
  showDot = true,
  size = "md",
  className = "",
}: DataStatusProps) {
  const config = statusConfig[status];
  const displayLabel = label || config.label;

  const sizeClasses = {
    sm: "text-xs",
    md: "text-sm",
  };

  return (
    <span className={`inline-flex items-center gap-2 ${sizeClasses[size]} ${className}`}>
      {showDot && (
        <span className={`w-2 h-2 rounded-full ${config.dot} shrink-0`} />
      )}
      <span className={`font-medium ${config.color}`}>{displayLabel}</span>
    </span>
  );
}
