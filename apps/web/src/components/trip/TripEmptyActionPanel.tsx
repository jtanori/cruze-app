"use client";

import { useTranslations } from "next-intl";
import { MapPin } from "lucide-react";

interface TripEmptyActionPanelProps {
  onStartTrip: () => void;
  onViewAllCrossings: () => void;
}

export function TripEmptyActionPanel({
  onStartTrip,
  onViewAllCrossings,
}: TripEmptyActionPanelProps) {
  const t = useTranslations();

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h1 className="text-ink text-xl font-bold">{t("trip.empty.title")}</h1>
        <p className="text-muted text-sm">{t("trip.empty.subtitle")}</p>
      </div>

      <button
        onClick={onStartTrip}
        className="w-full h-[48px] flex items-center justify-center gap-2 bg-cruze-mint text-midnight font-semibold text-sm rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity"
      >
        <MapPin className="w-4 h-4" />
        {t("trip.empty.startTrip")}
      </button>

      <button
        onClick={onViewAllCrossings}
        className="w-full text-cruze-mint text-sm font-medium hover:underline"
      >
        {t("trip.empty.viewAll")}
      </button>
    </div>
  );
}