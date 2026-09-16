"use client";
import { useTranslations } from "next-intl";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsProfile } from "@/components/settings/SettingsProfile";

export default function ProfilePage() {
  const t = useTranslations();
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={t("settings.pages.profileTitle")} />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsProfile />
      </div>
    </div>
  );
}
