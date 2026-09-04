// ─── Place (Geocoding) ───
export type { Place, StartPlace, DestinationPlace, PlaceType, TripType, TripDirection, CrossingRecommendation, CrossingLane, CrossingFacts } from "./place";

// ─── Traveler Profile ───
export type { TravelerProfile, CrossingMode, AccessType, DocumentCategory, TrustedTraveler } from "./traveler";
export { CROSSING_MODES, ACCESS_TYPES, DOCUMENT_CATEGORIES, TRUSTED_TRAVELER } from "./traveler";

// ─── Directionality ───
export type CorridorDirection = "MX_TO_US" | "US_TO_MX";

// ─── Lane Programs ───
export type LaneProgram =
  | "STANDARD"
  | "READY_LANE"
  | "SENTRI"
  | "PEDESTRIAN"
  | "COMMERCIAL";

// ─── Operational Port Status ───
export type PortOperatingStatus =
  | "OPEN"
  | "LIMITED"
  | "CONGESTED"
  | "DELAYED"
  | "CLOSED"
  | "UNKNOWN";

// ─── Individual Lane Queue ───
export interface LaneQueueData {
  program: LaneProgram;
  isOpen: boolean;
  lanesOpenCount?: number;
  totalLanesCount?: number;
  currentWaitMinutes: number;
  trend: "IMPROVING" | "STABLE" | "WORSENING";
  operationalNote?: string;
}

// ─── Complete Crossing Entity ───
export interface CrossingEntity {
  id: string;
  name: string;
  cityOrigin: string;
  cityDestination: string;
  direction: CorridorDirection;
  status: PortOperatingStatus;
  statusMessage?: string;
  is24Hours: boolean;
  operatingHoursText: string;
  lanes: Record<LaneProgram, LaneQueueData>;
  dominantWaitMinutes: number;
  typicalWaitMinutes: number;
  lastUpdated: string;
  coordinates: { lat: number; lng: number };
  restrictions: {
    commercialAllowed: boolean;
    pedestrianAllowed: boolean;
    specialNotices?: string[];
  };
  historicalHourlyProfile: Array<{
    hour: number;
    typicalWait: number;
    todayActualWait?: number;
  }>;
}

// ─── Legacy Recommendation (for mock data compatibility) ───
export interface LegacyCrossingRecommendation {
  tripId: string;
  originName: string;
  destinationName: string;
  direction: CorridorDirection;
  selectedCrossingId: string;
  fastestCrossingName: string;
  borderWaitMinutes: number;
  approachTransitMinutes: number;
  totalEstimatedMinutes: number;
  evidence: string[];
  alternatives: Array<{
    crossingId: string;
    crossingName: string;
    totalEstimatedMinutes: number;
    deltaMinutes: number;
  }>;
  generatedAt: string;
}

// ─── Chronological Alert Event ───
export interface BorderAlertEvent {
  id: string;
  crossingId: string;
  crossingName: string;
  direction: CorridorDirection;
  timestamp: string;
  type: "QUEUE_SURGE" | "LANE_STATUS_CHANGE" | "PORT_CLOSURE" | "WEATHER_INCIDENT";
  severity: "NORMAL" | "NOTABLE" | "IMPORTANT" | "CRITICAL";
  headline: string;
  description: string;
  previousValue?: string;
  currentValue?: string;
}

// ─── Onboarding ───
export type OnboardingStep =
  | "splash"
  | "destination"
  | "starting-point"
  | "recommendation";

export type GeolocationPermission = "pending" | "granted" | "denied";

// ─── Navigation ───
export type BottomNavDestination = "trip" | "crossings" | "agent";

export type HeaderVariant =
  | "root"
  | "context"
  | "detail"
  | "search"
  | "filter"
  | "selection"
  | "compare"
  | "focused"
  | "collapsed";

// ─── Alertas Event Model (P06) ───
export type AlertEventType =
  | "WAIT_SURGE"
  | "WAIT_DROP"
  | "LANE_STATUS_CHANGE"
  | "CONSTRUCTION"
  | "CONFIDENCE_DROP";

export type AlertSeverity = "info" | "notable" | "important" | "critical";

export interface AlertChangeEvent {
  type: AlertEventType;
  severity: AlertSeverity;
  badgeEligible: boolean;
  crossingId: string;
  crossingName: string;
  timestamp: string;
  headline: string;
  description: string;
  previousValue?: string;
  currentValue?: string;
}
