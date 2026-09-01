"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { ArrowRight, CheckCircle2, Clock, TrendingUp, ChevronDown, ChevronUp } from "lucide-react";
import { useTripStore } from "@/stores/trip";
import { detectTripType, deriveDirection } from "@/lib/border-data";
import { recommendCrossing } from "@/lib/recommendation";
import { getDisplayName, formatDuration } from "@/lib/display";
import { useTranslations } from "next-intl";
import type { CrossingRecommendation } from "@/types";

interface RecommendationViewProps {
  onStartTrip: () => void;
  onSeeAllCrossings: () => void;
}

export function RecommendationView({
  onStartTrip,
  onSeeAllCrossings,
}: RecommendationViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const start = useTripStore((s) => s.start);
  const destination = useTripStore((s) => s.destination);
  const setTripType = useTripStore((s) => s.setTripType);
  const setDirection = useTripStore((s) => s.setDirection);
  const setRecommendedCrossing = useTripStore((s) => s.setRecommendedCrossing);
  const complete = useTripStore((s) => s.complete);

  const [recommendation, setRecommendation] =
    useState<CrossingRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [expandedAlt, setExpandedAlt] = useState<string | null>(null);

  useEffect(() => {
    if (!start || !destination) return;

    const tripType = detectTripType(start, destination);
    setTripType(tripType);

    if (tripType !== "cross_border") {
      setLoading(false);
      return;
    }

    const direction = deriveDirection(start, destination);
    setDirection(direction);

    if (!direction) {
      setLoading(false);
      return;
    }

    recommendCrossing({ start, destination, direction }).then((rec) => {
      setRecommendation(rec);
      setRecommendedCrossing(rec);
      setLoading(false);
    });
  }, [
    start,
    destination,
    setTripType,
    setDirection,
    setRecommendedCrossing,
  ]);

  const handleStartTrip = () => {
    complete();
    if (recommendation) {
      router.push(`/crossing/${recommendation.crossingId}`);
    } else {
      onStartTrip();
    }
  };

  const handleSeeAll = () => {
    complete();
    onSeeAllCrossings();
  };

  if (!start || !destination) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const tripType = detectTripType(start, destination);

  if (tripType === "same_country") {
    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-ink text-xl font-bold">{t("onboarding.recommendation.notBorderTrip")}</h1>
          <p className="text-muted text-sm">
            {t("onboarding.recommendation.notBorderTripDescription")}
          </p>
        </div>

        <div className="bg-surface border border-border rounded-[var(--radius-md)] px-4 py-5 space-y-3">
          <p className="text-muted text-sm">
            {t("onboarding.recommendation.notBorderTripExplanation")}
          </p>
          <p className="text-faint text-xs">
            {t("common.cruze")} {getDisplayName(start)} → {getDisplayName(destination)} {start.country === "US" ? t("onboarding.destination.unitedStates") : t("onboarding.destination.mexico")}
          </p>
        </div>

        <button
          onClick={() => window.history.back()}
          className="w-full h-[44px] flex items-center justify-center gap-2 bg-surface-elevated border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium active:bg-surface-subtle transition-colors"
        >
          {t("onboarding.recommendation.goBack")}
        </button>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-ink text-xl font-bold">
            {t("onboarding.recommendation.analyzing")}
          </h1>
          <p className="text-muted text-sm">
            {t("onboarding.recommendation.analyzingDescription")}
          </p>
        </div>

        <div className="flex items-center justify-center py-12">
          <div className="w-8 h-8 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  if (!recommendation) {
    return (
      <div className="w-full space-y-8">
        <div className="space-y-2">
          <h1 className="text-ink text-xl font-bold">{t("onboarding.recommendation.noCrossingFound")}</h1>
          <p className="text-muted text-sm">
            {t("onboarding.recommendation.noCrossingDescription")}
          </p>
        </div>
      </div>
    );
  }

  const getFreshnessLabel = (generatedAt: string) => {
    const diff = Date.now() - new Date(generatedAt).getTime();
    const mins = Math.floor(diff / 60000);
    return t("shared.updatedMinAgo", { minutes: mins });
  };

  return (
    <div className="w-full space-y-6">
      {/* Route header */}
      <div className="space-y-1">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-muted">{getDisplayName(start)}</span>
          <span className="text-faint">→</span>
          <span className="text-ink font-medium">{getDisplayName(destination)}</span>
        </div>
        <h1 className="text-ink text-xl font-bold">
          {t("onboarding.recommendation.bestCrossing")}
        </h1>
      </div>

      {/* Primary recommendation */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-faint text-xs uppercase tracking-wider mb-1">
              {t("onboarding.recommendation.bestCrossingNow")}
            </p>
            <h2 className="text-ink text-lg font-bold">
              {recommendation.crossingName}
            </h2>
            <p className="text-faint text-xs">
              {recommendation.mexicanCity}, MX ↔ {recommendation.usCity}, AZ
            </p>
          </div>
          <span className="text-cruze-green text-xs font-medium">
            ● {t("onboarding.recommendation.recommended")}
          </span>
        </div>

        <div className="flex items-center gap-6">
          <div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-faint" />
              <span className="text-ink text-2xl font-bold tabular">
                {formatDuration(recommendation.waitTime)}
              </span>
            </div>
            <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.borderWait")}</p>
          </div>
          <div className="w-px h-8 bg-border" />
          <div>
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-faint" />
              <span className="text-ink text-2xl font-bold tabular">
                {formatDuration(recommendation.totalJourneyTime)}
              </span>
            </div>
            <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.totalJourney")}</p>
          </div>
        </div>

        <div className="flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-cruze-green mt-0.5 shrink-0" />
          <div>
            <p className="text-sm text-muted font-medium">{recommendation.reason.headline}</p>
            {recommendation.reason.detail && (
              <p className="text-xs text-faint mt-0.5">
                {recommendation.reason.detail}
              </p>
            )}
          </div>
        </div>

        <p className="text-faint text-xs">
          {getFreshnessLabel(recommendation.generatedAt)}
        </p>

        <button
          onClick={handleStartTrip}
          className="w-full h-[44px] flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-[var(--radius-md)] text-white text-sm font-semibold transition-colors"
        >
          {t("onboarding.recommendation.startTrip")}
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Alternatives */}
      {recommendation.alternatives.length > 0 && (
        <div className="space-y-3">
          <h3 className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("onboarding.recommendation.otherOptions")}
          </h3>
          {recommendation.alternatives.map((alt) => {
            const isExpanded = expandedAlt === alt.crossingId;
            return (
              <div
                key={alt.crossingId}
                className="bg-surface border border-border rounded-[var(--radius-md)] overflow-hidden"
              >
                <button
                  onClick={() => setExpandedAlt(isExpanded ? null : alt.crossingId)}
                  className="w-full flex items-center justify-between px-4 py-3 text-left"
                >
                  <div>
                    <p className="text-ink text-sm font-medium">
                      {alt.crossingName}
                    </p>
                    <p className="text-faint text-xs">
                      {alt.mexicanCity}, MX ↔ {alt.usCity}, AZ
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-caution text-xs font-medium tabular">
                      +{alt.deltaMinutes} {t("common.min")}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-faint" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-faint" />
                    )}
                  </div>
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 pt-2 border-t border-border space-y-3">
                    <div className="flex items-center gap-6">
                      <div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4 text-faint" />
                          <span className="text-ink text-xl font-bold tabular">
                            {formatDuration(alt.waitTime)}
                          </span>
                        </div>
                        <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.borderWait")}</p>
                      </div>
                      <div className="w-px h-6 bg-border" />
                      <div>
                        <div className="flex items-center gap-1">
                          <TrendingUp className="w-4 h-4 text-faint" />
                          <span className="text-ink text-xl font-bold tabular">
                            {formatDuration(alt.totalJourneyTime)}
                          </span>
                        </div>
                        <p className="text-faint text-xs mt-0.5">{t("onboarding.recommendation.totalJourney")}</p>
                      </div>
                    </div>
                    <p className="text-faint text-xs">
                      +{alt.deltaMinutes} {t("common.min")} vs. recommended
                    </p>
                    <p className="text-faint text-xs">
                      {getFreshnessLabel(recommendation.generatedAt)}
                    </p>
                    <button
                      onClick={handleStartTrip}
                      className="w-full h-[40px] flex items-center justify-center gap-2 bg-surface-elevated border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium active:bg-surface-subtle transition-colors"
                    >
                      {t("onboarding.recommendation.startTrip")}
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* See all crossings */}
      <button
        onClick={handleSeeAll}
        className="w-full text-center text-muted text-sm font-medium hover:text-ink transition-colors"
      >
        {t("onboarding.recommendation.seeAllCrossings")}
      </button>
    </div>
  );
}
