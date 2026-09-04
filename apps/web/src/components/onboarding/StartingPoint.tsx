"use client";

import { useState, useCallback } from "react";
import { Navigation, Search, X, MapPin, ArrowRight } from "lucide-react";
import { useTripStore } from "@/stores/trip";
import { requestGeolocation } from "@/lib/geolocation";
import { reverseGeocode, searchPlaces } from "@/lib/geocoding";
import { useTranslations } from "next-intl";
import type { Place, PlaceType } from "@/types";

interface StartingPointProps {
  onComplete: () => void;
  onBack?: () => void;
}

export function StartingPoint({ onComplete, onBack }: StartingPointProps) {
  const t = useTranslations();
  const destination = useTripStore((s) => s.destination);
  const setStart = useTripStore((s) => s.setStart);
  const setGeolocationPermission = useTripStore(
    (s) => s.setGeolocationPermission
  );

  const [mode, setMode] = useState<"choose" | "search">("choose");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const [selectedType, setSelectedType] = useState<PlaceType>("search");
  const [error, setError] = useState<string | null>(null);

  const handleUseLocation = async () => {
    setGpsLoading(true);
    setError(null);

    try {
      const pos = await requestGeolocation();
      setGeolocationPermission("granted");

      const place = await reverseGeocode(pos.lat, pos.lng);
      if (place) {
        setSelected(place);
        setSelectedType("current_location");
        setMode("choose");
      } else {
        setError(t("onboarding.startingPoint.locationError"));
      }
    } catch {
      setGeolocationPermission("denied");
      setError(t("onboarding.startingPoint.locationDenied"));
      setMode("search");
    } finally {
      setGpsLoading(false);
    }
  };

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
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSelectSearchResult = (place: Place) => {
    setSelected(place);
    setSelectedType("search");
    setQuery(place.name);
    setResults([]);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setSelected(null);
  };

  const handleSubmit = () => {
    if (selected) {
      setStart({ ...selected, type: selectedType });
      onComplete();
    }
  };

  const getExplanation = (): string => {
    if (!destination) return "";
    return destination.country === "MX"
      ? t("onboarding.startingPoint.crossingIntoMexico")
      : t("onboarding.startingPoint.crossingIntoUS");
  };

  return (
    <div className="w-full space-y-8">
      <div className="space-y-2">
        {onBack && (
          <button
            onClick={onBack}
            className="text-muted text-xs font-medium uppercase tracking-wider hover:text-ink transition-colors"
          >
            {t("common.back")}
          </button>
        )}
        <h1 className="text-ink text-xl font-bold">{t("onboarding.startingPoint.title")}</h1>
        <p className="text-muted text-sm">{getExplanation()}</p>
      </div>

      {/* Destination context */}
      {destination && (
        <div className="flex items-center gap-3 bg-surface border border-border rounded-[var(--radius-md)] px-4 py-3">
          <MapPin className="w-4 h-4 text-faint shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-faint text-xs font-medium uppercase tracking-wider">
              {t("onboarding.startingPoint.destination")}
            </p>
            <p className="text-ink text-sm font-medium">{destination.name}</p>
          </div>
        </div>
      )}

      {/* Choose mode */}
      {mode === "choose" && !selected && (
        <div className="space-y-4">
          {/* GPS Button */}
          <button
            onClick={handleUseLocation}
            disabled={gpsLoading}
            className="w-full flex items-center gap-4 bg-surface border border-border rounded-[var(--radius-md)] px-4 py-4 active:bg-surface-elevated transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-brand/10 flex items-center justify-center shrink-0">
              {gpsLoading ? (
                <div className="w-5 h-5 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-brand" />
              )}
            </div>
            <div className="flex-1 text-left">
              <p className="text-ink text-sm font-medium">
                {t("onboarding.startingPoint.useLocation")}
              </p>
              <p className="text-faint text-xs">
                {t("onboarding.startingPoint.useLocationDescription")}
              </p>
            </div>
            <ArrowRight className="w-4 h-4 text-faint" />
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-border" />
            <span className="text-faint text-xs">{t("onboarding.startingPoint.or")}</span>
            <div className="flex-1 h-px bg-border" />
          </div>

          {/* Search button */}
          <button
            onClick={() => setMode("search")}
            className="w-full flex items-center gap-4 bg-surface border border-border rounded-[var(--radius-md)] px-4 py-4 active:bg-surface-elevated transition-colors"
          >
            <div className="w-10 h-10 rounded-full bg-surface-elevated flex items-center justify-center shrink-0">
              <Search className="w-5 h-5 text-faint" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-ink text-sm font-medium">
                {t("onboarding.startingPoint.enterManually")}
              </p>
              <p className="text-faint text-xs">{t("onboarding.startingPoint.searchPlaceholder")}</p>
            </div>
            <ArrowRight className="w-4 h-4 text-faint" />
          </button>

          {/* Error message */}
          {error && (
            <p className="text-critical text-sm text-center">{error}</p>
          )}
        </div>
      )}

      {/* Search mode */}
      {mode === "search" && !selected && (
        <div className="space-y-4">
          <button
            onClick={() => {
              setMode("choose");
              setQuery("");
              setResults([]);
              setError(null);
            }}
            className="text-muted text-xs font-medium uppercase tracking-wider hover:text-ink transition-colors"
          >
            {t("onboarding.startingPoint.backToOptions")}
          </button>

          <div className="relative">
            <div className="flex items-center gap-3 h-[44px] bg-surface border border-border rounded-[var(--radius-md)] px-3 focus-within:border-brand transition-colors">
              <Search className="w-4 h-4 text-faint shrink-0" />
              <input
                type="text"
                value={query}
                onChange={(e) => handleSearch(e.target.value)}
                placeholder={t("onboarding.startingPoint.searchPlaceholder")}
                className="flex-1 bg-transparent text-ink text-sm outline-none placeholder:text-faint"
                autoFocus
              />
              {query && (
                <button
                  onClick={handleClear}
                  className="text-faint hover:text-ink"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {loading && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] px-3 py-2.5">
                <div className="flex items-center gap-2 text-faint text-sm">
                  <div className="w-4 h-4 border-2 border-faint border-t-transparent rounded-full animate-spin" />
                  {t("common.searching")}
                </div>
              </div>
            )}

            {!loading && results.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] overflow-hidden z-10">
                {results.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelectSearchResult(place)}
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
                    <span className="text-faint text-xs font-medium shrink-0">
                      {place.country === "MX"
                        ? t("onboarding.destination.mexico")
                        : t("onboarding.destination.unitedStates")}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Selected display */}
      {selected && (
        <div className="space-y-4">
          <div className="flex items-center gap-3 bg-surface border border-border rounded-[var(--radius-md)] px-4 py-3">
            <MapPin className="w-4 h-4 text-cruze-green shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-faint text-xs font-medium uppercase tracking-wider">
                {t("onboarding.startingPoint.startingPoint")}
              </p>
              <p className="text-ink text-sm font-medium">{selected.name}</p>
              <p className="text-faint text-xs">{selected.formattedAddress}</p>
            </div>
          </div>

          <button
            onClick={() => {
              setSelected(null);
              setQuery("");
              setMode("choose");
            }}
            className="text-muted text-xs font-medium uppercase tracking-wider hover:text-ink transition-colors"
          >
            {t("onboarding.startingPoint.changeStartingPoint")}
          </button>
        </div>
      )}

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={!selected}
        className="w-full h-[44px] flex items-center justify-center gap-2 bg-brand hover:bg-brand-dark active:bg-brand-dark rounded-[var(--radius-md)] text-white text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
      >
        {t("onboarding.startingPoint.findCrossing")}
        <ArrowRight className="w-4 h-4" />
      </button>
    </div>
  );
}
