"use client";

import { MapPin, AlertTriangle, Clock, RefreshCw } from "lucide-react";
import type { LocationState } from "@/lib/location-state-machine";

interface LocationStatusBannerProps {
  state: LocationState;
  onRetry?: () => void;
  className?: string;
}

export function LocationStatusBanner({
  state,
  onRetry,
  className = "",
}: LocationStatusBannerProps) {
  if (state === "ready") return null;

  const config: Partial<Record<LocationState, { icon: typeof MapPin; color: string; bg: string; label: string; action?: string }>> = {
    uninitialized: { icon: MapPin, color: "text-muted", bg: "bg-surface", label: "Initializing location..." },
    requesting_permission: { icon: MapPin, color: "text-info", bg: "bg-info/10", label: "Requesting location permission" },
    permission_denied: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", label: "Location permission denied", action: "Retry" },
    services_disabled: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", label: "Location services disabled", action: "Enable" },
    acquiring: { icon: MapPin, color: "text-info", bg: "bg-info/10", label: "Acquiring location..." },
    low_confidence: { icon: AlertTriangle, color: "text-warning", bg: "bg-warning/10", label: "Low confidence location", action: "Refine" },
    stale: { icon: Clock, color: "text-warning", bg: "bg-warning/10", label: "Location needs refreshing", action: "Refresh" },
    unavailable: { icon: AlertTriangle, color: "text-danger", bg: "bg-danger/10", label: "Location unavailable", action: "Retry" },
  };

  const current = config[state];
  if (!current) return null;

  const Icon = current.icon;

  return (
    <div className={`flex items-center gap-3 px-4 py-3 rounded-[var(--radius-lg)] border ${current.bg} border-border ${className}`}>
      <Icon className={`w-4 h-4 ${current.color} shrink-0`} />
      <span className={`text-sm font-medium ${current.color} flex-1`}>{current.label}</span>
      {current.action && onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-[var(--radius-md)] bg-surface border border-border text-xs font-semibold text-ink hover:bg-surface-elevated transition-colors min-h-[32px]"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          {current.action}
        </button>
      )}
    </div>
  );
}
