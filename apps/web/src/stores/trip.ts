import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  StartPlace,
  DestinationPlace,
  TripType,
  TripDirection,
  GeolocationPermission,
} from "@/types";
import type {
  SelectedCrossing,
  TripRecommendation,
  selectCrossingFromRecommendation,
} from "@/lib/recommendation/types";
import { sanitizePlace, sanitizeLatLng, capCompletedTrips } from "@/lib/geo-privacy";

interface CompletedTrip {
  id: string;
  originLabel: string;
  destinationLabel: string;
  crossingName: string;
  crossingId: string;
  completedAt: string;
}

interface TripState {
  geolocationPermission: GeolocationPermission;
  start: StartPlace | null;
  destination: DestinationPlace | null;
  tripType: TripType;
  direction: TripDirection | null;
  travelMode: "walking" | "privateVehicle" | "commercial" | null;
  accessType: "standard" | "readyLane" | "sentri" | "unknown" | null;
  documentProfile: "passport" | "visa" | "usCitizen" | "trustedTraveler" | "unknown" | null;

  /**
   * The user's committed crossing selection. Persisted.
   * Set when the user clicks "Usar este cruce" in T07.
   */
  recommendedCrossing: SelectedCrossing | null;

  /**
   * Full recommendation from the engine. NOT persisted (ephemeral).
   * Used by active trip UI to show alternatives and reasoning.
   * Re-fetched on page load; this is a display cache.
   */
  lastRecommendation: TripRecommendation | null;

  completed: boolean;
  lastEvaluatedAt: string | null;
  completedTrips: CompletedTrip[];

  setGeolocationPermission: (p: GeolocationPermission) => void;
  setStart: (place: StartPlace | null) => void;
  setDestination: (place: DestinationPlace | null) => void;
  setTripType: (type: TripType) => void;
  setDirection: (direction: TripDirection | null) => void;
  setTravelMode: (mode: "walking" | "privateVehicle" | "commercial" | null) => void;
  setAccessType: (type: "standard" | "readyLane" | "sentri" | "unknown" | null) => void;
  setDocumentProfile: (profile: "passport" | "visa" | "usCitizen" | "trustedTraveler" | "unknown" | null) => void;

  /**
   * Commit a crossing selection. Extracts SelectedCrossing from TripRecommendation
   * and stores both the selection (persisted) and full recommendation (ephemeral).
   */
  setRecommendedCrossing: (rec: TripRecommendation) => void;

  /** Directly set a SelectedCrossing (e.g. from alternatives without full TripRecommendation). */
  setSelectedCrossing: (crossing: SelectedCrossing) => void;

  complete: () => void;
  refreshActivity: () => void;
  reset: () => void;
}

const initialState = {
  geolocationPermission: "pending" as GeolocationPermission,
  start: null,
  destination: null,
  tripType: "unknown" as TripType,
  direction: null,
  travelMode: null,
  accessType: null,
  documentProfile: null,
  recommendedCrossing: null,
  lastRecommendation: null,
  completed: false,
  lastEvaluatedAt: null,
  completedTrips: [] as CompletedTrip[],
};

/**
 * Trip store — persisted trip lifecycle.
 *
 * Lifecycle states (derived from field presence):
 *   DRAFT / PLANNING  = Trip Setup wizard (local state, NOT in this store)
 *   READY             = start + destination set, awaiting recommendation
 *   ACTIVE            = recommendedCrossing set, trip in progress
 *   COMPLETED         = completed = true
 *
 * The store only owns READY → ACTIVE → COMPLETED.
 * DRAFT/PLANNING live in TripSetupState (local component state).
 *
 * `recommendedCrossing` (SelectedCrossing) is the user's committed choice.
 * `lastRecommendation` (TripRecommendation) is ephemeral engine output.
 * `crossingCandidate` (from C03/C04 handoff) lives in TripSetupState, not here.
 */
export const useTripStore = create<TripState>()(
  persist(
    (set, get) => ({
      ...initialState,

      setGeolocationPermission: (geolocationPermission) =>
        set({ geolocationPermission }),
      setStart: (start) => set({ start }),
      setDestination: (destination) => set({ destination }),
      setTripType: (tripType) => set({ tripType }),
      setDirection: (direction) => set({ direction }),
      setTravelMode: (travelMode) => set({ travelMode }),
      setAccessType: (accessType) => set({ accessType }),
      setDocumentProfile: (documentProfile) => set({ documentProfile }),

      setRecommendedCrossing: (rec: TripRecommendation) => {
        const selected: SelectedCrossing = {
          crossingId: rec.primary.crossing.id,
          crossingName: rec.primary.crossing.name,
          mexicanCity: rec.primary.crossing.mexicanCity,
          usCity: rec.primary.crossing.usCity,
          waitTime: rec.primary.waitTime,
          totalJourneyTime: rec.primary.totalJourneyTime,
          status: rec.primary.status,
          isLive: rec.primary.isLive,
          generatedAt: rec.generatedAt,
          coordinates: rec.primary.crossing.coordinates,
        };
        set({
          recommendedCrossing: selected,
          lastRecommendation: rec,
          lastEvaluatedAt: new Date().toISOString(),
        });
      },

      setSelectedCrossing: (crossing: SelectedCrossing) => {
        set({
          recommendedCrossing: crossing,
          lastEvaluatedAt: new Date().toISOString(),
        });
      },

      complete: () => {
        const state = get();
        const recommended = state.recommendedCrossing;
        const start = state.start;
        const destination = state.destination;
        const newCompletedTrip: CompletedTrip = {
          id: crypto.randomUUID(),
          originLabel: start?.name || "Origen",
          destinationLabel: destination?.name || "Destino",
          crossingName: recommended?.crossingName || "Cruce",
          crossingId: recommended?.crossingId || "",
          completedAt: new Date().toISOString(),
        };
        set({
          completed: true,
          completedTrips: capCompletedTrips([newCompletedTrip, ...state.completedTrips]),
        });
      },
      refreshActivity: () => set({ lastEvaluatedAt: new Date().toISOString() }),
      reset: () => set(initialState),
    }),
    {
      name: "cruze-trip",
      // lastRecommendation is ephemeral — don't persist it.
      // S1: persisted places rounded to ~100m; history capped.
      partialize: (state) => {
        const { lastRecommendation, ...rest } = state;
        const recommendedCrossing = rest.recommendedCrossing
          ? {
              ...rest.recommendedCrossing,
              coordinates: sanitizeLatLng(rest.recommendedCrossing.coordinates) ?? rest.recommendedCrossing.coordinates,
            }
          : rest.recommendedCrossing;
        return {
          ...rest,
          start: sanitizePlace(rest.start),
          destination: sanitizePlace(rest.destination),
          recommendedCrossing,
          completedTrips: capCompletedTrips(rest.completedTrips),
        };
      },
    }
  )
);
