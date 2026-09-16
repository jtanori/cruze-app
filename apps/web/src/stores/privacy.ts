import { create } from "zustand";
import { persist } from "zustand/middleware";

/**
 * PRIV-01 — Privacy acknowledgement state.
 *
 * Records are append-only and version-bound: a new privacy document version
 * never overwrites prior records, and only a matching current version
 * counts as acknowledged (re-review required on bump — never silent).
 */
export interface PrivacyAcknowledgement {
  documentKey: "privacy";
  documentVersion: string;
  locale: string;
  acknowledgedAt: string;
  jurisdiction: "MX" | "US" | "UNKNOWN";
  withOptionals: boolean;
}

interface PrivacyState {
  acknowledgements: PrivacyAcknowledgement[];
  acknowledge: (ack: Omit<PrivacyAcknowledgement, "acknowledgedAt">) => void;
  /** True when a record matches the given document version. */
  isAcknowledged: (documentVersion: string) => boolean;
  reset: () => void;
}

export const usePrivacyStore = create<PrivacyState>()(
  persist(
    (set, get) => ({
      acknowledgements: [],
      acknowledge: (ack) =>
        set((state) => ({
          acknowledgements: [
            ...state.acknowledgements,
            { ...ack, acknowledgedAt: new Date().toISOString() },
          ],
        })),
      isAcknowledged: (documentVersion) =>
        get().acknowledgements.some(
          (a) => a.documentKey === "privacy" && a.documentVersion === documentVersion
        ),
      reset: () => set({ acknowledgements: [] }),
    }),
    {
      name: "cruze-privacy",
      partialize: (state) => ({ acknowledgements: state.acknowledgements }),
    }
  )
);
