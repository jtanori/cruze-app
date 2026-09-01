/**
 * Crossing Detection Types
 * Manages the state of border crossing detection and confirmation.
 */

export type CrossingPhase =
  | "idle"          // No active crossing
  | "waiting"       // User is waiting to cross
  | "approaching"   // User is moving toward the crossing
  | "at_booth"      // User is at the crossing booth
  | "crossing"      // User is in the process of crossing
  | "confirming"    // User is confirming crossing
  | "completed"     // User has confirmed crossing
  | "timeout";      // Estimation window expired

export interface CrossingDetectionState {
  phase: CrossingPhase;
  crossingId: string | null;
  crossingName: string | null;

  // Timing
  estimatedCrossingTime: number;    // minutes, recalculated dynamically
  estimatedArrivalAt: string | null; // ISO timestamp
  monitoringStartedAt: string | null;
  lastPositionCheck: string | null;
  lastWaitTime: number;             // at time of last estimation

  // Journey context
  hasJourneyContext: boolean;       // origin → destination configured
  destinationArrived: boolean;      // GPS shows user at destination
  borderCrossed: boolean;           // GPS shows user on other side

  // Re-estimation
  reEstimateCount: number;
  maxReEstimates: number;
  lastReEstimateAt: string | null;

  // Position
  userPosition: { lat: number; lng: number } | null;
  positionHistory: Array<{ lat: number; lng: number; timestamp: string }>;

  // Confirmation
  confirmedAt: string | null;
  actualCrossingTime: number | null; // minutes, calculated on confirmation

  // Contribution
  contributionPrompted: boolean;
  contributionSubmitted: boolean;
}

export interface CrossingDetectionActions {
  // Start monitoring
  startMonitoring: (crossingId: string, crossingName: string, waitTime: number, hasJourney: boolean) => void;

  // Update phase
  setPhase: (phase: CrossingPhase) => void;

  // Position updates
  updatePosition: (lat: number, lng: number) => void;
  setBorderCrossed: (crossed: boolean) => void;
  setDestinationArrived: (arrived: boolean) => void;

  // Re-estimation
  reEstimate: (newWaitTime: number) => void;

  // Confirmation
  confirmCrossing: () => void;
  dismissConfirmation: () => void;

  // Contribution
  setContributionPrompted: () => void;
  setContributionSubmitted: () => void;

  // Reset
  reset: () => void;
}

export const INITIAL_CROSSING_DETECTION_STATE: CrossingDetectionState = {
  phase: "idle",
  crossingId: null,
  crossingName: null,
  estimatedCrossingTime: 0,
  estimatedArrivalAt: null,
  monitoringStartedAt: null,
  lastPositionCheck: null,
  lastWaitTime: 0,
  hasJourneyContext: false,
  destinationArrived: false,
  borderCrossed: false,
  reEstimateCount: 0,
  maxReEstimates: 5,
  lastReEstimateAt: null,
  userPosition: null,
  positionHistory: [],
  confirmedAt: null,
  actualCrossingTime: null,
  contributionPrompted: false,
  contributionSubmitted: false,
};
