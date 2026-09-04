"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { Star, Share2, ArrowRight, CheckCircle } from "lucide-react";
import { useCrossingDetectionStore } from "@/stores/crossing-detection";
import { useFavoritesStore } from "@/stores/favorites";
import { formatCrossingTime, getCrossingTimeComparison } from "@/lib/crossing-estimator";

export default function CrossingSummaryPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const {
    crossingId,
    crossingName,
    estimatedCrossingTime,
    actualCrossingTime,
    confirmedAt,
    contributionSubmitted,
    setContributionSubmitted,
    reset,
  } = useCrossingDetectionStore();

  const { addFavorite, isFavorite } = useFavoritesStore();

  const comparison = actualCrossingTime
    ? getCrossingTimeComparison(estimatedCrossingTime, actualCrossingTime)
    : null;

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `CRUZE Crossing: ${crossingName}`,
          text: `Crossed at ${crossingName} in ${formatCrossingTime(actualCrossingTime || 0)}. Check wait times at crossings with CRUZE!`,
          url: window.location.origin,
        });
      } catch {
        // User cancelled or error
      }
    }
  };

  const handleContribute = () => {
    setContributionSubmitted();
  };

  const handleDone = () => {
    reset();
    router.push(`/${locale}/crossings`);
  };

  if (!crossingId || !crossingName) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-ink text-sm">{t("crossing.summary.noData")}</p>
          <button
            onClick={() => router.push(`/${locale}/crossings`)}
            className="text-cruze-green text-sm font-medium"
          >
            {t("crossing.summary.goToCrossings")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background">
      <div className="px-4 sm:px-5 py-8 space-y-4 sm:space-y-6">
        {/* Success Header */}
        <div className="text-center space-y-4">
          <div className="w-20 h-20 mx-auto flex items-center justify-center rounded-full bg-cruze-green/10">
            <CheckCircle className="w-10 h-10 text-cruze-green" />
          </div>
          <div>
            <h1 className="text-ink text-xl font-bold">{t("crossing.summary.title")}</h1>
            <p className="text-faint text-sm mt-1">{crossingName}</p>
          </div>
        </div>

        {/* Time Stats */}
        <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            <div className="text-center">
              <p className="text-faint text-xs mb-1">{t("crossing.confirm.estimated")}</p>
              <p className="text-ink text-2xl font-semibold tabular">
                {formatCrossingTime(estimatedCrossingTime)}
              </p>
            </div>
            <div className="text-center">
              <p className="text-faint text-xs mb-1">{t("crossing.confirm.actual")}</p>
              <p className="text-ink text-2xl font-semibold tabular">
                {actualCrossingTime !== null ? formatCrossingTime(actualCrossingTime) : "—"}
              </p>
            </div>
          </div>

          {comparison && (
            <div className="pt-3 border-t border-border text-center">
              <p className={`text-sm font-medium ${comparison.faster ? "text-cruze-green" : "text-caution"}`}>
                {comparison.faster ? "🟢" : "🟡"} {comparison.label}
              </p>
            </div>
          )}

          {confirmedAt && (
            <div className="pt-3 border-t border-border">
              <p className="text-faint text-xs text-center">
                {t("crossing.summary.completedAt")}: {new Date(confirmedAt).toLocaleTimeString()}
              </p>
            </div>
          )}
        </div>

        {/* Contribution Prompt */}
        {!contributionSubmitted && (
          <div className="bg-surface rounded-[var(--radius-xl)] border border-border p-5 space-y-3">
            <p className="text-ink text-sm font-medium">{t("crossing.summary.contributeTitle")}</p>
            <p className="text-faint text-xs">{t("crossing.summary.contributeDescription")}</p>
            <button
              onClick={handleContribute}
              className="w-full h-10 flex items-center justify-center gap-2 bg-surface-elevated border border-border text-ink rounded-[var(--radius-md)] text-sm font-medium active:bg-surface-subtle transition-colors"
            >
              {t("crossing.summary.contributeYes")}
            </button>
          </div>
        )}

        {contributionSubmitted && (
          <div className="bg-cruze-green/10 rounded-[var(--radius-xl)] border border-cruze-green/20 p-4 text-center">
            <p className="text-cruze-green text-sm font-medium">
              ✓ {t("crossing.summary.thanks")}
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="space-y-3">
          {!isFavorite(crossingId) && (
            <button
              onClick={() => addFavorite(crossingId)}
              className="w-full h-12 flex items-center justify-center gap-2 bg-surface border border-border text-ink rounded-[var(--radius-md)] text-sm font-medium active:bg-surface-subtle transition-colors"
            >
              <Star className="w-5 h-5" />
              {t("crossing.summary.saveFavorite")}
            </button>
          )}

          <button
            onClick={handleShare}
            className="w-full h-12 flex items-center justify-center gap-2 bg-surface border border-border text-ink rounded-[var(--radius-md)] text-sm font-medium active:bg-surface-subtle transition-colors"
          >
            <Share2 className="w-5 h-5" />
            {t("crossing.summary.share")}
          </button>

          <button
            onClick={handleDone}
            className="w-full h-12 flex items-center justify-center gap-2 bg-cruze-green text-dark rounded-[var(--radius-md)] text-sm font-medium active:bg-cruze-green/90 transition-colors"
          >
            {t("crossing.summary.done")}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
