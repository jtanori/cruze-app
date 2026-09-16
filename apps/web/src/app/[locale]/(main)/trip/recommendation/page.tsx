"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTranslations } from "next-intl";
import { useTripStore } from "@/stores/trip";
import { TripRecommendationPrimaryCard } from "@/components/trip/TripRecommendationPrimaryCard";
import { TripRecommendationReasonList } from "@/components/trip/TripRecommendationReasonList";
import { TripAlternativeListSection } from "@/components/trip/TripAlternativeListSection";
import { Spinner } from "@/components/primitives/Spinner";
import type {
  TripRecommendation,
  SelectedCrossing,
  RecommendationCrossingStatus,
} from "@/lib/recommendation/types";

export default function TripRecommendationPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { start, destination, direction, travelMode, accessType, documentProfile } = useTripStore();
  const setRecommendedCrossing = useTripStore((s) => s.setRecommendedCrossing);
  const setSelectedCrossing = useTripStore((s) => s.setSelectedCrossing);

  const [recommendation, setRecommendation] = useState<TripRecommendation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams();
        if (start && destination) {
          params.set("origin", start.name);
          params.set("destination", destination.name);
          if ((start as any).latitude && (start as any).longitude) {
            params.set("originLat", String((start as any).latitude));
            params.set("originLng", String((start as any).longitude));
          }
          if ((destination as any).latitude && (destination as any).longitude) {
            params.set("destLat", String((destination as any).latitude));
            params.set("destLng", String((destination as any).longitude));
          }
          if ((start as any).lat) params.set("originLat", String((start as any).lat));
          if ((start as any).lng) params.set("originLng", String((start as any).lng));
          if ((destination as any).lat) params.set("destLat", String((destination as any).lat));
          if ((destination as any).lng) params.set("destLng", String((destination as any).lng));
        }
        if (direction) params.set("direction", direction);
        if (travelMode) params.set("travelMode", travelMode);
        if (accessType) params.set("accessType", accessType);
        if (documentProfile) params.set("documentProfile", documentProfile);
        const res = await fetch(`/api/recommendations?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (cancelled) return;

        // Map API response to TripRecommendation
        if (data.primary) {
          const rec: TripRecommendation = {
            primary: {
              crossing: {
                id: data.primary.crossingId,
                name: data.primary.crossingName,
                mexicanCity: data.primary.mexicanCity,
                usCity: data.primary.usCity,
                mexicanState: "",
                usState: "",
                corridor: "",
                coordinates: data.primary.coordinates ?? { lat: 0, lng: 0 },
              },
              waitTime: data.primary.waitTime,
              totalJourneyTime: data.primary.totalJourneyTime,
              status: data.primary.status as RecommendationCrossingStatus,
              isLive: data.primary.isLive ?? false,
              score: 1,
              reason: {
                code: (data.primary.reasonCode ?? "fastest_total_time") as any,
                data: data.primary.reasonData ?? { deltaMinutes: 0 },
              },
              confidence: "medium",
            },
            alternatives: (data.alternatives ?? []).map((a: any) => ({
              crossingId: a.crossingId,
              crossingName: a.crossingName,
              mexicanCity: a.mexicanCity,
              usCity: a.usCity,
              waitTime: a.waitTime,
              totalJourneyTime: a.totalJourneyTime,
              deltaMinutes: a.deltaMinutes,
              status: (a.status ?? "open") as RecommendationCrossingStatus,
              isLive: a.isLive ?? false,
              coordinates: a.coordinates ?? { lat: 0, lng: 0 },
            })),
            context: data.context ?? {
              originName: start?.name ?? "",
              destinationName: destination?.name ?? "",
              originLat: (start as any)?.latitude ?? (start as any)?.lat ?? 0,
              originLng: (start as any)?.longitude ?? (start as any)?.lng ?? 0,
              destLat: (destination as any)?.latitude ?? (destination as any)?.lat ?? 0,
              destLng: (destination as any)?.longitude ?? (destination as any)?.lng ?? 0,
              travelMode: travelMode ?? undefined,
              direction: direction ?? undefined,
              accessType: accessType ?? undefined,
              documentProfile: documentProfile ?? undefined,
            },
            generatedAt: data.generatedAt ?? new Date().toISOString(),
          };
          setRecommendation(rec);
        } else if (data.tripId) {
          // Legacy mock shape fallback
          const rec: TripRecommendation = {
            primary: {
              crossing: {
                id: data.selectedCrossingId,
                name: data.fastestCrossingName ?? data.selectedCrossingId,
                mexicanCity: data.originName,
                usCity: data.destinationName,
                mexicanState: "",
                usState: "",
                corridor: "",
                coordinates: { lat: 0, lng: 0 },
              },
              waitTime: data.borderWaitMinutes,
              totalJourneyTime: data.totalEstimatedMinutes,
              status: "open",
              isLive: false,
              score: 1,
              reason: { code: "fastest_total_time" },
              confidence: "medium",
            },
            alternatives: (data.alternatives ?? []).map((a: any) => ({
              crossingId: a.crossingId,
              crossingName: a.crossingName,
              mexicanCity: "",
              usCity: "",
              waitTime: 0,
              totalJourneyTime: a.totalEstimatedMinutes,
              deltaMinutes: a.deltaMinutes,
              status: "open" as const,
              isLive: false,
              coordinates: { lat: 0, lng: 0 },
            })),
            context: {
              originName: start?.name ?? "",
              destinationName: destination?.name ?? "",
              originLat: 0,
              originLng: 0,
              destLat: 0,
              destLng: 0,
              travelMode: travelMode ?? undefined,
              direction: direction ?? undefined,
              accessType: accessType ?? undefined,
              documentProfile: documentProfile ?? undefined,
            },
            generatedAt: data.generatedAt ?? new Date().toISOString(),
          };
          setRecommendation(rec);
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [start, destination, direction, travelMode, accessType, documentProfile, t]);

  const handleUsePrimary = () => {
    if (!recommendation) return;
    setRecommendedCrossing(recommendation);
    router.push(`/${locale}/trip`);
  };

  const handleUseAlternative = (crossingId: string) => {
    if (!recommendation) return;
    const alt = recommendation.alternatives.find((a) => a.crossingId === crossingId);
    if (!alt) return;
    const selected: SelectedCrossing = {
      crossingId: alt.crossingId,
      crossingName: alt.crossingName,
      mexicanCity: alt.mexicanCity,
      usCity: alt.usCity,
      waitTime: alt.waitTime,
      totalJourneyTime: alt.totalJourneyTime,
      status: alt.status,
      isLive: alt.isLive,
      generatedAt: recommendation.generatedAt,
      coordinates: alt.coordinates,
    };
    setSelectedCrossing(selected);
    router.push(`/${locale}/trip`);
  };

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !recommendation) {
    return (
      <div className="min-h-[40vh] flex flex-col items-center justify-center gap-3 px-5 text-center">
        <p className="text-ink text-sm font-medium">{t("common.errorTitle")}</p>
        <p className="text-faint text-xs">{error ?? t("common.errorMessage")}</p>
        <button onClick={() => router.push(`/${locale}/trip`)} className="mt-2 h-9 px-4 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm">
          {t("common.retry")}
        </button>
      </div>
    );
  }

  const { primary, alternatives } = recommendation;

  return (
    <div className="min-h-dvh bg-background px-4 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <TripRecommendationPrimaryCard
        crossingName={primary.crossing.name}
        mexicanCity={primary.crossing.mexicanCity}
        usCity={primary.crossing.usCity}
        waitTime={primary.waitTime}
        totalJourneyTime={primary.totalJourneyTime}
        rank="recommended"
        status={primary.status}
        generatedAt={recommendation.generatedAt}
        onUseCrossing={handleUsePrimary}
      />
      <TripRecommendationReasonList
        reasons={[
          primary.reason.code === "fastest_total_time" ? t("trip.recommendation.reasons.fastestTotalTime") :
          primary.reason.code === "shortest_wait" ? t("trip.recommendation.reasons.shortestWait") :
          primary.reason.code === "best_access_match" ? `${t("trip.recommendation.reasons.accessMatch")}${primary.reason.data?.accessType ? ` (${primary.reason.data.accessType})` : ""}` :
          primary.reason.code === "only_open_option" ? t("trip.recommendation.reasons.onlyOpen") :
          primary.reason.code === "closest_to_route" ? t("trip.recommendation.reasons.closestToRoute") :
          primary.reason.code === "candidate_preference" ? t("trip.recommendation.reasons.candidatePreference") :
          t("trip.recommendation.reasons.defaultRecommended"),
          primary.isLive ? t("trip.recommendation.reasons.liveData") : t("trip.recommendation.reasons.estimatedData"),
        ]}
      />
      <TripAlternativeListSection
        alternatives={alternatives}
        onSelect={handleUseAlternative}
      />
      <button onClick={() => router.push(`/${locale}/crossings`)} className="w-full text-center text-muted text-sm">{t("trip.viewAllCrossings")}</button>
    </div>
  );
}
