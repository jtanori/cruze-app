"use client";

import { useLocationContext } from "@/components/location/LocationProvider";
import { DestinationSearch } from "./DestinationSearch";
import { mapPlaceToDestination } from "@/lib/trip-destination";
import type { TripDestinationSelection } from "@/lib/trip-navigation";

interface TripSetupDestinationStepProps {
  onSelect: (destination: TripDestinationSelection) => void;
}

export function TripSetupDestinationStep({ onSelect }: TripSetupDestinationStepProps) {
  const { location } = useLocationContext();

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"\u00BFAd\u00F3nde vas?"}</h2>
        <p className="text-sm text-muted mt-1">{"Busca tu destino"}</p>
      </div>

      <DestinationSearch
        userLat={location?.lat ?? 0}
        userLng={location?.lng ?? 0}
        userCountry={location?.country}
        onSelect={(place) => {
          onSelect(mapPlaceToDestination(place));
        }}
      />
    </div>
  );
}
