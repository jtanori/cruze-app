import { Clock } from "lucide-react";

interface DataTimestampProps {
  timestamp: string | Date;
  variant?: "compact" | "verbose";
  stale?: boolean;
  staleThresholdMs?: number;
  className?: string;
}

export function DataTimestamp({
  timestamp,
  variant = "compact",
  stale,
  staleThresholdMs = 300000,
  className = "",
}: DataTimestampProps) {
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  const isStale = stale ?? (Date.now() - date.getTime() > staleThresholdMs);

  const formatCompact = (d: Date) => {
    const h = d.getHours().toString().padStart(2, "0");
    const m = d.getMinutes().toString().padStart(2, "0");
    return `${h}:${m}`;
  };

  const formatVerbose = (d: Date) => {
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
    });
  };

  const formatted = variant === "compact" ? formatCompact(date) : formatVerbose(date);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs ${isStale ? "text-warning" : "text-muted"} ${className}`}
    >
      <Clock className="w-3.5 h-3.5" />
      <span>{formatted}</span>
      {isStale && <span className="font-medium">(stale)</span>}
    </span>
  );
}
