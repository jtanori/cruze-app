"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { BellRing, BellOff } from "lucide-react";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useShallow } from "zustand/react/shallow";
import { useAvisosStore } from "@/stores/avisos";
import { AvisosView } from "@/components/avisos/AvisosView";
import { useAvisoActions } from "@/hooks/useAvisoActions";
import { useCriticalAvisoNotifications } from "@/hooks/useCriticalAvisoNotifications";

function AlertsInner() {
  const t = useTranslations();
  const searchParams = useSearchParams();
  // NOTE: activeAvisos() returns a fresh array — never select it directly
  // (getSnapshot must stay referentially stable or React loops forever).
  const avisos = useAvisosStore(useShallow((s) => s.avisos));
  // Mirrors store.activeAvisos() (undismissed, newest first) with a stable ref.
  const activeAvisos = useMemo(
    () =>
      avisos
        .filter((a) => !a.dismissed)
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()),
    [avisos]
  );
  const markRead = useAvisosStore((s) => s.markRead);
  const { askAgent, viewRecommendation } = useAvisoActions();
  const { permission, requestPermission } = useCriticalAvisoNotifications(activeAvisos);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Deep link (?aviso=id): select on entry when still active, then clear.
  useEffect(() => {
    const target = searchParams.get("aviso");
    if (target && activeAvisos.some((a) => a.id === target)) {
      setSelectedId(target);
      markRead(target);
    }
    // Run once on entry.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

      <AvisosView
        avisos={activeAvisos}
        selectedId={selectedId}
        onSelect={(aviso) => {
          setSelectedId(aviso.id);
          markRead(aviso.id);
        }}
        onBack={() => setSelectedId(null)}
        onAskAgent={askAgent}
        onViewRecommendation={viewRecommendation}
      />
    </div>
  );
}

export default function AlertsPage() {
  return (
    <Suspense>
      <AlertsInner />
    </Suspense>
  );
}
