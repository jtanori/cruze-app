export type TripLifecycleState =
  | "draft"
  | "planning"
  | "ready"
  | "active"
  | "at_border"
  | "completed";

export type TripLifecycleEvent =
  | "START_PLANNING"
  | "COMPLETE_SETUP"
  | "ACTIVATE"
  | "ARRIVE_AT_BORDER"
  | "COMPLETE"
  | "RESET";

const TRANSITIONS: Record<TripLifecycleState, Partial<Record<TripLifecycleEvent, TripLifecycleState>>> = {
  draft: { START_PLANNING: "planning", RESET: "draft" },
  planning: { COMPLETE_SETUP: "ready", RESET: "draft" },
  ready: { ACTIVATE: "active", RESET: "draft" },
  active: { ARRIVE_AT_BORDER: "at_border", COMPLETE: "completed", RESET: "draft" },
  at_border: { COMPLETE: "completed", RESET: "draft" },
  completed: { RESET: "draft" },
};

export class TripLifecycleMachine {
  private state: TripLifecycleState = "draft";

  getState(): TripLifecycleState {
    return this.state;
  }

  can(event: TripLifecycleEvent): boolean {
    return TRANSITIONS[this.state]?.[event] !== undefined;
  }

  dispatch(event: TripLifecycleEvent): boolean {
    const next = TRANSITIONS[this.state]?.[event];
    if (!next) return false;
    this.state = next;
    return true;
  }

  isCompleted(): boolean {
    return this.state === "completed";
  }

  isActive(): boolean {
    return this.state === "active" || this.state === "at_border";
  }
}

export function isEligibleForMyTrips(state: TripLifecycleState): boolean {
  return state === "completed";
}
