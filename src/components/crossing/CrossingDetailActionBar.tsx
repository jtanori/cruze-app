"use client";

interface CrossingDetailActionBarProps {
  onUseCrossing?: () => void;
  className?: string;
}

export function CrossingDetailActionBar({ onUseCrossing, className = "" }: CrossingDetailActionBarProps) {
  return (
    <div className={`sticky bottom-0 bg-background border-t border-border -mx-5 px-5 py-4 ${className}`}>
      <button
        onClick={onUseCrossing}
        className="w-full h-[48px] bg-cruze-mint text-midnight text-sm font-semibold rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
      >
        Usar este cruce
      </button>
    </div>
  );
}
