"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.replace(`/${locale}/onboarding/destination`);
  }, [router, locale]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
