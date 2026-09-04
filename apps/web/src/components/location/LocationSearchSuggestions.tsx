"use client";

import { MapPin, Loader2 } from "lucide-react";
import type { GeocodingResult } from "@/lib/geocoding";

interface LocationSearchSuggestionsProps {
  suggestions: GeocodingResult[];
  onSelect: (result: GeocodingResult) => void;
  loading?: boolean;
  className?: string;
}

export function LocationSearchSuggestions({
  suggestions,
  onSelect,
  loading = false,
  className = "",
}: LocationSearchSuggestionsProps) {
  if (loading) {
    return (
      <div className={`flex items-center justify-center py-4 ${className}`}>
        <Loader2 className="w-5 h-5 text-faint animate-spin" />
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className={`space-y-1 ${className}`}>
      <p className="text-xs text-faint px-1 mb-2">Ubicaciones cercanas</p>
      {suggestions.map((suggestion) => (
        <button
          key={suggestion.id}
          onClick={() => onSelect(suggestion)}
          className="w-full flex items-center gap-3 px-3 py-2.5 bg-surface-elevated rounded-[var(--radius-md)] text-left hover:bg-surface transition-colors"
        >
          <MapPin className="w-4 h-4 text-cruze-green shrink-0" />
          <div className="min-w-0">
            <p className="text-sm text-ink truncate">{suggestion.placeName}</p>
            {suggestion.context.length > 0 && (
              <p className="text-xs text-faint truncate">
                {suggestion.context.join(", ")}
              </p>
            )}
          </div>
        </button>
      ))}
    </div>
  );
}
