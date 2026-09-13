"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useAgentStore } from "@/stores/agent";
import type { Aviso } from "@/lib/avisos";

/**
 * Shared handoff actions for a selected aviso.
 * Used by both the alerts page (AvisosView) and the AvisosSheet.
 *
 * - Ask Agent: one-shot crossing context → /agent (consumed on entry).
 * - View recommendation: crossing detail when known, else active trip.
 */
export function useAvisoActions() {
  const router = useRouter();
  const locale = useLocale();

  const askAgent = useCallback(
    (aviso: Aviso) => {
      if (aviso.crossingId && aviso.crossingName) {
        useAgentStore.getState().setPendingContext({
          crossingId: aviso.crossingId,
          crossingName: aviso.crossingName,
        });
      }
      router.push(`/${locale}/agent`);
    },
    [router, locale]
  );

  const viewRecommendation = useCallback(
    (aviso: Aviso) => {
      if (aviso.crossingId) {
        router.push(`/${locale}/crossing/${aviso.crossingId}`);
      } else {
        router.push(`/${locale}/trip`);
      }
    },
    [router, locale]
  );

  return { askAgent, viewRecommendation };
}
