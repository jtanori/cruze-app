import type { TripDestinationSelection } from "./trip-navigation";

export type TripSetupStep =
  | "destination"
  | "origin"
  | "travelMode"
  | "direction"
  | "accessType"
  | "documentProfile"
  | "recommendation";

export type TravelMode = "walking" | "privateVehicle" | "commercial";
export type TripDirection = "northbound" | "southbound" | "unknown";
export type AccessType = "standard" | "readyLane" | "sentri" | "unknown";
export type DocumentType = "passport" | "visa" | "usCitizen" | "trustedTraveler" | "unknown";

/**
 * Crossing candidate resolved from C03/C04 handoff URL.
 * This is a suggestion, not an instruction — the user can override it.
 */
export interface CrossingCandidate {
  id: string;
  name: string;
}

/**
 * Trip setup workflow state — LOCAL, not persisted to the trip store.
 *
 * Lifecycle:
 *   DRAFT / PLANNING = wizard open, local state (this type)
 *   READY            = wizard complete, written to TripState
 *   ACTIVE           = recommendation selected, trip persisted
 *   COMPLETED        = trip finished
 *
 * `crossingCandidate` comes from C03/C04 URL handoff.
 * `recommendedCrossing` comes from T07 recommendation engine.
 * These are deliberately distinct — the candidate is input context,
 * the recommendation is output.
 */
export interface TripSetupState {
  crossingCandidate: CrossingCandidate | null;
  destination: TripDestinationSelection | null;
  origin: TripDestinationSelection | null;
  travelMode: TravelMode | null;
  direction: TripDirection | null;
  accessType: AccessType | null;
  documentType: DocumentType | null;
}

export function getRequiredSteps(state: TripSetupState): TripSetupStep[] {
  const steps: TripSetupStep[] = ["destination", "origin", "travelMode"];

  if (!state.travelMode) return steps;

  if (state.travelMode === "walking") {
    steps.push("recommendation");
    return steps;
  }

  if (state.travelMode === "commercial") {
    steps.push("recommendation");
    return steps;
  }

  if (state.travelMode === "privateVehicle") {
    if (!state.direction || state.direction === "unknown") {
      steps.push("direction");
    }

    if (state.direction === "southbound") {
      steps.push("recommendation");
      return steps;
    }

    if (state.direction === "northbound") {
      steps.push("accessType", "documentProfile", "recommendation");
      return steps;
    }

    // Unknown direction - need to ask, then branch
    steps.push("recommendation");
    return steps;
  }

  steps.push("recommendation");
  return steps;
}

export function getNextStep(state: TripSetupState, current: TripSetupStep): TripSetupStep | null {
  const required = getRequiredSteps(state);
  const idx = required.indexOf(current);
  if (idx === -1 || idx === required.length - 1) return null;
  return required[idx + 1];
}

export function getPreviousStep(state: TripSetupState, current: TripSetupStep): TripSetupStep | null {
  const required = getRequiredSteps(state);
  const idx = required.indexOf(current);
  if (idx <= 0) return null;
  return required[idx - 1];
}

export function getStepProgress(state: TripSetupState, current: TripSetupStep): { current: number; total: number } {
  const required = getRequiredSteps(state);
  const idx = required.indexOf(current);
  return { current: idx + 1, total: required.length };
}

export function isFlowComplete(state: TripSetupState): boolean {
  return state.destination !== null && state.origin !== null && state.travelMode !== null;
}
