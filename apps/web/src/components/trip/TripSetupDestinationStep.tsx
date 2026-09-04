"use client";

import { useState } from "react";
import { Search, MapPin, Clock } from "lucide-react";
import { useTranslations } from "next-intl";

interface TripSetupDestinationStepProps {
  onSelect: (destination: { lat: number; lng: number; label: string }) => void;
  recentDestinations?: { label: string; lat: number; lng: number }[];
}

export function TripSetupDestinationStep({ onSelect, recentDestinations = [] }: TripSetupDestinationStepProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");

  const handleSelect = (label: string, lat: number, lng: number) => {
    onSelect({ label, lat, lng });
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"\u00BFAd\u00F3nde vas?"}</h2>
        <p className="text-sm text-muted mt-1">{"Busca tu destino"}</p>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("onboarding.destination.placeholder")}
          className="w-full h-[48px] pl-10 pr-4 bg-surface border border-border rounded-[var(--radius-lg)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-mint transition-colors"
        />
      </div>

      {recentDestinations.length > 0 && (
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-muted mb-2">Recientes</p>
          <div className="space-y-2">
            {recentDestinations.map((d) => (
              <button
                key={d.label}
                onClick={() => handleSelect(d.label, d.lat, d.lng)}
                className="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)] hover:border-cruze-mint/50 transition-colors text-left"
              >
                <Clock className="w-4 h-4 text-muted shrink-0" />
                <span className="text-sm text-ink">{d.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">Destinos populares</p>
        {[
          { label: "Tijuana, MX", lat: 32.5149, lng: -117.0382 },
          { label: "Ciudad Juarez, MX", lat: 31.6904, lng: -106.4245 },
          { label: "San Diego, CA", lat: 32.7157, lng: -117.1611 },
        ].map((d) => (
          <button
            key={d.label}
            onClick={() => handleSelect(d.label, d.lat, d.lng)}
            className="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)] hover:border-cruze-mint/50 transition-colors text-left"
          >
            <MapPin className="w-4 h-4 text-muted shrink-0" />
            <span className="text-sm text-ink">{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
