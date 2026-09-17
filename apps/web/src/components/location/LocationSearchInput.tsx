"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, X, Loader2 } from "lucide-react";
import { searchPlaces } from "@/lib/geocoding";
import type { Place } from "@/types";
import { useNetworkStatus } from "@/lib/network-status";

interface LocationSearchInputProps {
  onSelect: (result: Place) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearchInput({
  onSelect,
  placeholder,
  className = "",
}: LocationSearchInputProps) {
  const t = useTranslations();
  const effectivePlaceholder = placeholder ?? t("onboarding.location.search.defaultPlaceholder");
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Place[]>([]);
  const [loading, setLoading] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const { isReachable } = useNetworkStatus();
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  const handleSearch = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      setShowResults(false);
      return;
    }

    if (!isReachable) {
      setResults([]);
      setShowResults(true);
      return;
    }

    setLoading(true);
    try {
      // searchPlaces carries country — required so manual locations resolve
      // HIGH confidence instead of falling back to bounding boxes.
      const searchResults = await searchPlaces(searchQuery, 5, null);
      setResults(searchResults);
      setShowResults(true);
    } catch (error) {
      console.error("Search failed:", error);
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [isReachable]);

  const handleInputChange = (value: string) => {
    setQuery(value);

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
    inputRef.current?.focus();
  };

  const handleSelect = (result: Place) => {
    setQuery(result.name);
    setShowResults(false);
    onSelect(result);
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-faint" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => query.length >= 2 && setShowResults(true)}
          placeholder={effectivePlaceholder}
          className="w-full h-12 pl-10 pr-10 bg-surface border border-border rounded-[var(--radius-lg)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-green transition-colors"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
            aria-label={t("onboarding.location.search.clear")}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            <X className="w-4 h-4 text-faint" />
          </button>
        )}
        {loading && (
          <Loader2 className="absolute right-10 top-1/2 -translate-y-1/2 w-4 h-4 text-faint animate-spin" />
        )}
      </div>

      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-border rounded-[var(--radius-lg)] shadow-lg overflow-hidden z-50">
          {!isReachable ? (
            <div className="px-4 py-6 text-center">
              <p className="text-muted text-sm">{t("onboarding.location.search.offlineTitle")}</p>
              <p className="text-faint text-xs mt-1">{t("onboarding.location.search.offlineBody")}</p>
            </div>
          ) : results.length > 0 ? (
            <div className="divide-y divide-border">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleSelect(result)}
                  className="w-full flex items-start gap-3 px-4 py-3 text-left hover:bg-surface-elevated transition-colors"
                >
                  <Search className="w-4 h-4 text-faint mt-0.5 shrink-0" />
                  <div>
                    <p className="text-sm text-ink">{result.name}</p>
                    {result.formattedAddress && (
                      <p className="text-xs text-faint mt-0.5">
                        {result.formattedAddress}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-muted text-sm">{t("onboarding.location.search.noResults")}</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
