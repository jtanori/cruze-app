/**
 * Mapbox Place → domain destination transformation.
 * The external Place representation never reaches page logic.
 */
import type { Place } from "@/types";
import type { TripDestinationSelection } from "./trip-navigation";

export function mapPlaceToDestination(place: Place): TripDestinationSelection {
  return {
    id: place.id,
    name: place.name,
    lat: place.latitude,
    lng: place.longitude,
    country: place.country,
  };
}
