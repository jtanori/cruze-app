"use client";

import { useTranslations } from "next-intl";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsMyTrips } from "@/components/settings/SettingsMyTrips";
import { useTripStore } from "@/stores/trip";

export default function MyTripsPage() {
  const t = useTranslations();
  const completedTrips = useTripStore((s) => s.completedTrips);
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={t("settings.pages.tripsTitle")} />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsMyTrips trips={completedTrips} />
      </div>
    </div>
  );
}
