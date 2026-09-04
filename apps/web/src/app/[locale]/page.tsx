"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useTripStore } from "@/stores/trip";
import { Spinner } from "@/components/primitives/Spinner";

export default function HomePage() {
  const router = useRouter();
  const locale = useLocale();
  const completed = useTripStore((s) => s.completed);

  useEffect(() => {
    if (!completed) {
      console.log("[Cruze:Router] Root → onboarding (first launch)");
      router.replace(`/${locale}/onboarding`);
    } else {
      console.log("[Cruze:Router] Root → viaje (returning user)");
      router.replace(`/${locale}/viaje`);
    }
  }, [completed, router, locale]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}
