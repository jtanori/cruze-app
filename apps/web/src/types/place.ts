export interface Place {
  id: string;
  name: string;
  formattedAddress?: string;
  latitude: number;
  longitude: number;
  country: "MX" | "US";
  countryCode: string;
  city?: string;
  region?: string;
}

export type PlaceType = "current_location" | "search";

export interface StartPlace extends Place {
  type: PlaceType;
}

export interface DestinationPlace extends Place {
  type: "search";
}

export type TripType =
  | "cross_border"
  | "same_country"
  | "unsupported"
  | "unknown";

export type TripDirection = "MX_TO_US" | "US_TO_MX";

export interface CrossingLane {
  name: string;
  waitTime: number;
  isOpen: boolean;
  trend?: "improving" | "stable" | "worsening";
}

export interface CrossingFacts {
  hours: string;
  pedestrianAccess: boolean;
  commercialAccess: boolean;
}

/**
 * @deprecated Use `SelectedCrossing` from `@/lib/recommendation/types` for trip store,
 * or `CrossingEntity` from `@/types` for crossing details display.
 * This flat recommendation type is retained for onboarding mock engine compatibility only.
 */
export interface CrossingRecommendation {
  crossingId: string;
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  mexicanState: string;
  usState: string;
  mexicanAddress: string;
  usAddress: string;
  corridor: string;
  coordinates: { lat: number; lng: number };
  waitTime: number;
  totalJourneyTime: number;
  score: number;
  reason: {
    headline: string;
    detail?: string;
  };
  confidence: "high" | "medium" | "low";
  generatedAt: string;
  lanes: CrossingLane[];
  facts: CrossingFacts;
  alternatives: Array<{
    crossingId: string;
    crossingName: string;
    mexicanCity: string;
    usCity: string;
    mexicanState: string;
    usState: string;
    waitTime: number;
    totalJourneyTime: number;
    deltaMinutes: number;
  }>;
}
