"use client";

import { BellRing, BellOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useAvisosStore } from "@/stores/avisos";
import { AvisosList } from "@/components/avisos/AvisosList";
import { useCriticalAvisoNotifications } from "@/hooks/useCriticalAvisoNotifications";

export default function AlertsPage() {
  const t = useTranslations();
  const activeAvisos = useAvisosStore((s) => s.activeAvisos());
  const markAllRead = useAvisosStore((s) => s.markAllRead);
  const { permission, requestPermission } = useCriticalAvisoNotifications(activeAvisos);

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-5 py-4 sm:py-6">
      <div>
        <p className="text-ink text-lg sm:text-xl font-semibold">{t("alerts.title")}</p>
        <p className="text-faint text-xs mt-1 tabular">
          {activeAvisos.length}{" "}
          {activeAvisos.length !== 1 ? t("alerts.alerts") : t("alerts.alert")}
        </p>
      </div>

      {permission === "default" && (
        <button
          onClick={() => requestPermission()}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm font-medium active:bg-surface-subtle transition-colors"
        >
          <BellRing className="w-4 h-4 text-cruze-green" />
          {t("alerts.enableAlerts")}
        </button>
      )}
      {permission === "granted" && (
        <p className="flex items-center justify-center gap-2 text-faint text-xs">
          <BellRing className="w-3.5 h-3.5 text-cruze-green" />
          {t("alerts.notificationsEnabled")}
        </p>
      )}
      {permission === "denied" && (
        <p className="flex items-center justify-center gap-2 text-faint text-xs">
          <BellOff className="w-3.5 h-3.5" />
          {t("alerts.notificationsBlocked")}
        </p>
      )}

      <AvisosList
        avisos={activeAvisos}
        onSelect={(aviso) => markAllRead()}
      />
    </div>
  );
}
