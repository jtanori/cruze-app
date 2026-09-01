import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { BorderAlertEvent } from "@/types";

interface AlertsState {
  alerts: BorderAlertEvent[];
  alertsLastSeenAt: string | null;
  isLoading: boolean;

  setAlerts: (alerts: BorderAlertEvent[]) => void;
  markSeen: () => void;
  setLoading: (loading: boolean) => void;
  unreadCount: () => number;
}

export const useAlertsStore = create<AlertsState>()(
  persist(
    (set, get) => ({
      alerts: [],
      alertsLastSeenAt: null,
      isLoading: true,

      setAlerts: (alerts) => set({ alerts, isLoading: false }),

      markSeen: () =>
        set({ alertsLastSeenAt: new Date().toISOString() }),

      setLoading: (isLoading) => set({ isLoading }),

      unreadCount: () => {
        const { alerts, alertsLastSeenAt } = get();
        if (!alertsLastSeenAt) return alerts.length;
        return alerts.filter(
          (a) =>
            new Date(a.timestamp) > new Date(alertsLastSeenAt) &&
            (a.type === "QUEUE_SURGE" ||
              a.type === "PORT_CLOSURE" ||
              a.type === "LANE_STATUS_CHANGE")
        ).length;
      },
    }),
    {
      name: "cruze-alerts",
    }
  )
);
