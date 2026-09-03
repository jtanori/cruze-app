"use client";

import { MapPin, AlertTriangle, CheckCircle, Clock, HelpCircle } from "lucide-react";
import type { LocationConfidence } from "@/lib/location-state-machine";

interface LocationConfidenceIndicatorProps {
  confidence: LocationConfidence;
  accuracy?: number;
  className?: string;
  compact?: boolean;
}

export function LocationConfidenceIndicator({
  confidence,
  accuracy,
  className = "",
  compact = false,
}: LocationConfidenceIndicatorProps) {
  const config: Record<LocationConfidence, { icon: typeof MapPin; color: string; label: string }> = {
    unavailable: { icon: HelpCircle, color: "text-muted", label: "Location unavailable" },
    determining: { icon: MapPin, color: "text-info", label: "Location being determined" },
    needs_confirmation: { icon: AlertTriangle, color: "text-warning", label: "Location needs confirmation" },
    ready: { icon: CheckCircle, color: "text-success", label: "Location ready" },
    needs_refreshing: { icon: Clock, color: "text-warning", label: "Location needs refreshing" },
  };

  const { icon: Icon, color, label } = config[confidence];

  if (compact) {
    return (
      <span className={`inline-flex items-center gap-1.5 ${className}`}>
        <Icon className={`w-4 h-4 ${color}`} />
        {accuracy !== undefined && (
          <span className="text-xs text-muted">±{Math.round(accuracy)}m</span>
        )}
      </span>
    );
  }

  return (
    <div className={`flex items-center gap-2 px-3 py-2 rounded-[var(--radius-lg)] bg-surface border border-border ${className}`}>
      <Icon className={`w-4 h-4 ${color} shrink-0`} />
      <span className="text-sm text-ink font-medium">{label}</span>
      {accuracy !== undefined && (
        <span className="text-xs text-muted ml-auto">±{Math.round(accuracy)}m</span>
      )}
    </div>
  );
}
