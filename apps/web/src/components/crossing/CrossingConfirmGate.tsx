"use client";

import { useTranslations } from "next-intl";
import { Check, X, Clock, MapPin } from "lucide-react";
import { useCrossingDetectionStore } from "@/stores/crossing-detection";
import { formatCrossingTime, getCrossingTimeComparison } from "@/lib/crossing-estimator";

export function CrossingConfirmGate() {
  const t = useTranslations();
  const {
    crossingName,
    estimatedCrossingTime,
    actualCrossingTime,
    confirmedAt,
    confirmCrossing,
    dismissConfirmation,
  } = useCrossingDetectionStore();

  if (!crossingName) return null;

  const comparison = actualCrossingTime
    ? getCrossingTimeComparison(estimatedCrossingTime, actualCrossingTime)
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-sm">
      <div className="w-full mx-4 bg-surface rounded-[var(--radius-xl)] border border-border shadow-xl overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 pt-6 pb-4 text-center">
          <div className="w-16 h-16 mx-auto mb-3 sm:mb-4 flex items-center justify-center rounded-full bg-cruze-green/10">
            <Check className="w-8 h-8 text-cruze-green" />
          </div>
          <h2 className="text-ink text-lg font-semibold">
            {t("crossing.confirm.title")}
          </h2>
          <p className="text-faint text-sm mt-1">
            {crossingName}
          </p>
        </div>

        {/* Stats */}
        <div className="px-4 sm:px-6 pb-4">
          <div className="bg-surface-elevated rounded-[var(--radius-md)] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-faint text-sm">
                <Clock className="w-4 h-4" />
                {t("crossing.confirm.estimated")}
              </div>
              <span className="text-ink text-sm font-medium">
                {formatCrossingTime(estimatedCrossingTime)}
              </span>
            </div>

            {actualCrossingTime !== null && (
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-faint text-sm">
                  <MapPin className="w-4 h-4" />
                  {t("crossing.confirm.actual")}
                </div>
                <span className="text-ink text-sm font-medium">
                  {formatCrossingTime(actualCrossingTime)}
                </span>
              </div>
            )}

            {comparison && (
              <div className="pt-2 border-t border-border">
                <p className={`flex items-center gap-2 text-sm font-medium ${comparison.faster ? "text-cruze-green" : "text-caution"}`}>
                  <span aria-hidden="true" className={`w-2 h-2 rounded-full shrink-0 ${comparison.faster ? "bg-cruze-green" : "bg-caution"}`} />
                  {t(comparison.faster ? "crossing.confirm.fasterThanExpected" : "crossing.confirm.slowerThanExpected", { minutes: comparison.diff })}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="px-4 sm:px-6 pb-6 space-y-3">
          <button
            onClick={confirmCrossing}
            className="w-full h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark rounded-[var(--radius-md)] font-medium text-sm active:bg-cruze-green/90 transition-colors"
          >
            <Check className="w-5 h-5" />
            {t("crossing.confirm.yes")}
          </button>

          <button
            onClick={dismissConfirmation}
            className="w-full h-12 flex items-center justify-center gap-2 bg-surface border border-border text-ink rounded-[var(--radius-md)] font-medium text-sm active:bg-surface-subtle transition-colors"
          >
            <X className="w-5 h-5" />
            {t("crossing.confirm.no")}
          </button>
        </div>
      </div>
    </div>
  );
}
