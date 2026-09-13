"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useAvisosStore } from "@/stores/avisos";
import { useAvisoActions } from "@/hooks/useAvisoActions";
import { BottomSheet } from "@/components/primitives/BottomSheet";
import { AvisosView } from "./AvisosView";

interface AvisosSheetProps {
  open: boolean;
  onClose: () => void;
  /** Deep-link target: selects this aviso on open when still active. */
  initialAvisoId?: string | null;
}

/**
 * AV-HEAD-01 — Global sheet container for Avisos.
 * Owns selection + mark-read-on-open; delegates handoffs to useAvisoActions.
 */
export function AvisosSheet({ open, onClose, initialAvisoId = null }: AvisosSheetProps) {
  const t = useTranslations();
  const activeAvisos = useAvisosStore((s) => s.activeAvisos());
  const markRead = useAvisosStore((s) => s.markRead);
  const { askAgent, viewRecommendation } = useAvisoActions();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Sync deep-link target on open; reset selection on close.
  useEffect(() => {
    if (open) {
      const valid =
        initialAvisoId && activeAvisos.some((a) => a.id === initialAvisoId)
          ? initialAvisoId
          : null;
      setSelectedId(valid);
      if (valid) markRead(valid);
    } else {
      setSelectedId(null);
    }
    // Intentionally keyed on open state only.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open ]);

  return (
    <BottomSheet open={open} onClose={onClose} title={t("alerts.title")} variant="detail">
      <AvisosView
        avisos={activeAvisos}
        selectedId={selectedId}
        onSelect={(aviso) => {
          setSelectedId(aviso.id);
          markRead(aviso.id);
        }}
        onBack={() => setSelectedId(null)}
        onAskAgent={(aviso) => {
          onClose();
          askAgent(aviso);
        }}
        onViewRecommendation={(aviso) => {
          onClose();
          viewRecommendation(aviso);
        }}
      />
    </BottomSheet>
  );
}
