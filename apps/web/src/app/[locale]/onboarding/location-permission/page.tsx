"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useLocationStore } from "@/stores/location";
import { LocationPermissionPrompt } from "@/components/location/LocationPermissionPrompt";
import { LocationAcquisitionState } from "@/components/location/LocationAcquisitionState";
import { LocationRecoveryPanel } from "@/components/location/LocationRecoveryPanel";
import { LocationStatusBanner } from "@/components/location/LocationStatusBanner";

export default function LocationPermissionPage() {
  const router = useRouter();
  const locale = useLocale();
  const { state, setState } = useLocationStore();

  useEffect(() => {
    console.log("[Cruze:Onboarding] LocationPermission page — state:", state);
    if (state === "ready") {
      console.log("[Cruze:Onboarding] Location ready → redirecting to /viaje");
      router.replace(`/${locale}/viaje`);
    }
  }, [state, router, locale]);

  const handleRetry = () => {
    setState("requesting_permission");
  };

  if (state === "ready") {
    return (
      <div className="min-h-dvh bg-background flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-cruze-mint border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-background flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-5 py-8">
        {state === "requesting_permission" || state === "uninitialized" ? (
          <LocationPermissionPrompt />
        ) : state === "acquiring" ? (
          <LocationAcquisitionState />
        ) : state === "permission_denied" ? (
          <LocationRecoveryPanel reason="permission_denied" />
        ) : state === "services_disabled" ? (
          <LocationRecoveryPanel reason="services_disabled" />
        ) : state === "low_confidence" ? (
          <LocationRecoveryPanel reason="low_confidence" />
        ) : state === "stale" ? (
          <LocationRecoveryPanel reason="stale" />
        ) : state === "unavailable" ? (
          <LocationRecoveryPanel reason="unavailable" />
        ) : (
          <LocationPermissionPrompt />
        )}
      </div>

      {(state === "permission_denied" || state === "unavailable") && (
        <div className="px-5 pb-6">
          <LocationStatusBanner state={state} onRetry={handleRetry} />
        </div>
      )}
    </div>
  );
}
