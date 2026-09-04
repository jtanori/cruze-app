"use client";

import { useTranslations } from "next-intl";
import { MapPin, Settings } from "lucide-react";
import { requestGeolocation } from "@/lib/geolocation";
import { useLocationStore } from "@/stores/location";
import { createLocationData } from "@/lib/location-state-machine";

export function LocationPermissionPrompt() {
  const t = useTranslations();
  const { setState, setLocation } = useLocationStore();

  const handleAllow = async () => {
    try {
      setState("acquiring");
      const result = await requestGeolocation();
      const locationData = createLocationData(result.lat, result.lng, result.accuracy);
      setLocation(locationData);
      setState("ready");
    } catch {
      setState("permission_denied");
    }
  };

  const handleSettings = () => {
    setState("services_disabled");
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-cruze-mint/10 flex items-center justify-center mb-4 sm:mb-6">
        <MapPin className="w-10 h-10 text-cruze-mint" />
      </div>

      <h1 className="text-2xl font-bold text-ink mb-3">
        {t("onboarding.location.title")}
      </h1>

      <p className="text-muted text-sm leading-relaxed max-w-xs mb-8">
        {t("onboarding.location.explanation")}
      </p>

      <button
        onClick={handleAllow}
        className="w-full max-w-xs py-3.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
      >
        {t("onboarding.location.allow")}
      </button>

      <button
        onClick={handleSettings}
        className="mt-4 inline-flex items-center gap-2 text-muted text-sm font-medium hover:text-ink transition-colors min-h-[44px]"
      >
        <Settings className="w-4 h-4" />
        {t("onboarding.location.settings")}
      </button>
    </div>
  );
}
