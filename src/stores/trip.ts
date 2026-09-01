import { create } from "zustand";
import { persist } from "zustand/middleware";
import type {
  StartPlace,
  DestinationPlace,
  TripType,
  TripDirection,
  CrossingRecommendation,
  GeolocationPermission,
} from "@/types";

interface TripState {
  geolocationPermission: GeolocationPermission;
  start: StartPlace | null;
  destination: DestinationPlace | null;
  tripType: TripType;
  direction: TripDirection | null;
  recommendedCrossing: CrossingRecommendation | null;
  completed: boolean;
  lastEvaluatedAt: string | null;

  setGeolocationPermission: (p: GeolocationPermission) => void;
  setStart: (place: StartPlace | null) => void;
  setDestination: (place: DestinationPlace | null) => void;
  setTripType: (type: TripType) => void;
  setDirection: (direction: TripDirection | null) => void;
  setRecommendedCrossing: (rec: CrossingRecommendation | null) => void;
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
  recommendedCrossing: null,
  completed: false,
  lastEvaluatedAt: null,
};

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      ...initialState,

      setGeolocationPermission: (geolocationPermission) =>
        set({ geolocationPermission }),
      setStart: (start) => set({ start }),
      setDestination: (destination) => set({ destination }),
      setTripType: (tripType) => set({ tripType }),
      setDirection: (direction) => set({ direction }),
      setRecommendedCrossing: (recommendedCrossing) =>
        set({ recommendedCrossing, lastEvaluatedAt: new Date().toISOString() }),
      complete: () => set({ completed: true }),
      refreshActivity: () => set({ lastEvaluatedAt: new Date().toISOString() }),
      reset: () => set(initialState),
    }),
    {
      name: "cruze-trip",
    }
  )
);
