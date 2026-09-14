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
 * Integrated inline strip — no card, minimal visual weight.
 */
export function LocationStatusBanner({
  placeName,
  dismissible = false,
  onDismiss,
  className = "",
}: LocationStatusBannerProps) {
  const t = useTranslations();

  return (
    <div className={`flex items-center justify-between px-2 py-2 ${className}`}>
      <div className="flex items-center gap-2">
        <MapPin className="w-3 h-3 text-cruze-mint shrink-0" />
        <div>
          <p className="text-cruze-mint text-xs font-medium">
            {t("onboarding.location.banner.established", { placeName })}
          </p>
        </div>
      </div>

      {dismissible && onDismiss && (
        <button
          onClick={onDismiss}
          className="p-1 text-cruze-mint hover:text-cruze-mint/70 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-3 h-3" />
        </button>
      )}
    </div>
  );
}