import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  CrossingDetectionState,
  CrossingPhase,
} from "@/types/crossing-detection";
import { INITIAL_CROSSING_DETECTION_STATE } from "@/types/crossing-detection";

interface CrossingDetectionStore extends CrossingDetectionState {
  startMonitoring: (crossingId: string, crossingName: string, waitTime: number, hasJourney: boolean) => void;
  setPhase: (phase: CrossingPhase) => void;
  updatePosition: (lat: number, lng: number) => void;
  setBorderCrossed: (crossed: boolean) => void;
  setDestinationArrived: (arrived: boolean) => void;
  reEstimate: (newWaitTime: number) => void;
  confirmCrossing: () => void;
  dismissConfirmation: () => void;
  setContributionPrompted: () => void;
  setContributionSubmitted: () => void;
  reset: () => void;
}

export const useCrossingDetectionStore = create<CrossingDetectionStore>()(
  persist(
    (set, get) => ({
      ...INITIAL_CROSSING_DETECTION_STATE,

      startMonitoring: (crossingId, crossingName, waitTime, hasJourney) => {
        const now = new Date().toISOString();
        const estimatedTime = waitTime + 10; // wait time + 10min buffer
        const arrivalAt = new Date(Date.now() + estimatedTime * 60 * 1000).toISOString();

        set({
          phase: "waiting",
          crossingId,
          crossingName,
          estimatedCrossingTime: estimatedTime,
          estimatedArrivalAt: arrivalAt,
          monitoringStartedAt: now,
          lastPositionCheck: now,
          lastWaitTime: waitTime,
          hasJourneyContext: hasJourney,
          destinationArrived: false,
          borderCrossed: false,
          reEstimateCount: 0,
          lastReEstimateAt: null,
          userPosition: null,
          positionHistory: [],
          confirmedAt: null,
          actualCrossingTime: null,
          contributionPrompted: false,
          contributionSubmitted: false,
        });
      },

      setPhase: (phase) => set({ phase }),

      updatePosition: (lat, lng) => {
        const now = new Date().toISOString();
        const state = get();
        const newPosition = { lat, lng, timestamp: now };

        set({
          userPosition: { lat, lng },
          lastPositionCheck: now,
          positionHistory: [...state.positionHistory.slice(-19), newPosition], // Keep last 20 positions
        });
      },

      setBorderCrossed: (crossed) => set({ borderCrossed: crossed }),

      setDestinationArrived: (arrived) => set({ destinationArrived: arrived }),

      reEstimate: (newWaitTime) => {
        const state = get();
        const waitDelta = newWaitTime - state.lastWaitTime;
        const newEstimate = Math.max(state.estimatedCrossingTime + waitDelta, 0);
        const arrivalAt = new Date(Date.now() + newEstimate * 60 * 1000).toISOString();

        set({
          estimatedCrossingTime: newEstimate,
          estimatedArrivalAt: arrivalAt,
          lastWaitTime: newWaitTime,
          reEstimateCount: state.reEstimateCount + 1,
          lastReEstimateAt: new Date().toISOString(),
        });
      },

      confirmCrossing: () => {
        const state = get();
        const startTime = state.monitoringStartedAt ? new Date(state.monitoringStartedAt).getTime() : Date.now();
        const actualTime = Math.round((Date.now() - startTime) / (1000 * 60));

        set({
          phase: "completed",
          confirmedAt: new Date().toISOString(),
          actualCrossingTime: actualTime,
        });
      },

      dismissConfirmation: () => set({ phase: "waiting" }),

      setContributionPrompted: () => set({ contributionPrompted: true }),

      setContributionSubmitted: () => set({ contributionSubmitted: true }),

      reset: () => set(INITIAL_CROSSING_DETECTION_STATE),
    }),
    {
      name: "cruze-crossing-detection",
      // S1: movement trail and last position stay in memory only —
      // monitoring is session-scoped and restarts cleanly.
      partialize: (state) => {
        const { userPosition: _pos, positionHistory: _hist, ...rest } = state;
        return rest;
      },
    }
  )
);
