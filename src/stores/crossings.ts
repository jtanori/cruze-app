import { create } from "zustand";
import type { CrossingEntity } from "@/types";

interface CrossingsState {
  crossings: CrossingEntity[];
  isLoading: boolean;
  error: string | null;
  lastFetched: string | null;

  setCrossings: (crossings: CrossingEntity[]) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useCrossingsStore = create<CrossingsState>()((set) => ({
  crossings: [],
  isLoading: true,
  error: null,
  lastFetched: null,

  setCrossings: (crossings) =>
    set({ crossings, lastFetched: new Date().toISOString(), error: null }),
  setLoading: (isLoading) => set({ isLoading }),
  setError: (error) => set({ error, isLoading: false }),
}));
