"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { searchLocations, type GeocodingResult } from "@/lib/geocoding";
import { useNetworkStatus } from "@/lib/network-status";

interface LocationSearchInputProps {
  onSelect: (result: GeocodingResult) => void;
  placeholder?: string;
  className?: string;
}

export function LocationSearchInput({
  onSelect,
  placeholder = "Buscar ubicación...",
  className = "",
}: LocationSearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GeocodingResult[]>([]);
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
      const searchResults = await searchLocations(searchQuery);
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

  const handleSelect = (result: GeocodingResult) => {
    setQuery(result.placeName);
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
          placeholder={placeholder}
          className="w-full h-[48px] pl-10 pr-10 bg-surface border border-border rounded-[var(--radius-lg)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-green transition-colors"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={handleClear}
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
              <p className="text-muted text-sm">Sin conexión a internet</p>
              <p className="text-faint text-xs mt-1">La búsqueda requiere conexión</p>
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
                    <p className="text-sm text-ink">{result.placeName}</p>
                    {result.context.length > 0 && (
                      <p className="text-xs text-faint mt-0.5">
                        {result.context.join(", ")}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          ) : query.length >= 2 ? (
            <div className="px-4 py-6 text-center">
              <p className="text-muted text-sm">No se encontraron resultados</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
