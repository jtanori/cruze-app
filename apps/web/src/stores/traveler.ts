import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TravelerProfile } from "@/types";

interface TravelerState {
  profile: TravelerProfile | null;
  setProfile: (profile: TravelerProfile) => void;
  reset: () => void;
}

export const useTravelerStore = create<TravelerState>()(
  persist(
    (set) => ({
      profile: null,
      setProfile: (profile) => set({ profile }),
      reset: () => set({ profile: null }),
    }),
    {
      name: "cruze-traveler",
    }
  )
);
