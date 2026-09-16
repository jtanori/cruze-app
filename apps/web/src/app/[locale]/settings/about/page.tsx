"use client";

import { useTranslations } from "next-intl";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsAbout } from "@/components/settings/SettingsAbout";

export default function AboutPage() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={t("settings.pages.aboutTitle")} />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsAbout />
      </div>
    </div>
  );
}
