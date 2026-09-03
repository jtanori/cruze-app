// @cruce/contracts — shared API response types + crossing data model
// Single source of truth consumed by Next.js (TS) and Flutter (via json_serializable / freezed).

export type CrossingId = string;

export type OperationalStatus = "operational" | "limited" | "closed" | "unknown";
export type DataFreshness = "live" | "recent" | "stale" | "unavailable";

export interface CrossingWait {
  crossingId: CrossingId;
  crossingName: string;
  mexicanCity: string;
  usCity: string;
  lat: number;
  lng: number;
  country: "MX" | "US";
  operationalStatus: OperationalStatus;
  freshness: DataFreshness;
  northbound?: { standard: number | null; readyLane: number | null; sentri: number | null };
  southbound?: { standard: number | null; readyLane: number | null; sentri: number | null };
  updatedAt: string; // ISO
}

export interface RecommendationRequest {
  origin: { lat: number; lng: number };
  destination: { lat: number; lng: number };
  travelMode: "walking" | "privateVehicle" | "commercial";
  direction?: "northbound" | "southbound";
  accessType?: "standard" | "readyLane" | "sentri";
}

export interface RecommendationResponse {
  primary: CrossingWait & { reason: string[]; totalJourneyMinutes: number };
  alternatives: Array<CrossingWait & { deltaMinutes: number; totalJourneyMinutes: number }>;
}

export interface AvisoContract {
  id: string;
  type: "crossing_changed" | "recommendation_changed" | "crossing_closed" | "wait_increased" | "wait_decreased" | "trip_reminder" | "checklist_reminder" | "data_warning" | "unusual_condition";
  severity: "info" | "warning" | "critical";
  title: string;
  description: string;
  crossingId?: string;
  timestamp: string;
}
