"use client";

import { useTranslations } from "next-intl";
import { MapPin, Settings, Search } from "lucide-react";
import { useLocationContext } from "./LocationProvider";

export function LocationPermissionPrompt() {
  const t = useTranslations();
  const { request, enterManualSearch, markServicesDisabled } = useLocationContext();

  const handleAllow = () => {
    request();
  };

  const handleManualSearch = () => {
    enterManualSearch();
  };

  const handleSettings = () => {
    markServicesDisabled();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-4 sm:px-6 text-center">
      <div className="w-20 h-20 rounded-full bg-cruze-mint/10 flex items-center justify-center mb-4 sm:mb-6">
        <MapPin className="w-10 h-10 text-cruze-mint" />
      </div>

      <h1 className="text-2xl font-bold text-ink mb-3">
        {t("onboarding.location.title")}
      </h1>

      <p className="text-muted text-sm leading-relaxed mb-8">
        {t("onboarding.location.explanation")}
      </p>

      <div className="w-full space-y-3">
        <button
          onClick={handleAllow}
          className="w-full py-3.5 rounded-[var(--radius-lg)] bg-cruze-mint text-midnight font-semibold text-sm hover:opacity-90 transition-opacity min-h-[48px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cruze-mint/50"
        >
          {t("onboarding.location.allow")}
        </button>

        <button
          onClick={handleManualSearch}
          className="w-full py-3.5 rounded-[var(--radius-lg)] border border-border text-ink font-semibold text-sm hover:bg-surface-elevated transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          {t("onboarding.location.manualSearch")}
        </button>

        <button
          onClick={handleSettings}
          className="w-full py-3.5 rounded-[var(--radius-lg)] border border-border text-muted font-semibold text-sm hover:bg-surface-elevated transition-colors min-h-[48px] inline-flex items-center justify-center gap-2"
        >
          <Settings className="w-4 h-4" />
          {t("onboarding.location.settings")}
        </button>
      </div>
    </div>
  );
}
