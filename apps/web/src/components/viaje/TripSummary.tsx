"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { ArrowRight, Navigation, MapPin, ChevronDown, ChevronRight } from "lucide-react";
import { useTripStore } from "@/stores/trip";
import { getDisplayName } from "@/lib/display";
import BestCrossingCard from "@/components/crossing/BestCrossingCard";

interface TripSummaryProps {
  onStartNew: () => void;
  onEdit: () => void;
  onNavigate: () => void;
  onViewCrossing: () => void;
  onEndTrip: () => void;
  onSeeAllRecommendations?: () => void;
}

export function TripSummary({
  onStartNew,
  onEdit,
  onNavigate,
  onViewCrossing,
  onEndTrip,
  onSeeAllRecommendations,
}: TripSummaryProps) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();

  const { start, destination, direction, recommendedCrossing } = useTripStore();

  if (!recommendedCrossing) {
    return (
      <div className="space-y-4">
        <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-3">
          <p className="text-muted text-xs font-medium uppercase tracking-wider">
            {t("viaje.noActiveTrip")}
          </p>
          <p className="text-faint text-xs">
            {t("viaje.planNextCrossing")}
          </p>
          <button
            onClick={onEdit}
            className="w-full h-[44px] flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
          >
            {t("viaje.planCrossing")}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  // Show only the first alternative
  const firstAlternative = recommendedCrossing.alternatives[0];

  return (
    <div className="space-y-4">
      {/* ── YOUR TRIP ──────────────────────────────────────────────────── */}
      <div>
        <p className="text-muted text-xs font-medium uppercase tracking-wider mb-2">
          {t("viaje.yourTrip")}
        </p>
        <div className="flex items-center gap-2 text-sm">
          <span className="text-ink font-medium">{getDisplayName(start)}</span>
          <ArrowRight className="w-4 h-4 text-faint" />
          <span className="text-ink font-medium">{getDisplayName(destination)}</span>
        </div>
      </div>

      {/* ── RECOMMENDED CROSSING (BestCrossingCard) ────────────────────── */}
      <div>
        <p className="text-muted text-xs font-medium uppercase tracking-wider mb-2">
          {t("viaje.recommendedCrossing")}
        </p>
        <BestCrossingCard
          crossingName={recommendedCrossing.crossingName}
          mexicanCity={recommendedCrossing.mexicanCity}
          usCity={recommendedCrossing.usCity}
          waitTime={recommendedCrossing.waitTime}
          totalJourneyTime={recommendedCrossing.totalJourneyTime}
          reason={recommendedCrossing.reason}
          generatedAt={recommendedCrossing.generatedAt}
          isRecommended
          onStartTrip={onNavigate}
          onViewDetails={onViewCrossing}
          showCTA={false}
          showRecommendationBadge={false}
          showLiveStatus={true}
          showFreshness={true}
        />
      </div>

      {/* ── WHY THIS ONE ───────────────────────────────────────────────── */}
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-4 space-y-2">
        <p className="text-muted text-xs font-medium uppercase tracking-wider">
          {t("viaje.whyThisOne")}
        </p>
        <p className="text-ink text-sm">{recommendedCrossing.reason.headline}</p>
        {recommendedCrossing.reason.detail && (
          <p className="text-faint text-xs">{recommendedCrossing.reason.detail}</p>
        )}
      </div>

      {/* ── ALTERNATIVES (Only one + See More) ─────────────────────────── */}
      {firstAlternative && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <p className="text-muted text-xs font-medium uppercase tracking-wider">
              {t("viaje.alternatives")}
            </p>
          </div>
          <div className="bg-surface border border-border rounded-[var(--radius-lg)] overflow-hidden">
            <button
              onClick={onEndTrip}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-surface-elevated transition-colors"
            >
              <div className="flex-1 min-w-0">
                <p className="text-ink text-sm font-medium truncate">
                  {firstAlternative.crossingName}
                </p>
                <p className="text-faint text-xs mt-0.5 truncate">
                  {firstAlternative.mexicanCity}, MX ↔ {firstAlternative.usCity}, US
                </p>
              </div>
              <div className="flex items-center gap-3 shrink-0 ml-3">
                <div className="text-right">
                  <div className="flex items-center gap-1">
                    <span className="text-faint text-xs">↑</span>
                    <span className="text-ink text-xs font-medium tabular">
                      {firstAlternative.waitTime} min
                    </span>
                  </div>
                  {firstAlternative.totalJourneyTime !== undefined && (
                    <div className="flex items-center gap-1 mt-0.5">
                      <span className="text-faint text-xs">↑</span>
                      <span className="text-ink text-xs font-medium tabular">
                        {firstAlternative.totalJourneyTime} min
                      </span>
                    </div>
                  )}
                </div>
                <span className="text-caution text-xs font-medium tabular">
                  +{firstAlternative.deltaMinutes} min
                </span>
                <ChevronRight className="w-4 h-4 text-faint" />
              </div>
            </button>
          </div>
          
          {/* See More Button */}
          {onSeeAllRecommendations && recommendedCrossing.alternatives.length > 1 && (
            <button
              onClick={onSeeAllRecommendations}
              className="w-full h-[44px] flex items-center justify-center gap-2 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
            >
              <span className="text-muted text-sm">
                {t("viaje.seeMoreRecommendations")}
              </span>
              <ChevronRight className="w-4 h-4 text-faint" />
            </button>
          )}
        </div>
      )}

      {/* ── BOTTOM CTAs ────────────────────────────────────────────────── */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={onNavigate}
          className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-cruze-green text-dark text-sm font-semibold rounded-[var(--radius-md)] active:bg-cruze-green/90 transition-colors"
        >
          <Navigation className="w-4 h-4" />
          {t("viaje.navigate")}
        </button>
        <button
          onClick={onViewCrossing}
          className="flex-1 h-[48px] flex items-center justify-center gap-2 bg-surface border border-border text-ink text-sm font-medium rounded-[var(--radius-md)] active:bg-surface-subtle transition-colors"
        >
          <MapPin className="w-4 h-4" />
          {t("viaje.viewCrossing")}
        </button>
      </div>
    </div>
  );
}