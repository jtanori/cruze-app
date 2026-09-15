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
  // URLSearchParams encodes on set and decodes on get — never pre-encode
  // (double-encoding produced %257B URLs that only survived because the
  // reader double-decoded in sympathy; any standard reader choked).
  if (destination) params.set("dest", JSON.stringify(destination));
  if (crossingId) params.set("crossing", crossingId);
  const query = params.toString();
  return `/${locale}/trip/setup${query ? `?${query}` : ""}`;
}

export function buildMapsUrl(lat: number, lng: number): string {
  return `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;
}
