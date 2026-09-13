"use client";

import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import type { Aviso } from "@/lib/avisos";
import { AvisosList } from "./AvisosList";
import { AvisoDetail } from "./AvisoDetail";

interface AvisosViewProps {
  avisos: Aviso[];
  selectedId: string | null;
  onSelect: (aviso: Aviso) => void;
  onBack: () => void;
  onAskAgent: (aviso: Aviso) => void;
  onViewRecommendation: (aviso: Aviso) => void;
  className?: string;
}

/**
 * AV-HEAD-01 — Master/detail content for Avisos.
 * List groups (today/yesterday/earlier); selecting a row swaps to
 * the full AvisoDetail with back navigation. Chrome-free so both the
 * alerts page and the AvisosSheet can host it.
 */
export function AvisosView({
  avisos,
  selectedId,
  onSelect,
  onBack,
  onAskAgent,
  onViewRecommendation,
  className = "",
}: AvisosViewProps) {
  const t = useTranslations();
  const selected = selectedId
    ? avisos.find((a) => a.id === selectedId) ?? null
    : null;

  if (selected) {
    return (
      <div className={`space-y-3 ${className}`}>
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1 text-faint text-sm hover:text-ink transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          {t("common.back")}
        </button>
        <AvisoDetail
          aviso={selected}
          onAskAgent={() => onAskAgent(selected)}
          onViewRecommendation={() => onViewRecommendation(selected)}
        />
      </div>
    );
  }

  return (
    <AvisosList
      avisos={avisos}
      onSelect={onSelect}
      className={className}
    />
  );
}
