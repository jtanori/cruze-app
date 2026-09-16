"use client";

import { useTranslations } from "next-intl";
import { ChevronRight } from "lucide-react";

interface AboutLink {
  labelKey: string;
  href?: string;
}

const LINKS: AboutLink[] = [
  { labelKey: "settings.about.terms", href: "#" },
  { labelKey: "settings.about.privacy", href: "#" },
  { labelKey: "settings.about.legal", href: "#" },
  { labelKey: "settings.about.sources", href: "#" },
];

export function SettingsAbout() {
  const t = useTranslations();
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-ink">{t("settings.about.title")}</h2>

      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-2">
        <p className="text-sm text-ink font-medium">{t("settings.about.tagline")}</p>
        <p className="text-xs text-muted">{t("settings.about.version", { v: "1.0.0" })}</p>
      </div>

      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
        {LINKS.map((link) => (
          <a
            key={link.labelKey}
            href={link.href}
            className="flex items-center justify-between px-4 py-4 text-left hover:bg-surface-elevated transition-colors"
          >
            <span className="text-sm text-ink">{t(link.labelKey)}</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </a>
        ))}
      </div>
    </div>
  );
}
