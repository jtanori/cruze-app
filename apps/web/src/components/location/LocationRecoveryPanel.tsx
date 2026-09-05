"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, Settings, MapPin, Wifi, WifiOff } from "lucide-react";
import { requestGeolocation } from "@/lib/geolocation";
import { useLocationStore } from "@/stores/location";
import { createLocationData } from "@/lib/location-state-machine";
import { useNetworkStatus } from "@/lib/network-status";
import { LocationSearchInput } from "./LocationSearchInput";
import type { GeocodingResult } from "@/lib/geocoding";

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
  const { isReachable } = useNetworkStatus();
  const [showSearch, setShowSearch] = useState(false);

  const handleRetry = async () => {
    console.log("[Cruze:Recovery] Retry GPS...");
    try {
      setState("acquiring");
      const result = await requestGeolocation();
      console.log("[Cruze:Recovery] GPS retry succeeded:", result.lat.toFixed(4), result.lng.toFixed(4));
      const locationData = createLocationData(result.lat, result.lng, result.accuracy);
      setLocation(locationData);
      setState("ready");
      console.log("[Cruze:Recovery] State → ready");
    } catch (err) {
      console.warn("[Cruze:Recovery] GPS retry failed:", err);
      setState("unavailable");
    }
  };

  const handleManualSelect = (result: GeocodingResult) => {
    console.log("[Cruze:Recovery] Manual location selected:", result.placeName, "→", result.center[1], result.center[0]);
    const locationData = createLocationData(
      result.center[1], // lat
      result.center[0], // lng
      1000 // manual locations have lower accuracy
    );
    setLocation(locationData, true); // true = isManual
    setState("ready");
    console.log("[Cruze:Recovery] State → ready (manual)");
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
      <p className="text-muted text-sm leading-relaxed mb-4 sm:mb-6">{config.description}</p>

      {!showSearch ? (
        <>
          <div className="flex flex-col gap-3 w-full">
            <button
              onClick={handleRetry}
              className="w-full py-3 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px] inline-flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
            >
              <RefreshCw className="w-4 h-4" />
              {t("onboarding.location.recovery.retry")}
            </button>

            {isReachable && (
              <button
                onClick={() => setShowSearch(true)}
                className="w-full py-3 rounded-[var(--radius-lg)] border border-border text-muted font-semibold text-sm hover:bg-surface-elevated transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
              >
                <MapPin className="w-4 h-4" />
                Buscar ubicación
              </button>
            )}

            {!isReachable && (
              <div className="flex items-center justify-center gap-2 text-faint text-sm">
                <WifiOff className="w-4 h-4" />
                Sin conexión
              </div>
            )}

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
        </>
      ) : (
        <div className="w-full max-w-sm">
          <LocationSearchInput
            onSelect={handleManualSelect}
            placeholder="Buscar ciudad o cruce..."
          />
          <button
            onClick={() => setShowSearch(false)}
            className="mt-3 w-full py-2 text-sm text-faint hover:text-muted transition-colors"
          >
            ← Volver
          </button>
        </div>
      )}
    </div>
  );
}
