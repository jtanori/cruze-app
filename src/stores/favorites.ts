import { create } from "zustand";
import { persist } from "zustand/middleware";

interface FavoritesState {
  crossingIds: string[];

  addFavorite: (id: string) => void;
  removeFavorite: (id: string) => void;
  isFavorite: (id: string) => boolean;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      crossingIds: [],

      addFavorite: (id) =>
        set((state) => ({
          crossingIds: [...new Set([...state.crossingIds, id])],
        })),

      removeFavorite: (id) =>
        set((state) => ({
          crossingIds: state.crossingIds.filter((fid) => fid !== id),
        })),

      isFavorite: (id) => get().crossingIds.includes(id),
    }),
    {
      name: "cruze-favorites",
    }
  )
);
