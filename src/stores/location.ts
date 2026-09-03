import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { LocationState, LocationData } from "@/lib/location-state-machine";

interface LocationStore {
  state: LocationState;
  location: LocationData | null;
  error: string | null;
  setState: (state: LocationState) => void;
  setLocation: (location: LocationData | null) => void;
  setError: (error: string | null) => void;
  reset: () => void;
}

const initialState = {
  state: "uninitialized" as LocationState,
  location: null as LocationData | null,
  error: null as string | null,
};

export const useLocationStore = create<LocationStore>()(
  persist(
    (set) => ({
      ...initialState,
      setState: (state) => set({ state }),
      setLocation: (location) => set({ location }),
      setError: (error) => set({ error }),
      reset: () => set(initialState),
    }),
    {
      name: "cruze-location",
    }
  )
);
