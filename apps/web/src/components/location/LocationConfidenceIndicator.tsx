"use client";

import { useTranslations } from "next-intl";
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
  const t = useTranslations();
  const config: Record<LocationConfidence, { icon: typeof MapPin; color: string; labelKey: string }> = {
    unavailable: { icon: HelpCircle, color: "text-muted", labelKey: "onboarding.location.confidence.unavailable" },
    determining: { icon: MapPin, color: "text-info", labelKey: "onboarding.location.confidence.determining" },
    needs_confirmation: { icon: AlertTriangle, color: "text-warning", labelKey: "onboarding.location.confidence.needsConfirmation" },
    ready: { icon: CheckCircle, color: "text-success", labelKey: "onboarding.location.confidence.ready" },
    needs_refreshing: { icon: Clock, color: "text-warning", labelKey: "onboarding.location.confidence.needsRefreshing" },
  };

  const { icon: Icon, color, labelKey } = config[confidence];
  const label = t(labelKey);

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
