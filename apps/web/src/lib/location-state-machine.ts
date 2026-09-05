export type LocationState =
  | "uninitialized"
  | "requesting_permission"
  | "permission_denied"
  | "manual_search"
  | "services_disabled"
  | "acquiring"
  | "low_confidence"
  | "ready"
  | "stale"
  | "unavailable";

export type LocationConfidence =
  | "unavailable"
  | "determining"
  | "needs_confirmation"
  | "ready"
  | "needs_refreshing";

export interface LocationData {
  lat: number;
  lng: number;
  accuracy: number;
  timestamp: number;
  confidence: LocationConfidence;
  placeName?: string;
  isManual?: boolean;
}

export interface LocationStateMachineConfig {
  highAccuracyTimeout: number;
  staleThreshold: number;
  lowConfidenceThreshold: number;
  maxRetries: number;
}

const DEFAULT_CONFIG: LocationStateMachineConfig = {
  highAccuracyTimeout: 10000,
  staleThreshold: 300000,
  lowConfidenceThreshold: 100,
  maxRetries: 3,
};

type StateTransition =
  | { type: "INITIALIZE" }
  | { type: "REQUEST_PERMISSION" }
  | { type: "PERMISSION_GRANTED" }
  | { type: "PERMISSION_DENIED" }
  | { type: "ENTER_MANUAL_SEARCH" }
  | { type: "MANUAL_LOCATION_SELECTED"; data: LocationData }
  | { type: "SERVICES_DISABLED" }
  | { type: "ACQUIRE_START" }
  | { type: "ACQUIRE_SUCCESS"; data: LocationData }
  | { type: "ACQUIRE_FAILURE"; error: string }
  | { type: "LOW_CONFIDENCE" }
  | { type: "READY"; data: LocationData }
  | { type: "STALE" }
  | { type: "UNAVAILABLE" }
  | { type: "RETRY" }
  | { type: "RESET" };

const VALID_TRANSITIONS: Record<LocationState, LocationState[]> = {
  uninitialized: ["requesting_permission", "unavailable"],
  requesting_permission: ["permission_denied", "acquiring", "services_disabled"],
  permission_denied: ["manual_search", "requesting_permission", "unavailable"],
  manual_search: ["ready", "unavailable"],
  services_disabled: ["manual_search", "requesting_permission", "unavailable"],
  acquiring: ["low_confidence", "ready", "unavailable", "acquiring"],
  low_confidence: ["acquiring", "ready", "unavailable"],
  ready: ["stale", "unavailable"],
  stale: ["acquiring", "ready", "unavailable"],
  unavailable: ["manual_search", "requesting_permission", "acquiring"],
};

export class LocationStateMachine {
  private state: LocationState = "uninitialized";
  private data: LocationData | null = null;
  private config: LocationStateMachineConfig;
  private retries = 0;
  private listeners: Map<LocationState, Set<(data: LocationData | null) => void>> = new Map();

  constructor(config: Partial<LocationStateMachineConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config };
  }

  getState(): LocationState {
    return this.state;
  }

  getData(): LocationData | null {
    return this.data;
  }

  canTransition(type: StateTransition["type"]): boolean {
    const nextState = this.getNextState(type);
    if (!nextState) return false;
    return VALID_TRANSITIONS[this.state]?.includes(nextState) ?? false;
  }

  private getNextState(type: StateTransition["type"]): LocationState | null {
    switch (type) {
      case "INITIALIZE":
        return "requesting_permission";
      case "REQUEST_PERMISSION":
        return "requesting_permission";
      case "PERMISSION_GRANTED":
        return "acquiring";
      case "PERMISSION_DENIED":
        return "permission_denied";
      case "ENTER_MANUAL_SEARCH":
        return "manual_search";
      case "MANUAL_LOCATION_SELECTED":
        return "ready";
      case "SERVICES_DISABLED":
        return "services_disabled";
      case "ACQUIRE_START":
        return "acquiring";
      case "ACQUIRE_SUCCESS":
        return "ready";
      case "ACQUIRE_FAILURE":
        return this.retries < this.config.maxRetries ? "acquiring" : "unavailable";
      case "LOW_CONFIDENCE":
        return "low_confidence";
      case "READY":
        return "ready";
      case "STALE":
        return "stale";
      case "UNAVAILABLE":
        return "unavailable";
      case "RETRY":
        // From permission_denied, retry goes back to requesting permission
        if (this.state === "permission_denied") return "requesting_permission";
        return "acquiring";
      case "RESET":
        return "uninitialized";
      default:
        return null;
    }
  }

  dispatch(transition: StateTransition): boolean {
    const nextState = this.getNextState(transition.type);
    if (!nextState) return false;

    if (!VALID_TRANSITIONS[this.state]?.includes(nextState)) {
      console.warn(`Invalid transition: ${this.state} -> ${nextState} (${transition.type})`);
      return false;
    }

    const prevState = this.state;
    this.state = nextState;

    if ("data" in transition) {
      const t = transition as { data: LocationData; type: string };
      if (t.type !== "RESET") {
        this.data = t.data;
      }
    }

    if (transition.type === "RETRY") {
      this.retries++;
    } else if (transition.type === "RESET") {
      this.retries = 0;
      this.data = null;
    }

    this.notifyListeners(nextState, this.data);
    return true;
  }

  subscribe(state: LocationState, callback: (data: LocationData | null) => void): () => void {
    if (!this.listeners.has(state)) {
      this.listeners.set(state, new Set());
    }
    this.listeners.get(state)!.add(callback);
    return () => {
      this.listeners.get(state)?.delete(callback);
    };
  }

  private notifyListeners(state: LocationState, data: LocationData | null) {
    this.listeners.get(state)?.forEach((cb) => cb(data));
  }

  evaluateConfidence(data: LocationData): LocationConfidence {
    if (!data) return "unavailable";

    const { accuracy, timestamp } = data;
    const age = Date.now() - timestamp;

    if (accuracy > this.config.lowConfidenceThreshold) {
      return "needs_confirmation";
    }

    if (age > this.config.staleThreshold) {
      return "needs_refreshing";
    }

    if (accuracy <= this.config.lowConfidenceThreshold && age < this.config.staleThreshold) {
      return "ready";
    }

    return "determining";
  }

  isStale(): boolean {
    if (!this.data) return true;
    return Date.now() - this.data.timestamp > this.config.staleThreshold;
  }
}

export function createLocationData(
  lat: number,
  lng: number,
  accuracy: number,
): LocationData {
  return {
    lat,
    lng,
    accuracy,
    timestamp: Date.now(),
    confidence: "determining",
  };
}
