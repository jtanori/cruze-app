"use client";
import { SettingsMyTrips } from "@/components/settings/SettingsMyTrips";
import { useTripStore } from "@/stores/trip";
export default function MyTripsPage() {
  const completedTrips = useTripStore((s) => s.completedTrips);
  return <div className="px-5 py-6 max-w-lg mx-auto"><SettingsMyTrips trips={completedTrips} /></div>;
}