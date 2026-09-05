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

interface Primary {
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  rank: "recommended" | "fastest" | "best_overall" | "alternative";
  status: "open" | "limited" | "closed";
  generatedAt: string;
  crossingId: string;
  isLive?: boolean;
}

interface Alternative {
  crossingId: string;
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  waitTime: number;
  totalJourneyTime: number;
  deltaMinutes: number;
  status?: "open" | "limited" | "closed";
}

export default function TripRecommendationPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations();
  const { start, destination } = useTripStore();

  const [primary, setPrimary] = useState<Primary | null>(null);
  const [reasons, setReasons] = useState<string[]>([]);
  const [alternatives, setAlternatives] = useState<Alternative[]>([]);
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
          // Pass coordinates for live candidate ranking
          if ((start as any).latitude && (start as any).longitude) {
            params.set("originLat", String((start as any).latitude));
            params.set("originLng", String((start as any).longitude));
          }
          if ((destination as any).latitude && (destination as any).longitude) {
            params.set("destLat", String((destination as any).latitude));
            params.set("destLng", String((destination as any).longitude));
          }
          // Fallback to lat/lng keys used by store (lat/lng vs latitude/longitude)
          if ((start as any).lat) params.set("originLat", String((start as any).lat));
          if ((start as any).lng) params.set("originLng", String((start as any).lng));
          if ((destination as any).lat) params.set("destLat", String((destination as any).lat));
          if ((destination as any).lng) params.set("destLng", String((destination as any).lng));
        }
        const res = await fetch(`/api/recommendations?${params.toString()}`, { cache: "no-store" });
        if (!res.ok) throw new Error(`API ${res.status}`);
        const data = await res.json();
        if (cancelled) return;
        // API returns { primary, reasons, alternatives }
        if (data.primary) {
          setPrimary(data.primary);
          setReasons(data.reasons ?? [t("trip.recommendation.reasons.time"), t("trip.recommendation.reasons.compatible"), t("trip.recommendation.reasons.recent")]);
          setAlternatives(data.alternatives ?? []);
        } else if (data.tripId) {
          // Legacy mock shape fallback
          setPrimary({
            crossingName: data.fastestCrossingName ?? data.selectedCrossingId,
            mexicanCity: data.originName,
            usCity: data.destinationName,
            waitTime: data.borderWaitMinutes,
            totalJourneyTime: data.totalEstimatedMinutes,
            rank: "recommended",
            status: "open",
            generatedAt: data.generatedAt,
            crossingId: data.selectedCrossingId,
          });
          setReasons(data.evidence ?? []);
          setAlternatives((data.alternatives ?? []).map((a: any) => ({
            crossingId: a.crossingId,
            crossingName: a.crossingName,
            mexicanCity: "",
            usCity: "",
            waitTime: 0,
            totalJourneyTime: a.totalEstimatedMinutes,
            deltaMinutes: a.deltaMinutes,
          })));
        }
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => { cancelled = true; };
  }, [start, destination, t]);

  if (loading) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  if (error || !primary) {
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

  return (
    <div className="min-h-dvh bg-background px-4 sm:px-5 py-4 sm:py-6 space-y-4 sm:space-y-6">
      <TripRecommendationPrimaryCard {...primary} onUseCrossing={() => router.push(`/${locale}/trip`)} />
      <TripRecommendationReasonList reasons={reasons} />
      <TripAlternativeListSection alternatives={alternatives} onSelect={(id) => router.push(`/${locale}/crossing/${id}`)} />
      <button onClick={() => router.push(`/${locale}/crossings`)} className="w-full text-center text-muted text-sm">{t("trip.viewAllCrossings")}</button>
    </div>
  );
}
