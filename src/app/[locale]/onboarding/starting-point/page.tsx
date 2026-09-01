"use client";

import { useRouter, usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { StartingPoint } from "@/components/onboarding/StartingPoint";

export default function StartingPointPage() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations();
  const locale = pathname.split("/")[1] || "es";

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
