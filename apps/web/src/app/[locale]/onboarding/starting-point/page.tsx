"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useLocale } from "@/hooks/use-locale";
import { StartingPoint } from "@/components/onboarding/StartingPoint";

export default function StartingPointPage() {
  const router = useRouter();
  const t = useTranslations();
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <StartingPoint
        onComplete={() => {
          router.push(`/${locale}/onboarding/recommendation`);
        }}
        onBack={() => {
          router.push(`/${locale}/onboarding/destination`);
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
