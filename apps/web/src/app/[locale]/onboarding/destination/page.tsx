"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useEffect } from "react";

export default function DestinationPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    console.log("[Cruze:Router] /onboarding/destination → /trip/setup");
    router.replace(`/${locale}/trip/setup`);
  }, [router, locale]);

  return null;
}