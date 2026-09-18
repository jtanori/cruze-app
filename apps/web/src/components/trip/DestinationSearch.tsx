"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, MapPin, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/primitives/Button";
import { searchPlaces } from "@/lib/geocoding";
import type { Place } from "@/types";
import { getTargetDestinationCountrySafe, filterDestinations } from "@/lib/destination-filter";
import type { RelevantPlace } from "@/lib/destination-filter";
import type { ResolvedCountry } from "@/lib/country-resolution";

interface DestinationSearchProps {
  userLat: number;
  userLng: number;
  /** Resolved user country — preferred over coordinate detection. */
  userCountry?: ResolvedCountry;
  onSelect: (place: Place) => void;
  onNext?: () => void;
  placeholder?: string;
  className?: string;
}

export function DestinationSearch({
  userLat,
  userLng,
  userCountry: userCountryProp,
  onSelect,
  onNext,
  placeholder,
  className = "",
}: DestinationSearchProps) {
  const t = useTranslations();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RelevantPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [selected, setSelected] = useState<Place | null>(null);
  const [searchError, setSearchError] = useState<"timeout" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Target country from the resolved location country only.
  // UNKNOWN (or absent prop) never forces a side: unfiltered + generic copy.
  const hasKnownCountry = !!userCountryProp && userCountryProp !== "UNKNOWN";
  // Null when unknown — placeholders and filters go generic, never invented.
  const targetCountry = getTargetDestinationCountrySafe(
    hasKnownCountry ? userCountryProp : "UNKNOWN"
  );

  // Get i18n country name (short form for inline copy: EE.UU. / the U.S.)
  const targetCountryName =
    targetCountry === "MX"
      ? t("common.mexicoShort")
      : targetCountry === "US"
        ? t("common.unitedStatesShort")
        : null;

  // In-flight request handle + last dispatched query (dedup + abort).
  const abortRef = useRef<AbortController | null>(null);
  const lastQueryRef = useRef<string>("");

  const abortInflight = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      lastQueryRef.current = searchQuery;
      setResults([]);
      setShowResults(false);
      return;
    }
    // Tail-apply: an identical query with visible results needs no refetch.
    if (searchQuery === lastQueryRef.current && results.length > 0) return;
    lastQueryRef.current = searchQuery;

    // New keystroke supersedes: abort the previous request so a slow
    // response can never overwrite newer results.
    abortInflight();
    const controller = new AbortController();
    abortRef.current = controller;
    setSearchError(null);
    // Hard 15s ceiling so a hung upstream can never spin the indicator forever.
    const timeout = AbortSignal.timeout(15000);
    const signal =
      typeof AbortSignal.any === "function"
        ? AbortSignal.any([controller.signal, timeout])
        : controller.signal;

    setLoading(true);
    try {
      // Strict server-side country filter when the target side is known;
      // both sides when UNKNOWN (client filter below stays a safety net).
      // Request both sides: same-country border-relevant rows (e.g. Sonoyta
      // for MX users) only exist in mx,us results. filterDestinations below
      // is the single discrimination point (opposite + relevant only).
      const allPlaces = await searchPlaces(searchQuery, 10, null, signal);
      // Superseded while awaiting: never touch newer state — but if nothing
      // superseded us (cleared/unmounted path nulled the ref), release loading.
      if (signal.aborted) {
        if (abortRef.current === null) setLoading(false);
        return;
      }
      if (process.env.NEXT_PUBLIC_CRUZE_DEBUG_SEARCH === "1") {
        console.debug(
          `[search-debug] client q=${JSON.stringify(searchQuery)} target=${targetCountry ?? "both"} ` +
            `received=${allPlaces.length}`
        );
      }
      // Border-relevant same-country places pass with a candidate attached;
      // the destination itself is never rewritten.
      const filtered = filterDestinations(
        allPlaces,
        userCountryProp ?? "UNKNOWN"
      );
      if (process.env.NEXT_PUBLIC_CRUZE_DEBUG_SEARCH === "1") {
        console.debug(
          `[search-debug] client filtered=${filtered.length} ` +
            filtered.map((p) => `${p.name}(${p.country}${p.borderCrossingId ? `+${p.borderCrossingId}` : ""})`).join(", ")
        );
      }
      setResults(filtered.slice(0, 5));
      setShowResults(true);
      setSearchError(null);
    } catch (error) {
      // Timeout is the only error that surfaces: it offers a retry instead
      // of masquerading as an empty result set.
      if (error instanceof DOMException && error.name === "TimeoutError") {
        setSearchError("timeout");
        setResults([]);
        setShowResults(true);
      } else {
        console.error("Search failed:", error);
        setResults([]);
      }
    } finally {
      if (abortRef.current === controller) {
        abortRef.current = null;
        setLoading(false);
      }
    }
  }, [userLat, userLng, userCountryProp, targetCountry, results.length, abortInflight]);

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
    abortInflight();
    lastQueryRef.current = "";
    setQuery("");
    setResults([]);
    setShowResults(false);
    setSelected(null);
    setLoading(false);
    inputRef.current?.focus();
  };

  const handleSelect = (place: Place) => {
    abortInflight();
    // Input owns the selection: it holds the value, results stay cached so
    // focus can reopen them, and the Next CTA arms off `selected`.
    lastQueryRef.current = place.name;
    setSelected(place);
    setQuery(place.name);
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
      abortRef.current?.abort();
      abortRef.current = null;
    };
  }, []);

  const defaultPlaceholder = targetCountryName
    ? t("trip.empty.searchPlaceholder", { country: targetCountryName })
    : t("trip.empty.searchPlaceholderGeneric");

  // Blur hides the dropdown — unless focus moves into it (result tap),
  // in which case the button's onMouseDown already prevented blur.
  // A pending debounce is cancelled so stale results can't reopen it.
  const handleBlur = (e: React.FocusEvent) => {
    if (e.currentTarget.contains(e.relatedTarget as Node | null)) return;
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    abortInflight();
    setShowResults(false);
  };

  // Reopen contract: cached results return on focus only when they belong
  // to the current query (post-select, or untouched since searching).
  const canReopen = results.length > 0 && query === lastQueryRef.current;

  const handleFocus = () => {
    if (canReopen) setShowResults(true);
  };

  return (
    <div className={`space-y-2 sm:space-y-3 ${className}`}>
      {/* Search Input */}
      <div className="relative space-y-2 sm:space-y-3" onBlur={handleBlur}>
        <div className="flex items-center gap-3 h-14 bg-surface-elevated border border-border rounded-[var(--radius-md)] px-4 focus-within:border-cruze-mint transition-colors">
          <Search className="w-4 h-4 text-faint shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleFocus}
              placeholder={placeholder || defaultPlaceholder}
              className="flex-1 bg-transparent text-ink text-sm outline-none placeholder:text-faint"
              autoComplete="off"
            />
          {loading && (
            <div className="flex items-center gap-2 text-faint text-sm">
              <div className="w-4 h-4 border-2 border-faint border-t-transparent rounded-full animate-spin" />
            </div>
          )}
          {query && (
            <button
              onClick={handleClear}
              className="text-faint hover:text-ink shrink-0"
              aria-label={t("common.close")}
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {onNext && (
            <Button
              variant="primary"
              size="sm"
              onClick={handleNext}
              disabled={!selected}
              aria-label={t("common.next")}
              className="shrink-0"
            >
              <ArrowRight className="w-4 h-4" />
            </Button>
          )}
        </div>
        <p className="text-faint text-xs px-1">{t("trip.empty.searchHint")}</p>

        {/* Results Dropdown */}
        {showResults && !loading && (
          <div className="absolute top-full left-0 right-0 mt-1 bg-surface-elevated border border-border rounded-[var(--radius-md)] overflow-hidden z-50">
            {results.length > 0 ? (
              <div className="divide-y divide-border">
                {results.map((place) => (
                  <button
                    key={place.id}
                    // iOS Safari doesn't focus buttons on tap: without this,
                    // blur (relatedTarget null) hides the dropdown before
                    // click fires and selection silently dies.
                    onMouseDown={(e) => e.preventDefault()}
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
                      {place.borderCrossingName && (
                        <p className="text-cruze-green text-xs truncate">
                          {t("trip.empty.nearbyCrossing", { name: place.borderCrossingName })}
                        </p>
                      )}
                    </div>
                    <span className="text-faint text-xs font-medium shrink-0">
                      {place.country === "MX" ? t("common.mexico") : t("common.unitedStates")}
                    </span>
                  </button>
                ))}
              </div>
            ) : searchError === "timeout" ? (
                <div className="px-4 py-6 text-center space-y-3">
                  <p className="text-muted text-sm">
                    {t("trip.empty.searchTimeout")}
                  </p>
                  <button
                    onClick={() => {
                      setSearchError(null);
                      handleSearch(query);
                    }}
                    className="px-4 py-2 text-sm font-medium text-cruze-green bg-cruze-green/10 border border-cruze-green/30 rounded-full hover:bg-cruze-green/20 transition-colors"
                  >
                    {t("trip.empty.retrySearch")}
                  </button>
                </div>
            ) : (
                <div className="px-4 py-6 text-center">
                  <p className="text-muted text-sm">
                    {targetCountryName
                      ? t("trip.empty.noResultsInCountry", { country: targetCountryName })
                      : t("trip.empty.noResultsGeneric")}
                  </p>
                </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}