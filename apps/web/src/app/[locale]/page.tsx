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
      console.log("[Cruze:Router] Root → /trip (first launch - T01 empty)");
      router.replace(`/${locale}/trip`);
    } else {
      console.log("[Cruze:Router] Root → /trip (returning user)");
      router.replace(`/${locale}/trip`);
    }
  }, [completed, router, locale]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <Spinner size="lg" />
    </div>
  );
}