"use client";

import { useState, useCallback } from "react";
import { Search, X, MapPin } from "lucide-react";
import { useTripStore } from "@/stores/trip";
import { searchPlaces } from "@/lib/geocoding";
import { useTranslations } from "next-intl";
import type { Place } from "@/types";

const POPULAR_DESTINATIONS = [
  { name: "San Diego", country: "US" as const },
  { name: "Tijuana", country: "MX" as const },
  { name: "Los Angeles", country: "US" as const },
  { name: "Phoenix", country: "US" as const },
  { name: "Monterrey", country: "MX" as const },
  { name: "Tucson", country: "US" as const },
];

interface DestinationSearchProps {
  onComplete: () => void;
}

export function DestinationSearch({ onComplete }: DestinationSearchProps) {
  const t = useTranslations();
  const setDestination = useTripStore((s) => s.setDestination);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);

  const handleSearch = useCallback(async (value: string) => {
    setQuery(value);
    setSelected(null);

    if (value.length < 2) {
      setResults([]);
      return;
    }

    setLoading(true);
    try {
      const places = await searchPlaces(value);
      setResults(places);
    } catch (e) {
      console.error("Search error:", e);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelect = (place: Place) => {
    setSelected(place);
    setQuery(place.name);
    setResults([]);
  };

  const handleSelectPopular = async (name: string) => {
    setLoading(true);
    try {
      const places = await searchPlaces(name);
      if (places.length > 0) {
        handleSelect(places[0]);
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelected(null);
  };

  const handleSubmit = () => {
    if (selected) {
      setDestination({ ...selected, type: "search" });
      onComplete();
    }
  };

  const getCountryLabel = (place: Place): string => {
    return place.country === "MX"
      ? t("onboarding.destination.mexico")
      : t("onboarding.destination.unitedStates");
  };

  const showPopular = !query && !selected && !loading;

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        <h1 className="text-ink text-xl font-bold">{t("onboarding.destination.title")}</h1>
        <p className="text-muted text-sm">
          {t("onboarding.destination.subtitle")}
        </p>
      </div>

      {/* Search input */}
      <div className="relative">
        <div className="flex items-center gap-3 h-[44px] bg-surface border border-border rounded-[var(--radius-md)] px-3 focus-within:border-brand transition-colors">
          <Search className="w-4 h-4 text-faint shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder={t("onboarding.destination.placeholder")}
            className="flex-1 bg-transparent text-ink text-sm outline-none placeholder:text-faint"
          />
          {query && (
            <button onClick={handleClear} className="text-faint hover:text-ink">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Loading indicator */}
        {loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] px-3 py-2.5">
            <div className="flex items-center gap-2 text-faint text-sm">
              <div className="w-4 h-4 border-2 border-faint border-t-transparent rounded-full animate-spin" />
              {t("common.searching")}
            </div>
          </div>
        )}

        {/* Results dropdown */}
        {!loading && results.length > 0 && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] overflow-hidden z-50">
            {results.map((place) => (
              <button
                key={place.id}
                onClick={() => handleSelect(place)}
                className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-subtle transition-colors"
              >
                <MapPin className="w-3.5 h-3.5 text-faint shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-sm font-medium truncate">
                    {place.name}
                  </p>
                  <p className="text-faint text-xs truncate">
                    {place.formattedAddress}
                  </p>
                </div>
                <span className="text-faint text-[10px] font-medium shrink-0">
                  {getCountryLabel(place)}
                </span>
              </button>
            ))}
          </div>
        )}

        {/* Popular destinations */}
        {showPopular && (
          <div className="mt-4 space-y-3">
            <p className="text-faint text-xs font-medium uppercase tracking-wider">
              {t("onboarding.destination.popularDestinations")}
            </p>
            <div className="flex flex-wrap gap-2">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest.name}
                  onClick={() => handleSelectPopular(dest.name)}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-surface border border-border rounded-full text-ink text-xs font-medium hover:bg-surface-elevated transition-colors"
                >
                  <MapPin className="w-3 h-3 text-faint" />
                  {dest.name}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Selected display */}
      {selected && (
        <div className="flex items-center gap-3 bg-surface border border-border rounded-[var(--radius-md)] px-4 py-3">
          <MapPin className="w-4 h-4 text-cruze-green shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-ink text-sm font-medium">{selected.name}</p>
            <p className="text-faint text-xs">{selected.formattedAddress}</p>
          </div>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="w-full h-[44px] flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-[var(--radius-md)] text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("onboarding.destination.continue")}
      </button>
    </div>
  );
}
