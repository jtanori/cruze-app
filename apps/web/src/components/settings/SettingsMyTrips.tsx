"use client";

import { EmptyState } from "@/components/primitives/EmptyState";

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
  if (trips.length === 0) {
    return <EmptyState title="Sin viajes completados" description="Los viajes aparecer\u00E1n aqu\u00ED despu\u00E9s de completarlos." />;
  }

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-ink">Mis viajes</h2>
      <div className="space-y-2">
        {trips.map((t) => (
          <button key={t.id} onClick={() => onSelect?.(t.id)} className="w-full text-left px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)] hover:border-cruze-mint/30 transition-colors">
            <p className="text-sm text-ink font-medium">{t.originLabel} → {t.destinationLabel}</p>
            <p className="text-xs text-muted">{t.crossingName} · {new Date(t.completedAt).toLocaleDateString()}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
