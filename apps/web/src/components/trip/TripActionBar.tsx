"use client";

import { Navigation, Eye, GitCompare, Settings, Flag } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

interface TripActionBarProps {
  onNavigate?: () => void;
  onViewCrossing?: () => void;
  onCompare?: () => void;
  onConfigure?: () => void;
  onComplete?: () => void;
  className?: string;
}

export function TripActionBar({ onNavigate, onViewCrossing, onCompare, onConfigure, onComplete, className = "" }: TripActionBarProps) {
  return (
    <div className={`space-y-3 ${className}`}>
      <div className="flex gap-3">
        {onNavigate && (
          <button onClick={() => { trackEvent("trip_action_navigate"); onNavigate?.(); }} className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-cruze-mint text-midnight text-sm font-semibold rounded-[var(--radius-lg)]">
            <Navigation className="w-4 h-4" /> Navegar
          </button>
        )}
        {onViewCrossing && (
          <button onClick={() => { trackEvent("trip_action_view_crossing"); onViewCrossing?.(); }} className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-lg)]">
            <Eye className="w-4 h-4" /> Ver cruce
          </button>
        )}
      </div>
      <div className="flex gap-2">
        {onCompare && (
          <button onClick={() => { trackEvent("trip_action_compare"); onCompare?.(); }} className="flex-1 h-[40px] flex items-center justify-center gap-1.5 bg-surface-elevated border border-border text-ink text-xs font-medium rounded-[var(--radius-md)]">
            <GitCompare className="w-3.5 h-3.5" /> Comparar
          </button>
        )}
        {onConfigure && (
          <button onClick={() => { trackEvent("trip_action_configure"); onConfigure?.(); }} className="flex-1 h-[40px] flex items-center justify-center gap-1.5 bg-surface-elevated border border-border text-ink text-xs font-medium rounded-[var(--radius-md)]">
            <Settings className="w-3.5 h-3.5" /> Configurar
          </button>
        )}
        {onComplete && (
          <button onClick={() => { trackEvent("trip_action_complete"); onComplete?.(); }} className="flex-1 h-[40px] flex items-center justify-center gap-1.5 text-muted text-xs font-medium">
            <Flag className="w-3.5 h-3.5" /> Finalizar
          </button>
        )}
      </div>
    </div>
  );
}
