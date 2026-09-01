"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { AppShell } from "@/components/layout/AppShell";
import { useAlertsStore } from "@/stores/alerts";
import { getMergedCrossingsData, type MergedCrossingData } from "@/lib/border-data-service";
import { analyzeAllCrossings } from "@/lib/alert-engine";
import type { BorderAlertEvent } from "@/types";

export default function AlertsPage() {
  const t = useTranslations();
  const { alerts, setAlerts, markSeen } = useAlertsStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    markSeen();
  }, [markSeen]);

  useEffect(() => {
    async function loadAlerts() {
      setLoading(true);
      try {
        const crossings = await getMergedCrossingsData();
        // For now, generate alerts from current data without previous snapshot
        // In production, we'd store the previous snapshot for comparison
        const newAlerts = analyzeAllCrossings(crossings, []);
        if (newAlerts.length > 0) {
          setAlerts([...newAlerts, ...alerts].slice(0, 50)); // Keep last 50 alerts
        }
      } catch {
        // Silently fail
      } finally {
        setLoading(false);
      }
    }
    loadAlerts();
  }, [setAlerts]);

  const grouped = {
    [t("alerts.today")]: alerts.filter(
      (a) => new Date(a.timestamp) > new Date(Date.now() - 86400000)
    ),
    [t("alerts.yesterday")]: alerts.filter(
      (a) =>
        new Date(a.timestamp) <= new Date(Date.now() - 86400000) &&
        new Date(a.timestamp) > new Date(Date.now() - 172800000)
    ),
    [t("alerts.earlier")]: alerts.filter(
      (a) => new Date(a.timestamp) <= new Date(Date.now() - 172800000)
    ),
  };

  const hasAlerts = alerts.length > 0;

  if (!hasAlerts) {
    return (
      <AppShell headerVariant="root">
        <div className="flex flex-col items-center justify-center gap-4 px-8 py-32">
          <div className="w-16 h-16 rounded-full bg-surface-elevated border border-border flex items-center justify-center">
            <svg
              className="w-7 h-7 text-faint"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
              <path d="M13.73 21a2 2 0 0 1-3.46 0" />
            </svg>
          </div>
          <div className="text-center space-y-2">
            <p className="text-ink text-sm font-medium">
              {t("alerts.empty")}
            </p>
            <p className="text-muted text-xs leading-relaxed">
              {t("alerts.emptyDescription")}
            </p>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell headerVariant="root">
      <div className="space-y-6 px-5 py-6">
        <div>
          <p className="text-ink text-[17px] font-semibold">{t("alerts.title")}</p>
          <p className="text-faint text-xs mt-1 tabular">
            {alerts.length}{" "}
            {alerts.length !== 1 ? t("alerts.alerts") : t("alerts.alert")}
          </p>
        </div>

        {Object.entries(grouped).map(([period, periodAlerts]) =>
          periodAlerts.length > 0 ? (
            <div key={period} className="space-y-3">
              <h3 className="text-muted text-xs font-medium uppercase tracking-wider">
                {period}
              </h3>
              <div className="space-y-0">
                {periodAlerts.map((alert, i) => (
                  <div key={alert.id}>
                    <div className="py-3 space-y-1.5">
                      <div className="flex items-center gap-2">
                        <span className="text-faint text-xs tabular">
                          {new Date(alert.timestamp).toLocaleTimeString("en-US", {
                            hour: "numeric",
                            minute: "2-digit",
                          })}
                        </span>
                        <span className="text-ink text-sm font-medium">
                          {alert.crossingName}
                        </span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                            alert.severity === "CRITICAL"
                              ? "bg-critical-soft text-critical"
                              : alert.severity === "IMPORTANT"
                              ? "bg-caution-soft text-caution"
                              : alert.severity === "NOTABLE"
                              ? "bg-info-soft text-info"
                              : "bg-surface-elevated text-faint"
                          }`}
                        >
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-ink text-sm">{alert.headline}</p>
                      <p className="text-muted text-xs">{alert.description}</p>
                    </div>
                    {i < periodAlerts.length - 1 && (
                      <div className="h-px bg-border-subtle" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : null
        )}
      </div>
    </AppShell>
  );
}
