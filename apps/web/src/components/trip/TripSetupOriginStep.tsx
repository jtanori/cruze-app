"use client";

import { MapPin, Navigation, Search } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useLocationContext } from "@/components/location/LocationProvider";
import { searchPlaces } from "@/lib/geocoding";
import { reverseGeocode } from "@/lib/geocoding";
import type { Place } from "@/types";
import type { TripDestinationSelection } from "@/lib/trip-navigation";

interface TripSetupOriginStepProps {
  value?: TripDestinationSelection | null;
  onSelect: (origin: TripDestinationSelection) => void;
}

function toOriginSelection(
  id: string,
  name: string,
  lat: number,
  lng: number,
  country: "MX" | "US"
): TripDestinationSelection {
  return { id, name, lat, lng, country };
}

export function TripSetupOriginStep({ value, onSelect }: TripSetupOriginStepProps) {
  const { location } = useLocationContext();
  const [query, setQuery] = useState("");
  const [manual, setManual] = useState(false);
  const [manualResults, setManualResults] = useState<Place[]>([]);
  const [resolving, setResolving] = useState(false);
  const [resolveError, setResolveError] = useState(false);
  const preselectedRef = useRef(false);

  const locationCountry =
    location?.country === "MX" || location?.country === "US"
      ? location.country
      : null;
  const isSelected = value?.id === "current-location";

  // Spec: default origin is the established current location — but only
  // when its country is actually known. Never invent one.
  useEffect(() => {
    if (preselectedRef.current || value || !location || !locationCountry) return;
    preselectedRef.current = true;
    onSelect(
      toOriginSelection(
        "current-location",
        "Mi ubicación actual",
        location.lat,
        location.lng,
        locationCountry
      )
    );
    // Intentionally once per mount; user edits afterwards win.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUseLocation = async () => {
    if (!location) return;
    if (locationCountry) {
      onSelect(
        toOriginSelection(
          "current-location",
          "Mi ubicación actual",
          location.lat,
          location.lng,
          locationCountry
        )
      );
      return;
    }
    // Country unknown: resolve live via reverse-geocode instead of guessing.
    setResolving(true);
    setResolveError(false);
    try {
      const place = await reverseGeocode(location.lat, location.lng);
      if (place && (place.country === "MX" || place.country === "US")) {
        onSelect(
          toOriginSelection(
            "current-location",
            "Mi ubicación actual",
            location.lat,
            location.lng,
            place.country
          )
        );
      } else {
        setResolveError(true);
      }
    } catch {
      setResolveError(true);
    } finally {
      setResolving(false);
    }
  };

  const handleManualSearch = async (value: string) => {
    setQuery(value);
    if (!value || value.length < 2) {
      setManualResults([]);
      return;
    }
    try {
      const places = await searchPlaces(value, 5, null);
      setManualResults(places);
    } catch {
      setManualResults([]);
    }
  };

  const placeLine = location?.placeName ?? null;
  const countryLine =
    location?.city && location?.region
      ? `${location.city}, ${location.region}`
      : locationCountry === "MX"
        ? "México"
        : locationCountry === "US"
          ? "Estados Unidos"
          : null;

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"¿Desde dónde sales?"}</h2>
        <p className="text-sm text-muted mt-1">Tu origen para comparar cruces en tu ruta</p>
      </div>

      {location && !manual && (
        <button
          onClick={handleUseLocation}
          disabled={resolving}
          className={`w-full flex items-center gap-3 px-4 py-4 border rounded-[var(--radius-lg)] transition-colors text-left disabled:opacity-60 ${
            isSelected
              ? "bg-cruze-mint/15 border-cruze-mint/40"
              : "bg-cruze-mint/10 border-cruze-mint/30 hover:bg-cruze-mint/15"
          }`}
        >
          <div className="w-10 h-10 rounded-full bg-cruze-mint flex items-center justify-center shrink-0">
            {isSelected ? (
              <span className="text-midnight text-lg font-bold" aria-hidden="true">✓</span>
            ) : (
              <Navigation className="w-5 h-5 text-midnight" />
            )}
          </div>
          <div>
            <p className="text-sm font-semibold text-ink">Mi ubicación actual</p>
            {resolving && (
              <p className="text-xs text-muted">Determinando ubicación…</p>
            )}
          </div>
        </button>
      )}

      {location && !manual && placeLine && (
        <div className="px-1">
          <p className="text-sm text-ink">{placeLine}</p>
          {countryLine && <p className="text-xs text-muted mt-0.5">{countryLine}</p>}
        </div>
      )}

      {resolveError && !manual && (
        <p className="text-xs text-muted px-1">
          No pudimos determinar el país de tu ubicación. Busca tu punto de partida abajo.
        </p>
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
              onChange={(e) => handleManualSearch(e.target.value)}
              placeholder="Buscar ciudad, dirección..."
              className="w-full h-[48px] pl-10 pr-4 bg-surface border border-border rounded-[var(--radius-lg)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-mint transition-colors"
            />
          </div>
          {manualResults.map((place) => (
            <button
              key={place.id}
              onClick={() =>
                place.country === "MX" || place.country === "US"
                  ? onSelect(
                      toOriginSelection(
                        `manual-${place.id}`,
                        place.name,
                        place.latitude,
                        place.longitude,
                        place.country
                      )
                    )
                  : undefined
              }
              className={`w-full flex items-center gap-3 px-4 py-3 bg-surface border rounded-[var(--radius-lg)] transition-colors text-left ${
                value?.id === `manual-${place.id}`
                  ? "border-cruze-mint/40 bg-cruze-mint/5"
                  : "border-border hover:border-cruze-mint/50"
              }`}
            >
              <MapPin className="w-4 h-4 text-muted shrink-0" />
              <span className="text-sm text-ink">{place.name}</span>
            </button>
          ))}
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
