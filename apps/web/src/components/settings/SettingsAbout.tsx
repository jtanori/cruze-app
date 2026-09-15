"use client";

import { ChevronRight } from "lucide-react";

interface AboutLink {
  label: string;
  href?: string;
}

const LINKS: AboutLink[] = [
  { label: "Términos de servicio", href: "#" },
  { label: "Privacidad", href: "#" },
  { label: "Información legal", href: "#" },
  { label: "Fuentes de datos", href: "#" },
];

export function SettingsAbout() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-ink">Acerca de Cruze</h2>

      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-2">
        <p className="text-sm text-ink font-medium">Cruze — Inteligencia Fronteriza</p>
        <p className="text-xs text-muted">Versión 1.0.0</p>
      </div>

      <div className="bg-surface border border-border rounded-[var(--radius-lg)] divide-y divide-border">
        {LINKS.map((link) => (
          <a
            key={link.label}
            href={link.href}
            className="flex items-center justify-between px-4 py-4 text-left hover:bg-surface-elevated transition-colors"
          >
            <span className="text-sm text-ink">{link.label}</span>
            <ChevronRight className="w-4 h-4 text-muted" />
          </a>
        ))}
      </div>
    </div>
  );
}
