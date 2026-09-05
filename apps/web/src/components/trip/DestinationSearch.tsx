"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, MapPin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { searchPlaces } from "@/lib/geocoding";
import type { Place } from "@/types";
import { detectUserCountry, getTargetDestinationCountry, filterDestinationsByCountry, getTargetCountryCode } from "@/lib/destination-filter";

interface DestinationSearchProps {
  userLat: number;
  userLng: number;
  onSelect: (place: Place) => void;
  onNext?: () => void;
  placeholder?: string;
  className?: string;
}

export function DestinationSearch({
  userLat,
  userLng,
  onSelect,
  onNext,
  placeholder,
  className = "",
}: DestinationSearchProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Determine target country
  const userCountry = detectUserCountry(userLat, userLng);
  const targetCountry = getTargetDestinationCountry(userCountry);
  const targetCountryCode = getTargetCountryCode(userLat, userLng);
  
  // Get i18n country name
  const targetCountryName = targetCountry === "MX" ? t("common.mexico") : t("common.unitedStates");

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    setLoading(true);
    try {
      // Search all places first
      const allPlaces = await searchPlaces(searchQuery, 10);
      // Filter by target country
      const filtered = filterDestinationsByCountry(allPlaces, userLat, userLng);
      setResults(filtered.slice(0, 5));
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [userLat, userLng]);

  const handleInputChange = (value: string) => {
    setQuery(value);
    setSelected(null);

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      handleSearch(value);
    }, 300);
  };

  const handleClear = () => {
    setQuery("");
    setResults([]);
    setShowResults(false);
    setSelected(null);
    inputRef.current?.focus();
  };

  const handleSelect = (place: Place) => {
    setSelected(place);
    setQuery(place.name);
    setResults([]);
    setShowResults(false);
    onSelect(place);
  };

  const handleNext = () => {
    if (selected && onNext) {
      onNext();
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  const defaultPlaceholder = t("trip.empty.searchPlaceholder", { country: targetCountryName });

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Search Input */}
      <div className="relative">
        <div className="flex items-center gap-3 h-[48px] bg-surface border border-border rounded-[var(--radius-md)] px-3 focus-within:border-cruze-green transition-colors">
          <Search className="w-4 h-4 text-faint shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={() => query.length >= 2 && setShowResults(true)}
            placeholder={placeholder || defaultPlaceholder}
            className="flex-1 bg-transparent text-ink text-sm outline-none placeholder:text-faint"
            autoComplete="off"
            disabled={loading}
          />
          {loading && (
            <div className="flex items-center gap-2 text-faint text-sm">
              <div className="w-4 h-4 border-2 border-faint border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {query && !loading && (
            <button
              onClick={handleClear}
              className="text-faint hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Results Dropdown */}
        {showResults && !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] overflow-hidden z-50">
            {results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map((place) => (
                  <button
                    key={place.id}
                    onClick={() => handleSelect(place)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 text-left hover:bg-surface-subtle transition-colors"
                  >
                    <MapPin className="w-4 h-4 text-faint shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-ink text-sm font-medium truncate">
                        {place.name}
                      </p>
                      {place.formattedAddress && (
                        <p className="text-faint text-xs truncate">
                          {place.formattedAddress}
                        </p>
                      )}
                    </div>
                    <span className="text-faint text-xs font-medium shrink-0">
                      {place.country === "MX" ? t("common.mexico") : t("common.unitedStates")}
                    </span>
                  </button>
                ))}
              </div>
            ) : (
              <div className="px-4 py-6 text-center">
                <p className="text-muted text-sm">
                  {t("trip.empty.noResultsInCountry", { country: targetCountryName })}
                </p>
              </div>
            )}
          </div>
        )}

        {/* Selected Place Display */}
        {selected && (
          <div className="flex items-center gap-3 bg-surface border border-cruze-green/30 rounded-[var(--radius-md)] px-4 py-3">
            <MapPin className="w-4 h-4 text-cruze-green shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-ink text-sm font-medium">{selected.name}</p>
              <p className="text-faint text-xs">{selected.formattedAddress}</p>
            </div>
            <button
              onClick={handleClear}
              className="text-faint hover:text-ink"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Next Button */}
        {onNext && (
          <button
            onClick={handleNext}
            disabled={!selected}
            className="w-full h-[48px] flex items-center justify-center gap-2 bg-cruze-mint text-midnight font-semibold text-sm rounded-[var(--radius-lg)] hover:opacity-90 transition-opacity disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {t("common.next")}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}