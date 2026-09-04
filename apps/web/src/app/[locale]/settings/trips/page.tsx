"use client";
import { SettingsMyTrips } from "@/components/settings/SettingsMyTrips";
import { useTripStore } from "@/stores/trip";
export default function MyTripsPage() {
  const completedTrips = useTripStore((s) => s.completedTrips);
  return <div className="px-4 sm:px-5 py-4 sm:py-6 max-w-sm sm:max-w-lg mx-auto"><SettingsMyTrips trips={completedTrips} /></div>;
}