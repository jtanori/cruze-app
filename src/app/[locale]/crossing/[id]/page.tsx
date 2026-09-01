"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTripStore } from "@/stores/trip";
import { CrossingIntelligenceView } from "@/components/crossing/CrossingIntelligenceView";
import { BORDER_CROSSINGS } from "@/lib/border-data";
import { getMergedCrossingsData } from "@/lib/border-data-service";
import type { CrossingRecommendation } from "@/types";

interface CrossingPageProps {
  params: Promise<{ id: string; locale: string }>;
}

export default function CrossingPage({ params }: CrossingPageProps) {
  const { id, locale } = use(params);
  const router = useRouter();
  const recommendation = useTripStore((s) => s.recommendedCrossing);
  const start = useTripStore((s) => s.start);
  const destination = useTripStore((s) => s.destination);
  const resetTrip = useTripStore((s) => s.reset);
  const [hasJourneyContext, setHasJourneyContext] = useState<boolean | null>(null);
  const [crossingData, setCrossingData] = useState<CrossingRecommendation | null>(null);

  useEffect(() => {
    // Check if user has journey context from onboarding
    const hasContext = !!(recommendation && start && destination);
    setHasJourneyContext(hasContext);

    if (hasContext && recommendation) {
      setCrossingData(recommendation);
    } else {
      // Fetch crossing data from border data when no journey context
      const crossing = BORDER_CROSSINGS.find((c) => c.id === id);
      if (crossing) {
        // Create a basic recommendation from border data
        const mockRecommendation: CrossingRecommendation = {
          crossingId: crossing.id,
          crossingName: crossing.name,
          mexicanCity: crossing.mexicanCity,
          usCity: crossing.usCity,
          mexicanState: crossing.mexicanState,
          usState: crossing.usState,
          mexicanAddress: crossing.mexicanAddress,
          usAddress: crossing.usAddress,
          corridor: crossing.corridor,
          coordinates: crossing.coordinates,
          waitTime: 20,
          totalJourneyTime: 35,
          score: 80,
          reason: {
            headline: "Selected crossing",
            detail: undefined,
          },
          confidence: "medium",
          generatedAt: new Date().toISOString(),
          lanes: [
            { name: "Standard", waitTime: 20, isOpen: true },
            { name: "SENTRI", waitTime: 5, isOpen: true },
            { name: "Ready Lane", waitTime: 15, isOpen: true },
          ],
          facts: {
            hours: "Open 24 hours",
            pedestrianAccess: true,
            commercialAccess: true,
          },
          alternatives: [],
        };
        setCrossingData(mockRecommendation);
      }
    }
  }, [id, recommendation, start, destination, resetTrip]);

  const handleBack = () => {
    router.push(`/${locale}/crossings`);
  };

  if (hasJourneyContext === null || !crossingData) {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <CrossingIntelligenceView
      recommendation={crossingData}
      origin={start}
      destination={destination}
      hasJourneyContext={hasJourneyContext}
      onBack={handleBack}
      crossingName={crossingData.crossingName}
    />
  );
}
