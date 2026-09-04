"use client";

import { useLocale } from "@/hooks/use-locale";

const screens = [
  { path: "/onboarding/location-permission", title: "L01 Location Permission", desc: "Location permission gate + prompt + acquisition + recovery" },
  { path: "/onboarding/destination", title: "T02 Destination Search (legacy)", desc: "Redirects to trip/setup" },
  { path: "/onboarding/starting-point", title: "T03 Origin/Starting Point (legacy)", desc: "Redirects to trip/setup" },
  { path: "/onboarding/recommendation", title: "T07 Recommendation (legacy)", desc: "Redirects to trip/recommendation" },
  { path: "/trip/setup", title: "T02-T09 Trip Setup Flow", desc: "Unified adaptive flow: Destination -> Origin -> Travel Mode -> Direction -> Access -> Docs -> Recommendation" },
  { path: "/trip/recommendation", title: "T07 Recommendation Screen", desc: "Primary card + reasons + alternatives + deltas" },
  { path: "/trip/completion", title: "T10 Trip Completion", desc: "Save to My Trips / Done" },
  { path: "/viaje", title: "T08 Active Trip (Viaje)", desc: "TripStatusHeader + RouteSummary + ActionBar + Checklist" },
  { path: "/viaje/configure", title: "Viaje Configure (legacy)", desc: "Redirects to trip/setup" },
  { path: "/crossings", title: "C01 Crossings Directory", desc: "Search + Filter (All/MX/US + Auto/A pie/Comercial) + Expandable rows" },
  { path: "/crossing/san-ysidro", title: "C03 Crossing Detail (San Ysidro)", desc: "Hero + Map + Lanes + Access + Hours + Requirements + Restrictions + Services + ActionBar" },
  { path: "/crossing/otay-mesa", title: "C03 Crossing Detail (Otay Mesa)", desc: "Canonical detail page with live CBP data" },
  { path: "/crossing/calexico-west", title: "C03 Crossing Detail (Calexico West)", desc: "Canonical detail page" },
  { path: "/crossing/el-paso-ysleta", title: "C03 Crossing Detail (El Paso Ysleta)", desc: "Canonical detail page" },
  { path: "/agent", title: "A01/A02 Agent", desc: "Welcome screen + Chat with structured results (Crossing/Recommendation/TripAction/Checklist)" },
  { path: "/alertas", title: "N01/N02 Avisos", desc: "Grouped by Today/Yesterday/Earlier + Detail with Agent action" },
  { path: "/settings", title: "S01 Settings Root", desc: "5 sections: Perfil / Guardados / Privacidad / Informacion" },
  { path: "/settings/profile", title: "S02 Profile", desc: "Travel mode, access type, SENTRI, visas, passport country" },
  { path: "/settings/favorites", title: "S03 Favorites", desc: "Saved crossings list + management" },
  { path: "/settings/trips", title: "S04 My Trips", desc: "Completed trips only (from trip-lifecycle)" },
  { path: "/settings/data-sharing", title: "S05 Data Sharing", desc: "Placeholder (Proximamente)" },
  { path: "/settings/about", title: "S06 About", desc: "Legal, privacy, version, data sources" },
  { path: "/", title: "Home (Root)", desc: "Redirects to /es/viaje or onboarding" },
];

export default function TestIndexPage() {
  const locale = useLocale();
  const base = `/${locale}`;

  return (
    <div className="min-h-dvh bg-background pt-safe pb-safe px-safe px-4 sm:px-5 py-8 sm:py-10 mx-auto">
      <header className="mb-8 sm:mb-10 space-y-3">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-ink">Cruze - Manual Test Index</h1>
        <p className="text-muted">All v3 screens for manual testing. Click to navigate.</p>
        <div className="flex flex-wrap gap-1.5 sm:gap-2 text-xs sm:text-sm text-muted">
          <span>Locale: <strong>{locale}</strong></span>
          <span>|</span>
          <span>{screens.length} screens</span>
          <span>|</span>
          <span>v3.0</span>
        </div>
      </header>

      <div className="space-y-5 sm:space-y-6">
        {[
          { label: "Onboarding / Location", items: screens.slice(0, 4) },
          { label: "Trip Setup (Unified)", items: screens.slice(4, 7) },
          { label: "Active Trip", items: screens.slice(7, 9) },
          { label: "Crossings", items: screens.slice(9, 14) },
          { label: "Agent", items: screens.slice(14, 15) },
          { label: "Avisos", items: screens.slice(15, 16) },
          { label: "Settings", items: screens.slice(16, 22) },
          { label: "Home", items: screens.slice(22) },
        ].map((section) => (
          <section key={section.label} className="space-y-3">
            <h2 className="text-base sm:text-lg font-semibold text-ink border-b border-border pb-1">{section.label}</h2>
            <div className="space-y-2">
              {section.items.map((screen) => (
                <a
                  key={screen.path}
                  href={base + screen.path}
                  className="block p-3 sm:p-4 bg-surface border border-border rounded-[var(--radius-lg)] hover:border-cruze-mint/50 hover:bg-surface-elevated transition-colors"
                >
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-ink font-semibold text-sm sm:text-base">{screen.title}</h3>
                      <p className="text-muted text-xs sm:text-sm mt-1 line-clamp-2">{screen.desc}</p>
                    </div>
                    <span className="text-xs font-mono text-muted shrink-0 sm:block">{screen.path}</span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        ))}
      </div>

      <footer className="mt-10 sm:mt-12 pt-5 sm:pt-6 border-t border-border text-center text-sm sm:text-base text-muted">
        <p className="px-3 py-2 sm:px-4 sm:py-2">v3.0 - All phases complete. <a href="/docs/PAGES_WORKFLOWS_REPORT.md" className="text-cruze-mint hover:underline">Pages x Workflows Report</a></p>
      </footer>
    </div>
  );
}