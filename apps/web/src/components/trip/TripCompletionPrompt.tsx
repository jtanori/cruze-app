"use client";

import { useTranslations } from "next-intl";

interface TripCompletionPromptProps {
  originLabel: string;
  destinationLabel: string;
  crossingName: string;
  onSave: () => void;
  onDone: () => void;
  className?: string;
}

export function TripCompletionPrompt({ originLabel, destinationLabel, crossingName, onSave, onDone, className = "" }: TripCompletionPromptProps) {
  const t = useTranslations();

  return (
    <div className={`bg-surface border border-border rounded-[var(--radius-lg)] p-6 space-y-4 text-center ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">{t("trip.completion.title")}</p>
      <p className="text-ink font-medium">{originLabel} → {destinationLabel}</p>
      <div className="py-2">
        <p className="text-xs text-muted">{t("trip.completion.crossingLabel")}</p>
        <p className="text-ink font-bold text-lg">{crossingName}</p>
      </div>
      <div className="space-y-3">
        <button onClick={onSave} className="w-full h-[48px] bg-cruze-mint text-midnight text-sm font-semibold rounded-[var(--radius-lg)]">
          {t("trip.completion.save")}
        </button>
        <button onClick={onDone} className="w-full h-[44px] bg-surface-elevated border border-border text-ink text-sm font-medium rounded-[var(--radius-lg)]">
          {t("trip.completion.done")}
        </button>
      </div>
    </div>
  );
}
