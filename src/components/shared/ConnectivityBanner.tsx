"use client";

import { WifiOff } from "lucide-react";
import { useTranslations } from "next-intl";

interface ConnectivityBannerProps {
  isOnline: boolean;
  onRetry?: () => void;
}

export function ConnectivityBanner({
  isOnline,
  onRetry,
}: ConnectivityBannerProps) {
  const t = useTranslations();

  if (isOnline) return null;

  return (
    <div className="bg-caution-soft border-b border-caution/20 px-5 py-2.5 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <WifiOff className="w-4 h-4 text-caution" />
        <span className="text-caution text-xs font-medium">
          {t("shared.offline")}
        </span>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="text-caution text-xs font-semibold underline underline-offset-2"
        >
          {t("common.retry")}
        </button>
      )}
    </div>
  );
}
