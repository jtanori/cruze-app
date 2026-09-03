"use client";

export function SettingsAbout() {
  return (
    <div className="space-y-4">
      <h2 className="text-lg font-bold text-ink">Acerca de Cruze</h2>
      <div className="bg-surface border border-border rounded-[var(--radius-lg)] p-5 space-y-3">
        <p className="text-sm text-ink">Cruze — Inteligencia Fronteriza</p>
        <p className="text-xs text-muted">Versi\u00F3n 1.0.0</p>
        <div className="pt-3 border-t border-border space-y-1">
          <p className="text-xs text-muted">Fuentes de datos: CBP Border Wait Times</p>
          <p className="text-xs text-muted">Privacidad · T\u00E9rminos · Licencias</p>
        </div>
      </div>
    </div>
  );
}
