"use client";

import { useRouter } from "next/navigation";
import { useLocale } from "@/hooks/use-locale";
import { useEffect } from "react";

export default function StartingPointPage() {
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    router.replace(`/${locale}/trip/setup`);
  }, [router, locale]);

  return null;
}