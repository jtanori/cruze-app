"use client";

import { useTranslations } from "next-intl";
import { Loader2, MapPin } from "lucide-react";

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
    <div className={`flex flex-col items-center justify-center py-12 ${className}`}>
      <div className="relative mb-6">
        <div className="w-16 h-16 rounded-full bg-cruze-mint/10 flex items-center justify-center">
          <MapPin className="w-8 h-8 text-cruze-mint" />
        </div>
        <Loader2 className="absolute -top-1 -right-1 w-6 h-6 text-cruze-mint animate-spin" />
      </div>

      <p className="text-muted text-sm font-medium">{displayMessage}</p>

      <div className="mt-4 flex gap-1">
        <span className="w-2 h-2 rounded-full bg-cruze-mint animate-bounce" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-cruze-mint animate-bounce" style={{ animationDelay: "150ms" }} />
        <span className="w-2 h-2 rounded-full bg-cruze-mint animate-bounce" style={{ animationDelay: "300ms" }} />
      </div>
    </div>
  );
}
