"use client";

interface TripSetupProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function TripSetupProgress({ current, total, className = "" }: TripSetupProgressProps) {
  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div className="flex-1 h-1.5 bg-surface-elevated rounded-full overflow-hidden">
        <div
          className="h-full bg-cruze-mint rounded-full transition-all duration-300"
          style={{ width: `${(current / total) * 100}%` }}
        />
      </div>
      <span className="text-xs font-medium tabular text-muted shrink-0">
        {current}/{total}
      </span>
    </div>
  );
}
