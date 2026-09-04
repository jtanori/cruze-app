"use client";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { CruzeBackHeader } from "@/components/layout/CruzeBackHeader";
import { SettingsRoot } from "@/components/settings/SettingsRoot";

export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  return (
    <div className="min-h-dvh bg-background">
      <CruzeBackHeader title="CONFIGURACIÓN" />
      <div className="px-4 sm:px-5 py-4 sm:py-6">
        <SettingsRoot
          onProfile={() => router.push(`/${locale}/settings/profile`)}
          onFavorites={() => router.push(`/${locale}/settings/favorites`)}
          onMyTrips={() => router.push(`/${locale}/settings/trips`)}
          onDataSharing={() => router.push(`/${locale}/settings/data-sharing`)}
          onAbout={() => router.push(`/${locale}/settings/about`)}
        />
      </div>
    </div>
  );
}
