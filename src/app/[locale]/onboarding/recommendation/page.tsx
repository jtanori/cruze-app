"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { RecommendationView } from "@/components/onboarding/RecommendationView";

export default function RecommendationPage() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const locale = pathname.split("/")[1] || "es";

  return (
    <div className="space-y-6">
      <RecommendationView
        onStartTrip={() => {
          router.push(`/${locale}/crossings`);
        }}
        onSeeAllCrossings={() => {
          router.push(`/${locale}/crossings`);
        }}
      />
      <button
        onClick={() => router.push(`/${locale}/crossings`)}
        className="w-full text-center text-muted text-sm font-medium hover:text-ink transition-colors"
      >
        {t("onboarding.viewAllCrossings")}
      </button>
    </div>
  );
}
