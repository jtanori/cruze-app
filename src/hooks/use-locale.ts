"use client";

import { usePathname } from "next/navigation";

/**
 * Returns the current locale extracted from the URL pathname.
 * Defaults to "es" if no locale segment is found.
 *
 * Replaces the repeated pattern:
 *   const pathname = usePathname();
 *   const locale = pathname.split("/")[1] || "es";
 */
export function useLocale(): string {
  const pathname = usePathname();
  return pathname.split("/")[1] || "es";
}
