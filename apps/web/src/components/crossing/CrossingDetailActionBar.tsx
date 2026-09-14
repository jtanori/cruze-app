"use client";

import { useTranslations } from "next-intl";

interface CrossingDetailActionBarProps {
  onUseCrossing?: () => void;
  onCompare?: () => void;
  className?: string;
}

/**
 * CR-DET-10 — in-flow decision group (NOT a fixed dock).
 * Primary gets the button; secondary is a text action.
 * Lives in page flow inside the canonical content inset.
 */
export function CrossingDetailActionBar({ onUseCrossing, onCompare, className = "" }: CrossingDetailActionBarProps) {
  const t = useTranslations();

  return (
    <div className={`space-y-3 ${className}`}>
      <button
        onClick={onUseCrossing}
        className="w-full h-12 px-4 bg-cruze-mint text-midnight text-sm font-semibold rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
      >
        Usar este cruce
      </button>
      {onCompare && (
        <button
          onClick={onCompare}
          className="w-full min-h-[44px] flex items-center justify-center text-sm font-medium text-faint hover:text-ink transition-colors"
        >
          {t("crossing.compareAction")}
        </button>
      )}
    </div>
  );
}
