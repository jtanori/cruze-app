"use client";
import { useTranslations } from "next-intl";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsDataSharing } from "@/components/settings/SettingsDataSharing";

export default function DataSharingPage() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={t("settings.pages.dataSharingTitle")} />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsDataSharing />
      </div>
    </div>
  );
}
