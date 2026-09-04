"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { TripRecommendationPrimaryCard } from "@/components/trip/TripRecommendationPrimaryCard";
import { TripRecommendationReasonList } from "@/components/trip/TripRecommendationReasonList";
import { TripAlternativeListSection } from "@/components/trip/TripAlternativeListSection";

export default function TripRecommendationPage() {
  const router = useRouter();
  const locale = useLocale();

  // Mock data - wires to recommendation lib + trip store in real flow
  const primary = {
    crossingName: "San Luis",
    mexicanCity: "San Luis R.C.",
    usCity: "San Luis",
    waitTime: 11,
    totalJourneyTime: 134,
    rank: "recommended" as const,
    status: "open" as const,
    generatedAt: new Date().toISOString(),
  };
  const reasons = ["Menor tiempo total", "Compatible con tu tipo de cruce", "Datos recientes"];
  const alternatives = [
    { crossingId: "lukeville", crossingName: "Lukeville", mexicanCity: "Sonoyta", usCity: "Lukeville", waitTime: 18, totalJourneyTime: 151, deltaMinutes: 17 },
    { crossingId: "nogales", crossingName: "Nogales Mariposa", mexicanCity: "Nogales", usCity: "Nogales", waitTime: 24, totalJourneyTime: 182, deltaMinutes: 48 },
  ];

  return (
    <div className="min-h-dvh bg-background px-4 sm:px-5 py-4 sm:py-6 max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto space-y-4 sm:space-y-6">
      <TripRecommendationPrimaryCard {...primary} onUseCrossing={() => router.push(`/${locale}/viaje`)} />
      <TripRecommendationReasonList reasons={reasons} />
      <TripAlternativeListSection alternatives={alternatives} onSelect={() => router.push(`/${locale}/viaje`)} />
      <button onClick={() => router.push(`/${locale}/crossings`)} className="w-full text-center text-muted text-sm">Ver todos los cruces</button>
    </div>
  );
}
