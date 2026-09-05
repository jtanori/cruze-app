"use client";

import { useTranslations } from "next-intl";
import { MapPin, X } from "lucide-react";

interface LocationStatusBannerProps {
  placeName: string;
  dismissible?: boolean;
  onDismiss?: () => void;
  className?: string;
}

/**
 * LOC-STATUS-01 — Location status banner
 * Shows current location after acquisition
 * Non-dismissible on T01 page, dismissible elsewhere
 */
export function LocationStatusBanner({
  placeName,
  dismissible = false,
  onDismiss,
  className = "",
}: LocationStatusBannerProps) {
  const t = useTranslations();

  return (
    <div className={`flex items-center justify-between px-4 py-3 bg-cruze-mint/10 border-b border-cruze-mint/20 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="w-4 h-4 text-cruze-green shrink-0" />
        <div>
          <p className="text-cruze-green text-xs font-medium">
            {t("onboarding.location.banner.established", { placeName })}
          </p>
        </div>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-cruze-green hover:text-cruze-green/70 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}