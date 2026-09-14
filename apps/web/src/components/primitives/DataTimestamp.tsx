import { Clock } from "lucide-react";

type FreshnessState = "live" | "recent" | "stale" | "very_stale" | "unavailable";

interface FreshnessConfig {
  label: string;
  color: string;
  iconColor: string;
}

const freshnessConfig: Record<FreshnessState, FreshnessConfig> = {
  live: { label: "Ahora", color: "text-success", iconColor: "text-success" },
  recent: { label: "", color: "text-muted", iconColor: "text-muted" },
  stale: { label: "Datos desactualizados", color: "text-warning", iconColor: "text-warning" },
  very_stale: { label: "Datos muy antiguos", color: "text-danger", iconColor: "text-danger" },
  unavailable: { label: "Sin datos", color: "text-muted", iconColor: "text-muted" },
};

function getFreshness(timestamp: string | Date | null): FreshnessState {
  if (!timestamp) return "unavailable";
  const date = typeof timestamp === "string" ? new Date(timestamp) : timestamp;
  if (isNaN(date.getTime())) return "unavailable";

  const diffMs = Date.now() - date.getTime();
  const diffMin = diffMs / 60000;

  if (diffMin <= 5) return "live";
  if (diffMin <= 20) return "recent";
  if (diffMin <= 60) return "stale";
  return "very_stale";
}

interface DataTimestampProps {
  timestamp: string | Date | null;
  showLabel?: boolean;
  className?: string;
}

export function DataTimestamp({
  timestamp,
  showLabel = true,
  className = "",
}: DataTimestampProps) {
  const freshness = getFreshness(timestamp);
  const config = freshnessConfig[freshness];

  const formatRelative = (d: Date) => {
    const diffMs = Date.now() - d.getTime();
    const diffMin = Math.floor(diffMs / 60000);
    if (diffMin < 1) return "Ahora";
    if (diffMin === 1) return "Hace 1 min";
    if (diffMin < 60) return `Hace ${diffMin} min`;
    const diffH = Math.floor(diffMin / 60);
    if (diffH === 1) return "Hace 1 hora";
    return `Hace ${diffH} horas`;
  };

  const date = timestamp ? (typeof timestamp === "string" ? new Date(timestamp) : timestamp) : null;
  const relativeText = date ? formatRelative(date) : "";

  // Normalized vocabulary: live/recent show relative time only
  // ("Ahora", "Hace X min"); stale+ show their status label only.
  // No "en vivo" anywhere; freshness never implies liveness.
  const showRelativeOnly = freshness === "live" || freshness === "recent";
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs ${config.color} ${className}`}>
      <Clock className={`w-3.5 h-3.5 ${config.iconColor}`} />
      {showLabel && !showRelativeOnly && (
        <span className="font-medium">{config.label}</span>
      )}
      {showRelativeOnly && <span>{relativeText}</span>}
    </span>
  );
}
