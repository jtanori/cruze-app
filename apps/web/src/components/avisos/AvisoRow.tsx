"use client";

import { useLocale, useTranslations } from "next-intl";
import { Badge } from "@/components/primitives/Badge";
import type { Aviso } from "@/lib/avisos";

const SEVERITY_KEYS: Record<Aviso["severity"], string> = {
  critical: "alerts.severity.critical",
  warning: "alerts.severity.warning",
  info: "alerts.severity.info",
};

interface AvisoRowProps {
  aviso: Aviso;
  onClick?: () => void;
}

export function AvisoRow({ aviso, onClick }: AvisoRowProps) {
  const t = useTranslations();
  const locale = useLocale();
  const time = new Date(aviso.timestamp).toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit" });
  const variant = aviso.severity === "critical" ? "new" : aviso.severity === "warning" ? "count" : "neutral";

  return (
    <button onClick={onClick} className="w-full flex items-start gap-3 px-4 py-3 bg-surface border border-border rounded-[var(--radius-lg)] text-left hover:border-cruze-mint/30 transition-colors">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <Badge variant={variant as never}>{t(SEVERITY_KEYS[aviso.severity])}</Badge>
          <span className="text-xs text-muted">{time}</span>
        </div>
        <p className="text-sm font-medium text-ink mt-1 truncate">{aviso.title}</p>
        <p className="text-xs text-muted line-clamp-2">{aviso.description}</p>
        {aviso.crossingName && <p className="text-xs text-faint mt-1">{aviso.crossingName}</p>}
      </div>
    </button>
  );
}
