"use client";

import { MapPin, Navigation, Search } from "lucide-react";
import { useState } from "react";
import { useLocationContext } from "@/components/location/LocationProvider";
import type { TripDestinationSelection } from "@/lib/trip-navigation";

interface TripSetupOriginStepProps {
  value?: TripDestinationSelection | null;
  onSelect: (origin: TripDestinationSelection) => void;
}

export function TripSetupOriginStep({ value, onSelect }: TripSetupOriginStepProps) {
  const { location } = useLocationContext();
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState(false);

  const handleUseLocation = () => {
    if (location) {
      onSelect({
        id: "current-location",
        name: "Mi ubicación actual",
        lat: location.lat,
        lng: location.lng,
        country: location.country === "MX" ? "MX" : "US",
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"¿Desde dónde sales?"}</h2>
        <p className="text-sm text-muted mt-1">Tu origen para comparar cruces en tu ruta</p>
      </div>

      {location && !manual && (
        <button
          onClick={handleUseLocation}
          className={`w-full flex items-center gap-3 px-4 py-4 border rounded-[var(--radius-lg)] transition-colors text-left ${
            value?.id === "current-location"
              ? "bg-cruze-mint/15 border-cruze-mint/40"
              : "bg-cruze-mint/10 border-cruze-mint/30 hover:bg-cruze-mint/15"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-cruze-mint flex items-center justify-center shrink-0">
            <Navigation className="w-5 h-5 text-midnight" />
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Mi ubicación actual</p>
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
              placeholder="Buscar ciudad, dirección..."
              className="w-full h-[48px] pl-10 pr-4 bg-surface border border-border rounded-[var(--radius-lg)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-mint transition-colors"
            />
          </div>
          {query.length > 2 && (
            <button
              onClick={() =>
                onSelect({
                  id: `manual-${query}`,
                  name: query,
                  lat: 32.5,
                  lng: -117.0,
                  country: "US",
                })
              }
              className={`w-full flex items-center gap-3 px-4 py-3 bg-surface border rounded-[var(--radius-lg)] transition-colors text-left ${
                value?.name === query
                  ? "border-cruze-mint/40 bg-cruze-mint/5"
                  : "border-border hover:border-cruze-mint/50"
              }`}
            >
              <MapPin className="w-4 h-4 text-muted shrink-0" />
              <span className="text-sm text-ink">{query}</span>
            </button>
          )}
          <button
            onClick={() => setManual(false)}
            className="w-full text-center text-sm font-medium text-muted hover:text-ink transition-colors"
          >
            {"← Volver a opciones"}
          </button>
        </div>
      )}
    </div>
  );
}
