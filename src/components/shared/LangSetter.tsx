"use client";

import { useEffect } from "react";

/**
 * Sets the document's lang attribute to the current locale.
 * Used in layouts where <html> is in the root layout but
 * the dynamic locale is determined in a nested layout.
 */
export function LangSetter({ locale }: { locale: string }) {
  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return null;
}
