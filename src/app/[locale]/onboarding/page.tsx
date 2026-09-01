"use client";

import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";

export default function OnboardingPage() {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname.split("/")[1] || "es";
    router.replace(`/${locale}/onboarding/destination`);
  }, [router, pathname]);

  return (
    <div className="min-h-dvh bg-background flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-cruze-green border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
