"use client";

import { useTranslations } from "next-intl";

interface FreshnessTagProps {
  lastUpdated: string;
}

export function FreshnessTag({ lastUpdated }: FreshnessTagProps) {
  const t = useTranslations();
  const diff = Date.now() - new Date(lastUpdated).getTime();
  const mins = Math.floor(diff / 60000);
  const isDelayed = mins >= 15;

  const getTimeAgo = (): string => {
    if (mins < 1) return t("shared.updatedJustNow");
    if (mins < 2) return t("shared.updatedOneMinAgo");
    if (mins < 15) return t("shared.updatedMinAgo", { minutes: mins });
    return t("shared.dataDelayed", { minutes: mins });
  };

  return (
    <span
      className={`text-xs tabular ${
        isDelayed ? "text-caution" : "text-faint"
      }`}
    >
      {getTimeAgo()}
    </span>
  );
}
