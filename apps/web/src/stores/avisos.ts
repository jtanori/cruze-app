/**
 * AV-01 — Avisos store (persisted).
 *
 * Single source of truth for notification state.
 * Consumes CrossingChange events from LIVE-01 via useAvisos hook.
 * Replaces the legacy alerts store.
 */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Aviso } from "../lib/avisos";
import { isDuplicate } from "../lib/aviso-dedup";

interface AvisosState {
  avisos: Aviso[];
  lastSeenAt: string | null;

  /** Add a new aviso (with dedup check). Returns true if added. */
  addAviso: (aviso: Aviso) => boolean;

  /** Add multiple avisos (with dedup check). Returns number added. */
  addAvisos: (avisos: Aviso[]) => number;

  /** Mark a single aviso as read. */
  markRead: (id: string) => void;

  /** Mark all avisos as read. */
  markAllRead: () => void;

  /** Dismiss a single aviso. */
  dismiss: (id: string) => void;

  /** Remove dismissed avisos older than maxAgeMs. */
  clearOld: (maxAgeMs?: number) => void;

  /** Reset all state. */
  reset: () => void;

  /** Computed: number of unread, non-dismissed avisos. */
  unreadCount: () => number;

  /** Computed: non-dismissed avisos sorted by timestamp descending. */
  activeAvisos: () => Aviso[];
}

const MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000; // 7 days

const initialState = {
  avisos: [] as Aviso[],
  lastSeenAt: null as string | null,
};

export const useAvisosStore = create<AvisosState>()(
  persist(
    (set, get) => ({
      ...initialState,

      addAviso: (aviso) => {
        const { avisos } = get();
        if (isDuplicate(aviso, avisos)) return false;
        set({ avisos: [aviso, ...avisos] });
        return true;
      },

      addAvisos: (newAvisos) => {
        const { avisos } = get();
        let added = 0;
        let accumulated = [...avisos];

        for (const aviso of newAvisos) {
          if (!isDuplicate(aviso, accumulated)) {
            accumulated = [aviso, ...accumulated];
            added++;
          }
        }

        if (added > 0) {
          set({ avisos: accumulated });
        }
        return added;
      },

      markRead: (id) => {
        set((state) => ({
          avisos: state.avisos.map((a) =>
            a.id === id ? { ...a, read: true } : a
          ),
          lastSeenAt: new Date().toISOString(),
        }));
      },

      markAllRead: () => {
        set((state) => ({
          avisos: state.avisos.map((a) => ({ ...a, read: true })),
          lastSeenAt: new Date().toISOString(),
        }));
      },

      dismiss: (id) => {
        set((state) => ({
          avisos: state.avisos.map((a) =>
            a.id === id ? { ...a, dismissed: true } : a
          ),
        }));
      },

      clearOld: (maxAgeMs = MAX_AGE_MS) => {
        const now = Date.now();
        set((state) => ({
          avisos: state.avisos.filter((a) => {
            if (!a.dismissed) return true;
            const age = now - new Date(a.timestamp).getTime();
            return age < maxAgeMs;
          }),
        }));
      },

      reset: () => set(initialState),

      unreadCount: () => {
        const { avisos } = get();
        return avisos.filter((a) => !a.read && !a.dismissed).length;
      },

      activeAvisos: () => {
        const { avisos } = get();
        return avisos
          .filter((a) => !a.dismissed)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      },
    }),
    {
      name: "cruze-avisos",
    }
  )
);
