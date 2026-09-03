"use client";

interface CrossingDetailMapProps {
  lat?: number;
  lng?: number;
  crossingName?: string;
  className?: string;
}

export function CrossingDetailMap({ lat, lng, crossingName, className = "" }: CrossingDetailMapProps) {
  return (
    <div className={`w-full h-48 rounded-[var(--radius-lg)] bg-surface-elevated border border-border flex flex-col items-center justify-center ${className}`}>
      <span className="text-muted text-sm">Map</span>
      {crossingName && <span className="text-faint text-xs mt-1">{crossingName}</span>}
      {lat !== undefined && lng !== undefined && <span className="text-faint text-xs">{lat.toFixed(4)}, {lng.toFixed(4)}</span>}
    </div>
  );
}
