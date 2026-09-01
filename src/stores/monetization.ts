import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BreakState, ContributionSettings, ProState, ConsentRecord } from "@/types/monetization";
import { MONETIZATION_POLICY } from "@/lib/monetization-policy";
import { trackEvent } from "@/lib/analytics";

interface MonetizationState {
  break: BreakState;
  contribution: ContributionSettings;
  pro: ProState;
  consentRecords: ConsentRecord[];
  adsThisSession: number;
  lastAdAt: string | null;

  // Break actions
  startBreak: (reason?: "user_request" | "geofence") => void;
  endBreak: () => void;
  checkBreakExpired: () => boolean;

  // Contribution actions
  toggleContribution: () => void;
  addContributionSignal: (signal: string) => void;

  // Pro actions
  activatePro: () => void;
  deactivatePro: () => void;

  // Consent actions
  recordConsent: (type: string, granted: boolean) => void;
  hasConsent: (type: string) => boolean;

  // Ad tracking
  incrementAdsShown: () => void;
  resetSessionAds: () => void;
}

export const useMonetizationStore = create<MonetizationState>()(
  persist(
    (set, get) => ({
      break: {
        active: false,
        startedAt: null,
        reason: null,
        expiresAt: null,
      },
      contribution: {
        enabled: false,
        signals: [],
        lastContributedAt: null,
      },
      pro: {
        active: false,
        activatedAt: null,
        expiresAt: null,
        features: [],
      },
      consentRecords: [],
      adsThisSession: 0,
      lastAdAt: null,

      startBreak: (reason = "user_request") => {
        const now = new Date();
        const expiresAt = new Date(
          now.getTime() + MONETIZATION_POLICY.break.maxDurationMinutes * 60 * 1000
        ).toISOString();

        set({
          break: {
            active: true,
            startedAt: now.toISOString(),
            reason,
            expiresAt,
          },
        });

        trackEvent("break_started", { reason });
      },

      endBreak: () => {
        set({
          break: {
            active: false,
            startedAt: null,
            reason: null,
            expiresAt: null,
          },
        });

        trackEvent("break_ended");
      },

      checkBreakExpired: () => {
        const { break: breakState } = get();
        if (!breakState.active || !breakState.expiresAt) return false;

        if (Date.now() >= new Date(breakState.expiresAt).getTime()) {
          get().endBreak();
          return true;
        }
        return false;
      },

      toggleContribution: () => {
        const { contribution } = get();
        const newEnabled = !contribution.enabled;

        set({
          contribution: {
            ...contribution,
            enabled: newEnabled,
            lastContributedAt: newEnabled ? new Date().toISOString() : contribution.lastContributedAt,
          },
        });

        trackEvent(newEnabled ? "contribution_started" : "consent_revoked", {
          type: "data_contribution",
        });
      },

      addContributionSignal: (signal: string) => {
        const { contribution } = get();
        set({
          contribution: {
            ...contribution,
            lastContributedAt: new Date().toISOString(),
          },
        });

        trackEvent("contribution_sample", { signal });
      },

      activatePro: () => {
        set({
          pro: {
            active: true,
            activatedAt: new Date().toISOString(),
            expiresAt: null,
            features: MONETIZATION_POLICY.pro.features,
          },
        });

        trackEvent("pro_upsell_clicked");
      },

      deactivatePro: () => {
        set({
          pro: {
            active: false,
            activatedAt: null,
            expiresAt: null,
            features: [],
          },
        });
      },

      recordConsent: (type, granted) => {
        const { consentRecords } = get();
        const record: ConsentRecord = {
          type: type as ConsentRecord["type"],
          granted,
          timestamp: new Date().toISOString(),
          version: "1.0",
        };

        set({
          consentRecords: [...consentRecords, record],
        });

        trackEvent(granted ? "consent_granted" : "consent_revoked", { type });
      },

      hasConsent: (type) => {
        const { consentRecords } = get();
        const latest = consentRecords
          .filter((r) => r.type === type)
          .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
        return latest?.granted ?? false;
      },

      incrementAdsShown: () => {
        set((state) => ({
          adsThisSession: state.adsThisSession + 1,
          lastAdAt: new Date().toISOString(),
        }));
      },

      resetSessionAds: () => {
        set({ adsThisSession: 0, lastAdAt: null });
      },
    }),
    {
      name: "cruze-monetization",
      partialize: (state) => ({
        break: state.break,
        contribution: state.contribution,
        pro: state.pro,
        consentRecords: state.consentRecords,
      }),
    }
  )
);
