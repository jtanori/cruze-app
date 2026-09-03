"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import {
  getRequiredSteps,
  getNextStep,
  getPreviousStep,
  getStepProgress,
  type TripSetupState,
  type TripSetupStep,
} from "@/lib/trip-setup-flow";
import { detectDirection } from "@/lib/direction-detection";
import { TripSetupProgress } from "./TripSetupProgress";
import { TripSetupDestinationStep } from "./TripSetupDestinationStep";
import { TripSetupOriginStep } from "./TripSetupOriginStep";
import { TripSetupTravelModeStep } from "./TripSetupTravelModeStep";
import { TripSetupDirectionStep } from "./TripSetupDirectionStep";
import { TripSetupVehicleAccessStep } from "./TripSetupVehicleAccessStep";
import { TripSetupDocumentProfileStep } from "./TripSetupDocumentProfileStep";
import { trackEvent } from "@/lib/analytics";

export function TripSetupFlow() {
  const router = useRouter();
  const locale = useLocale();
  const [state, setState] = useState<TripSetupState>({
    destination: null,
    origin: null,
    travelMode: null,
    direction: null,
    accessType: null,
    documentType: null,
  });
  const [step, setStep] = useState<TripSetupStep>("destination");

  const progress = getStepProgress(state, step);
  const required = getRequiredSteps(state);

  const goNext = () => {
    const next = getNextStep(state, step);
    if (next === "recommendation") {
      trackEvent("trip_setup_completed", { stepsCompleted: progress.current });
      router.push(`/${locale}/onboarding/recommendation`);
      return;
    }
    if (next) {
      trackEvent("trip_setup_step_completed", { step, nextStep: next });
      setStep(next);
    }
  };

  const goBack = () => {
    const prev = getPreviousStep(state, step);
    if (prev) setStep(prev);
    else router.back();
  };

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="sticky top-0 z-10 bg-background border-b border-border-subtle px-5 py-3">
        <TripSetupProgress current={progress.current} total={progress.total} />
      </div>

      <div className="flex-1 px-5 py-6 max-w-lg mx-auto w-full">
        {step === "destination" && (
          <TripSetupDestinationStep
            onSelect={(dest) => {
              setState((s) => ({ ...s, destination: dest }));
              trackEvent("trip_setup_destination_selected", { destination: dest.label });
              setStep("origin");
            }}
          />
        )}

        {step === "origin" && (
          <TripSetupOriginStep
            onSelect={(origin) => {
              const newState = { ...state, origin };
              // Auto-detect direction if both points available
              if (newState.destination) {
                const dir = detectDirection(origin, newState.destination);
                if (dir !== "unknown") {
                  newState.direction = dir;
                }
              }
              setState(newState);
              trackEvent("trip_setup_origin_selected", { origin: origin.label });
              const next = getNextStep(newState, "origin");
              if (next) setStep(next);
            }}
          />
        )}

        {step === "travelMode" && (
          <TripSetupTravelModeStep
            value={state.travelMode}
            onSelect={(mode) => {
              const newState = { ...state, travelMode: mode };
              setState(newState);
              trackEvent("trip_setup_travel_mode_selected", { mode });
              const next = getNextStep(newState, "travelMode");
              if (next === "recommendation") {
                router.push(`/${locale}/onboarding/recommendation`);
              } else if (next) {
                setStep(next);
              }
            }}
          />
        )}

        {step === "direction" && (
          <TripSetupDirectionStep
            value={state.direction}
            onSelect={(dir) => {
              const newState = { ...state, direction: dir };
              setState(newState);
              trackEvent("trip_setup_direction_selected", { direction: dir });
              const next = getNextStep(newState, "direction");
              if (next === "recommendation") {
                router.push(`/${locale}/onboarding/recommendation`);
              } else if (next) {
                setStep(next);
              }
            }}
          />
        )}

        {step === "accessType" && (
          <TripSetupVehicleAccessStep
            value={state.accessType}
            onSelect={(access) => {
              const newState = { ...state, accessType: access };
              setState(newState);
              trackEvent("trip_setup_access_type_selected", { accessType: access });
              const next = getNextStep(newState, "accessType");
              if (next) setStep(next);
            }}
          />
        )}

        {step === "documentProfile" && (
          <TripSetupDocumentProfileStep
            value={state.documentType}
            onSelect={(doc) => {
              setState((s) => ({ ...s, documentType: doc }));
              trackEvent("trip_setup_document_selected", { documentType: doc });
            }}
            onSkip={() => {
              trackEvent("trip_setup_document_skipped");
              router.push(`/${locale}/onboarding/recommendation`);
            }}
          />
        )}

        {step === "documentProfile" && state.documentType && (
          <button
            onClick={() => router.push(`/${locale}/onboarding/recommendation`)}
            className="w-full mt-6 py-3.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px]"
          >
            Ver recomendaci\u00F3n
          </button>
        )}
      </div>

      {step !== "destination" && step !== "documentProfile" && (
        <div className="px-5 pb-6 max-w-lg mx-auto w-full">
          <button
            onClick={goBack}
            className="text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            {"\u2190 Atr\u00E1s"}
          </button>
        </div>
      )}

      {step === "documentProfile" && (
        <div className="px-5 pb-6 max-w-lg mx-auto w-full">
          <button onClick={goBack} className="text-sm font-medium text-muted hover:text-ink transition-colors">
            {"\u2190 Atr\u00E1s"}
          </button>
        </div>
      )}
    </div>
  );
}
