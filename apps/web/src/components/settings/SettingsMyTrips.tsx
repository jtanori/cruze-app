"use client";

import { useTranslations } from "next-intl";
import { EmptyState } from "@/components/primitives/EmptyState";
import { useLocale } from "@/hooks/use-locale";

interface CompletedTrip {
  id: string;
  originLabel: string;
  destinationLabel: string;
  crossingName: string;
  completedAt: string;
}

interface SettingsMyTripsProps {
  trips: CompletedTrip[];
  onSelect?: (id: string) => void;
}

export function SettingsMyTrips({ trips, onSelect }: SettingsMyTripsProps) {
  const t = useTranslations();
  const locale = useLocale();
  if (trips.length === 0) {
    return <EmptyState title={t("settings.tripsPage.empty")} description={t("settings.tripsPage.emptyDescription")} />;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-ink">{t("settings.tripsPage.title")}</h2>
      <div className="space-y-2">
        {trips.map((trip) => (
          <button key={trip.id} onClick={() => onSelect?.(trip.id)} className="w-full text-left px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)] hover:border-cruze-mint/30 transition-colors">
            <p className="text-sm text-ink font-medium">{trip.originLabel} → {trip.destinationLabel}</p>
            <p className="text-xs text-muted">{trip.crossingName} · {new Date(trip.completedAt).toLocaleDateString(locale)}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
