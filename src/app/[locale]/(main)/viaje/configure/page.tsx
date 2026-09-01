"use client";

import { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { DestinationSearch } from "@/components/onboarding/DestinationSearch";
import { StartingPoint } from "@/components/onboarding/StartingPoint";
import { TravelerProfileForm } from "@/components/viaje/TravelerProfileForm";
import { useTripStore } from "@/stores/trip";
import { useTravelerStore } from "@/stores/traveler";
import { recommendCrossing } from "@/lib/recommendation";
import type { TripDirection } from "@/types";
import type { TravelerProfile } from "@/types";

type ConfigureStep = "destination" | "starting-point" | "profile" | "complete";

export default function ConfigurePage() {
  const t = useTranslations();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/")[1] || "es";

  const { direction, destination, start, setRecommendedCrossing, complete } = useTripStore();
  const { setProfile } = useTravelerStore();

  const [step, setStep] = useState<ConfigureStep>("destination");

  const handleDestinationComplete = () => {
    setStep("starting-point");
  };

  const handleStartingPointComplete = () => {
    setStep("profile");
  };

  const handleProfileComplete = async (profile: TravelerProfile) => {
    setProfile(profile);

    if (destination && start && direction) {
      const recommendation = await recommendCrossing({
        start,
        destination,
        direction,
      });
      setRecommendedCrossing(recommendation);
    }

    setStep("complete");
    complete();
    router.push(`/${locale}/crossings`);
  };

  const handleBack = () => {
    if (step === "starting-point") {
      setStep("destination");
    } else if (step === "profile") {
      setStep("starting-point");
    } else {
      router.back();
    }
  };

  return (
    <div className="min-h-dvh bg-background">
      {/* Header */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-surface-elevated border-b border-border">
        <div className="flex items-center h-14 px-4">
          <button
            onClick={handleBack}
            className="w-10 h-10 flex items-center justify-center rounded-full active:bg-surface-subtle transition-colors -ml-2"
            aria-label="Back"
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
          <div className="flex-1 text-center">
            <h1 className="text-ink text-base font-semibold">
              {step === "destination" && t("viaje.selectDestination")}
              {step === "starting-point" && t("viaje.selectStartingPoint")}
              {step === "profile" && t("viaje.configureProfile")}
            </h1>
          </div>
          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Progress bar */}
        <div className="h-0.5 bg-border">
          <div
            className="h-full bg-cruze-green transition-all duration-300"
            style={{
              width:
                step === "destination"
                  ? "33%"
                  : step === "starting-point"
                  ? "66%"
                  : "100%",
            }}
          />
        </div>
      </div>

      {/* Content */}
      <main className="pt-[calc(var(--nav-header-height)+24px)] pb-8 px-5">
        {step === "destination" && (
          <DestinationSearch onComplete={handleDestinationComplete} />
        )}

        {step === "starting-point" && (
          <StartingPoint onComplete={handleStartingPointComplete} />
        )}

        {step === "profile" && direction && (
          <TravelerProfileForm
            direction={direction}
            onComplete={handleProfileComplete}
            onBack={handleBack}
          />
        )}
      </main>
    </div>
  );
}
