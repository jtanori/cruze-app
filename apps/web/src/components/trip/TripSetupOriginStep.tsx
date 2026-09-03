"use client";

import { MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";
import { useLocationStore } from "@/stores/location";

interface TripSetupOriginStepProps {
  onSelect: (origin: { lat: number; lng: number; label: string }) => void;
}

export function TripSetupOriginStep({ onSelect }: TripSetupOriginStepProps) {
  const { location } = useLocationStore();
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState(false);

  const handleUseLocation = () => {
    if (location) {
      onSelect({ lat: location.lat, lng: location.lng, label: "Mi ubicaci\u00F3n actual" });
    }
  };

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"\u00BFDesde d\u00F3nde sales?"}</h2>
        <p className="text-sm text-muted mt-1">Tu origen para comparar cruces en tu ruta</p>
      </div>

      {location && !manual && (
        <button
          onClick={handleUseLocation}
          className="w-full flex items-center gap-3 px-4 py-4 bg-cruze-mint/10 border border-cruze-mint/30 rounded-[var(--radius-lg)] hover:bg-cruze-mint/15 transition-colors text-left"
        >
          <div className="w-10 h-10 rounded-full bg-cruze-mint flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 text-midnight" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Mi ubicaci\u00F3n actual</p>
            <p className="text-xs text-muted">Usar GPS para origen</p>
          </div>
        </button>
      )}

      {!manual ? (
        <button
          onClick={() => setManual(true)}
          className="w-full text-center text-sm font-medium text-muted hover:text-ink transition-colors py-2"
        >
          Ingresar punto de partida
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Buscar ciudad, direcci\u00F3n..."
              className="w-full h-[48px] pl-10 pr-4 bg-surface border border-border rounded-[var(--radius-lg)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-mint transition-colors"
            />
          </div>
          {query.length > 2 && (
            <button
              onClick={() => onSelect({ lat: 32.5, lng: -117.0, label: query })}
              className="w-full flex items-center gap-3 px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)] hover:border-cruze-mint/50 transition-colors text-left"
            >
              <MapPin className="w-4 h-4 text-muted shrink-0" />
              <span className="text-sm text-ink">{query}</span>
            </button>
          )}
          <button
            onClick={() => setManual(false)}
            className="w-full text-center text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            {"\u2190 Volver a opciones"}
          </button>
        </div>
      )}
    </div>
  );
}
