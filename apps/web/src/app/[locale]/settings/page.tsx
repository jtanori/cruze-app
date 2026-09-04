"use client";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { SettingsRoot } from "@/components/settings/SettingsRoot";
export default function SettingsPage() {
  const router = useRouter();
  const locale = useLocale();
  return <div className="px-4 sm:px-5 py-4 sm:py-6 max-w-sm sm:max-w-md lg:max-w-lg xl:max-w-2xl mx-auto"><SettingsRoot onProfile={() => router.push(`/${locale}/settings/profile`)} onFavorites={() => router.push(`/${locale}/settings/favorites`)} onMyTrips={() => router.push(`/${locale}/settings/trips`)} onDataSharing={() => router.push(`/${locale}/settings/data-sharing`)} onAbout={() => router.push(`/${locale}/settings/about`)} /></div>;
}
