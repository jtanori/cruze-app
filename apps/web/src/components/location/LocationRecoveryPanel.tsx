"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RefreshCw, Settings, MapPin, WifiOff } from "lucide-react";
import { useLocationContext } from "./LocationProvider";
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
  const { retry, selectManual, markServicesDisabled } = useLocationContext();
  const { isReachable } = useNetworkStatus();
  const [showSearch, setShowSearch] = useState(false);

  const handleRetry = () => {
    retry();
  };

  const handleManualSelect = (result: GeocodingResult) => {
    selectManual(result.center[1], result.center[0], result.placeName);
  };

  const handleSettings = () => {
    markServicesDisabled();
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

      {reason === "permission_denied" && (
        <div className="w-full mb-4 sm:mb-6 rounded-[var(--radius-md)] border border-border bg-surface px-4 py-3 text-left">
          <p className="text-ink text-sm font-semibold">
            {t("onboarding.location.recovery.blockedHintTitle")}
          </p>
          <p className="text-muted text-xs leading-relaxed mt-1">
            {t("onboarding.location.recovery.blockedHintBody")}
          </p>
        </div>
      )}

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
