"use client";

import { useTranslations } from "next-intl";
import { RefreshCw, Settings, MapPin } from "lucide-react";
import { requestGeolocation } from "@/lib/geolocation";
import { useLocationStore } from "@/stores/location";
import { createLocationData } from "@/lib/location-state-machine";

interface LocationRecoveryPanelProps {
  reason: "permission_denied" | "services_disabled" | "low_confidence" | "stale" | "unavailable";
  className?: string;
}

export function LocationRecoveryPanel({
  reason,
  className = "",
}: LocationRecoveryPanelProps) {
  const t = useTranslations();
  const { setState, setLocation } = useLocationStore();

  const handleRetry = async () => {
    try {
      setState("acquiring");
      const result = await requestGeolocation();
      const locationData = createLocationData(result.lat, result.lng, result.accuracy);
      setLocation(locationData);
      setState("ready");
    } catch {
      setState("unavailable");
    }
  };

  const handleSettings = () => {
    setState("services_disabled");
  };

  const reasonConfig = {
    permission_denied: {
      title: t("onboarding.location.recovery.permissionDenied"),
      description: t("onboarding.location.recovery.permissionDeniedDesc"),
      showSettings: true,
    },
    services_disabled: {
      title: t("onboarding.location.recovery.servicesDisabled"),
      description: t("onboarding.location.recovery.servicesDisabledDesc"),
      showSettings: true,
    },
    low_confidence: {
      title: t("onboarding.location.recovery.lowConfidence"),
      description: t("onboarding.location.recovery.lowConfidenceDesc"),
      showSettings: false,
    },
    stale: {
      title: t("onboarding.location.recovery.stale"),
      description: t("onboarding.location.recovery.staleDesc"),
      showSettings: false,
    },
    unavailable: {
      title: t("onboarding.location.recovery.unavailable"),
      description: t("onboarding.location.recovery.unavailableDesc"),
      showSettings: false,
    },
  };

  const config = reasonConfig[reason];

  return (
    <div className={`flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center ${className}`}>
      <div className="w-16 h-16 rounded-full bg-warning/10 flex items-center justify-center mb-4 sm:mb-6">
        <MapPin className="w-8 h-8 text-warning" />
      </div>

      <h3 className="text-ink font-semibold text-lg mb-2">{config.title}</h3>
      <p className="text-muted text-sm leading-relaxed max-w-xs mb-4 sm:mb-6">{config.description}</p>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <button
          onClick={handleRetry}
          className="w-full py-3 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px] inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
        >
          <RefreshCw className="w-4 h-4" />
          {t("onboarding.location.recovery.retry")}
        </button>

        {config.showSettings && (
          <button
            onClick={handleSettings}
            className="w-full py-3 rounded-[var(--radius-lg)] border border-border text-muted font-semibold text-sm hover:bg-surface-elevated transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
          >
            <Settings className="w-4 h-4" />
            {t("onboarding.location.settings")}
          </button>
        )}
      </div>
    </div>
  );
}
