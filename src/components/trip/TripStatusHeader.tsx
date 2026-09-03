"use client";

interface TripStatusHeaderProps {
  originLabel: string;
  destinationLabel: string;
  className?: string;
}

export function TripStatusHeader({ originLabel, destinationLabel, className = "" }: TripStatusHeaderProps) {
  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">MI VIAJE</p>
      <div className="flex items-center gap-2 text-sm">
        <span className="text-ink font-medium">{originLabel}</span>
        <span className="text-faint">{"\u2193"}</span>
        <span className="text-ink font-medium">{destinationLabel}</span>
      </div>
    </div>
  );
}
