"use client";

import type { FC } from "react";
import { useTranslations } from "next-intl";
import { Clock, TrendingUp, CheckCircle2, ArrowRight, Clock as ClockIcon, Share2, Bookmark, BookmarkCheck, Navigation as NavigationIcon } from "lucide-react";
import { formatDuration } from "@/lib/display";

interface BestCrossingCardProps {
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  reason: {
    headline: string;
    detail?: string;
  };
  generatedAt: string;
  isRecommended?: boolean;
  onStartTrip?: () => void;
  onViewDetails?: () => void;
  onToggleFavorite?: () => void;
  onShare?: () => void;
  isFavorited?: boolean;
  showCTA?: boolean;
  ctaText?: string;
  variant?: "full" | "compact";
  showRecommendationBadge?: boolean;
  showLiveStatus?: boolean;
  customBadgeText?: string;
  showFreshness?: boolean;
}

const BestCrossingCard: FC<BestCrossingCardProps> = ({
  crossingName,
  mexicanCity,
  usCity,
  waitTime,
  totalJourneyTime,
  reason,
  generatedAt,
  isRecommended = true,
  onStartTrip,
  onViewDetails,
  onToggleFavorite,
  onShare,
  isFavorited = false,
  showCTA = true,
  ctaText,
  variant = "full",
  showRecommendationBadge = true,
  showLiveStatus = true,
  customBadgeText,
  showFreshness = true,
}) => {
  const t = useTranslations();

  if (variant === "compact") {
    return (
      <div className={`bg-surface border rounded-[var(--radius-lg)] overflow-hidden ${isRecommended ? "border-cruze-green/30" : "border-border"}`}>
        <div className="px-4 py-3 space-y-2">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              <p className="text-faint text-xs uppercase tracking-wider mb-1">
                {t("onboarding.recommendation.bestCrossingNow")}
              </p>
              <h3 className="text-ink text-lg font-bold truncate">{crossingName}</h3>
              <p className="text-faint text-xs">
                {mexicanCity}, MX ↔ {usCity}, US
              </p>
            </div>
            {showRecommendationBadge && isRecommended && (
              <span className="text-cruze-green text-xs font-medium shrink-0">
                ● {t("onboarding.recommendation.recommended")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <div className="flex items-center gap-1">
              <ClockIcon className="w-4 h-4 text-faint" />
              <span className="text-ink text-xl font-bold tabular">
                {formatDuration(waitTime)}
              </span>
            </div>
            <div className="flex items-center gap-1 border-l border-border pl-4">
              <TrendingUp className="w-4 h-4 text-faint" />
              <span className="text-ink text-xl font-bold tabular">
                {formatDuration(totalJourneyTime)}
              </span>
            </div>
          </div>

          {showLiveStatus && (
            <div className="flex items-center gap-2 text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-cruze-green" />
              <span className="text-cruze-green font-semibold uppercase tracking-wider">
                {t("common.live")}
              </span>
            </div>
          )}

          {showCTA && onStartTrip && (
            <button
              onClick={onStartTrip}
              className="w-full h-[44px] flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
            >
              <NavigationIcon className="w-4 h-4" />
              {ctaText || t("onboarding.recommendation.startTrip")}
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className={`bg-surface border rounded-[var(--radius-lg)] overflow-hidden ${isRecommended ? "border-cruze-green/30" : "border-border"}`}>
      <div className="px-4 py-4 space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            {showRecommendationBadge && isRecommended && (
              <p className="text-faint text-xs uppercase tracking-wider mb-1">
                {t("onboarding.recommendation.bestCrossingNow")}
              </p>
            )}
            <h2 className="text-ink text-lg font-bold truncate">{crossingName}</h2>
            <p className="text-faint text-xs">
              {mexicanCity}, MX ↔ {usCity}, US
            </p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            {onToggleFavorite && (
              <button
                onClick={onToggleFavorite}
                className="w-9 h-9 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                aria-label="Bookmark"
              >
                <BookmarkCheck className="w-5 h-5 text-cruze-green" />
              </button>
            )}
            {onShare && (
              <button
                onClick={onShare}
                className="w-9 h-9 flex items-center justify-center rounded-full active:bg-surface-elevated transition-colors"
                aria-label="Share"
              >
                <Share2 className="w-5 h-5 text-ink" />
              </button>
            )}
          </div>
        </div>

        {/* Live Status */}
        {showLiveStatus && (
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-cruze-green" />
            <span className="text-cruze-green text-xs font-semibold uppercase tracking-wider">
              {t("common.live")}
            </span>
            {showFreshness && (
              <span className="text-faint text-xs">
                {t("shared.updatedMinAgo", {
                  minutes: Math.floor(
                    (Date.now() - new Date(generatedAt).getTime()) / 60000
                  ),
                })}
              </span>
            )}
          </div>
        )}

        {/* Journey Metrics */}
        <div className="flex gap-0">
          <div className="flex items-center gap-3 p-3 bg-surface-raised rounded-[var(--radius-md)] flex-1 min-w-0">
            <Clock className="w-5 h-5 text-faint shrink-0" />
            <div className="min-w-0">
              <span className="text-ink text-xl font-bold tabular truncate">
                {formatDuration(waitTime)}
              </span>
              <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.borderWait")}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 bg-surface-raised rounded-[var(--radius-md)] flex-1 min-w-0 border-l border-border">
            <TrendingUp className="w-5 h-5 text-faint shrink-0" />
            <div className="min-w-0">
              <span className="text-ink text-xl font-bold tabular truncate">
                {formatDuration(totalJourneyTime)}
              </span>
              <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.totalJourney")}</p>
            </div>
          </div>

          <div className="w-px bg-border mx-2" />
        </div>

        {/* Why this one */}
        <div className="flex items-start gap-2 pt-2">
          <CheckCircle2 className="w-4 h-4 text-cruze-green mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-muted font-medium">{reason.headline}</p>
            {reason.detail && (
              <p className="text-xs text-faint mt-0.5">
                {reason.detail}
              </p>
            )}
          </div>
        </div>

        {/* Freshness */}
        {showFreshness && (
          <p className="text-faint text-xs">
            {t("shared.updatedMinAgo", {
              minutes: Math.floor(
                (Date.now() - new Date(generatedAt).getTime()) / 60000
              ),
            })}
          </p>
        )}

        {/* CTA */}
        {showCTA && onStartTrip && (
          <button
            onClick={onStartTrip}
            className="w-full h-[44px] flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-[var(--radius-md)] text-white text-sm font-semibold transition-colors"
          >
            {ctaText || t("onboarding.recommendation.startTrip")}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {onViewDetails && !showCTA && (
          <button
            onClick={onViewDetails}
            className="w-full h-[44px] flex items-center justify-center gap-2 bg-surface-elevated border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium active:bg-surface-subtle transition-colors"
          >
            {t("crossings.viewDetails")}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default BestCrossingCard;