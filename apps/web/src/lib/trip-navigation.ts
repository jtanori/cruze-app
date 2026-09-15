/**
 * Pure trip-navigation URL builders: UI event → build URL → navigate.
 * No routing, no window access — pages own the side effect.
 */

export interface TripDestinationSelection {
  id: string;
  name: string;
  lat: number;
  lng: number;
  country: "MX" | "US";
  /** Border-relevant candidate gate — never rewrites the destination. */
  crossingCandidateId?: string;
}

export function buildSetupUrl(
  locale: string,
  destination?: TripDestinationSelection | null,
  crossingId?: string | null
): string {
  const params = new URLSearchParams();
  if (destination) params.set("dest", encodeURIComponent(JSON.stringify(destination)));
  if (crossingId) params.set("crossing", crossingId);
  const query = params.toString();
  return `/${locale}/trip/setup${query ? `?${query}` : ""}`;
}

export function buildMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
