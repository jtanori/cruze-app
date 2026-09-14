import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocationState, LocationData } from "@/lib/location-state-machine";
import { sanitizeLatLng } from "@/lib/geo-privacy";

interface LocationStore {
  state: LocationState;
  location: LocationData | null;
  isManual: boolean;
  error: string | null;
  setState: (state: LocationState) => void;
  setLocation: (location: LocationData | null, isManual?: boolean) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  state: "uninitialized" as LocationState,
  location: null as LocationData | null,
  isManual: false,
  error: null as string | null,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,
      setState: (state) => set({ state }),
      setLocation: (location, isManual = false) => set({ location, isManual }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: "cruze-location",
      // S1: persisted fix rounded to ~100m; precise fixes re-acquire live.
      partialize: (state) => ({
        state: state.state,
        location: sanitizeLatLng(state.location),
        isManual: state.isManual,
        error: state.error,
      }),
    }
  )
);
