/**
 * Mapbox Place → domain destination transformation.
 * The external Place representation never reaches page logic.
 */
import type { Place } from "@/types";
import type { TripDestinationSelection } from "./trip-navigation";

export function mapPlaceToDestination(
  place: Place & { borderCrossingId?: string }
): TripDestinationSelection {
  return {
    id: place.id,
    name: place.name,
    lat: place.latitude,
    lng: place.longitude,
    country: place.country,
    ...(place.borderCrossingId ? { crossingCandidateId: place.borderCrossingId } : {}),
  };
}
