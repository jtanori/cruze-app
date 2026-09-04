"use client";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsMyTrips } from "@/components/settings/SettingsMyTrips";
import { useTripStore } from "@/stores/trip";

export default function MyTripsPage() {
  const completedTrips = useTripStore((s) => s.completedTrips);
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title="MIS VIAJES" />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsMyTrips trips={completedTrips} />
      </div>
    </div>
  );
}
