"use client";

import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsRoot } from "@/components/settings/SettingsRoot";
import { PwaInstallRow } from "@/components/pwa/PwaInstallRow";

export default function SettingsPage() {
  const t = useTranslations();
  const router = useRouter();
  const locale = useLocale();
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title={t("settings.title")} />
      <div className="px-4 sm:px-5 py-4 sm:py-6 space-y-4">
        <PwaInstallRow />
        <SettingsRoot
          onProfile={() => router.push(`/${locale}/settings/profile`)}
          onFavorites={() => router.push(`/${locale}/settings/favorites`)}
          onMyTrips={() => router.push(`/${locale}/settings/trips`)}
          onDataSharing={() => router.push(`/${locale}/settings/data-sharing`)}
          onAbout={() => router.push(`/${locale}/settings/about`)}
          onContact={() => router.push(`/${locale}/contact`)}
        />
      </div>
    </div>
  );
}
