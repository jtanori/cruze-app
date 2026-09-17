"use client";

import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";

interface CruzeBackHeaderProps {
  title?: string;
  onBack?: () => void;
  trailing?: React.ReactNode;
  className?: string;
}

export function CruzeBackHeader({
  title,
  onBack,
  trailing,
  className = "",
}: CruzeBackHeaderProps) {
  const t = useTranslations();
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <header
      className={`sticky top-0 z-[var(--z-header)] bg-background/80 backdrop-blur-lg border-b border-border-subtle ${className}`}
    >
      <div className="h-[var(--nav-header-height)] flex items-center justify-between px-3">
        <div className="min-w-[44px] flex items-center">
          <button
            onClick={handleBack}
            className="w-[44px] h-[44px] flex items-center justify-center -ml-2 rounded-[var(--radius-md)] active:bg-surface-elevated transition-colors"
            aria-label={t("common.back")}
          >
            <ArrowLeft className="w-5 h-5 text-ink" />
          </button>
          {title && (
            <span className="text-ink font-semibold text-xs sm:text-sm uppercase tracking-wider ml-1 truncate max-w-[200px]">
              {title}
            </span>
          )}
        </div>
        {trailing && <div className="min-w-[44px] flex items-center justify-end">{trailing}</div>}
      </div>
    </header>
  );
}
