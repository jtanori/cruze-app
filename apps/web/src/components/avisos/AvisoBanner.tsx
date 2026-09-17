"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { useLocale } from "@/hooks/use-locale";
import { useAvisosStore } from "@/stores/avisos";

interface AvisoBannerProps {
  className?: string;
}

export function AvisoBanner({ className = "" }: AvisoBannerProps) {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  const unread = useAvisosStore((s) => s.unreadCount());

  if (unread === 0) return null;

  return (
    <button
      onClick={() => router.push(`/${locale}/alerts`)}
      className={`w-full flex items-center justify-between gap-3 bg-surface border border-border rounded-[var(--radius-lg)] p-4 sm:p-6 mt-4 sm:mt-6 text-left hover:bg-surface-elevated transition-colors ${className}`}
    >
      <span className="text-xs font-semibold uppercase tracking-wider text-muted">
        {t(unread === 1 ? "alerts.bannerSingular" : "alerts.bannerPlural", { count: unread })}
      </span>
      <ChevronRight className="w-4 h-4 text-faint shrink-0" />
    </button>
  );
}
