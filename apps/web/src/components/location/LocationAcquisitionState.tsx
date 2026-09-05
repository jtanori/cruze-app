"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";
import { LocationAcquisitionDots } from "./LocationAcquisitionDots";

interface LocationAcquisitionStateProps {
  message?: string;
  className?: string;
}

export function LocationAcquisitionState({
  message,
  className = "",
}: LocationAcquisitionStateProps) {
  const t = useTranslations();
  const displayMessage = message || t("onboarding.location.acquiring");

  return (
    <div className={`flex flex-col items-center justify-center py-8 sm:py-12 ${className}`}>
      <div className="relative mb-4 sm:mb-6">
        <div className="w-16 h-16 rounded-full bg-cruze-mint/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-cruze-mint" />
        </div>
      </div>

      <p className="text-muted text-sm font-medium">{displayMessage}</p>

      <LocationAcquisitionDots color="cruze-mint" size="md" className="mt-4" />
    </div>
  );
}