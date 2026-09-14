"use client";

import type { DocumentType } from "@/lib/trip-setup-flow";

interface TripSetupDocumentProfileStepProps {
  value: DocumentType | null;
  onSelect: (doc: DocumentType) => void;
  onSkip: () => void;
}

export function TripSetupDocumentProfileStep({ value, onSelect, onSkip }: TripSetupDocumentProfileStepProps) {
  const options: { doc: DocumentType; label: string }[] = [
    { doc: "passport", label: "Pasaporte / documento de viaje" },
    { doc: "visa", label: "Visa" },
    { doc: "usCitizen", label: "Ciudadanía / residencia de EE. UU." },
    { doc: "trustedTraveler", label: "Programa de viajero confiable" },
    { doc: "unknown", label: "No estoy seguro" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"¿Qué documentación tienes?"}</h2>
        <p className="text-sm text-muted mt-1">Opcional — ayuda a filtrar recomendaciones</p>
      </div>

      <div className="p-3 rounded-[var(--radius-lg)] bg-info/10 border border-info/20">
        <p className="text-xs text-info leading-relaxed">
          Esta información ayuda a filtrar recomendaciones. No determina tu elegibilidad legal para ingresar al país.
        </p>
      </div>

      <div className="space-y-3">
        {options.map((o) => {
          const selected = value === o.doc;
          return (
            <button
              key={o.doc}
              onClick={() => onSelect(o.doc)}
              className={`w-full flex items-center gap-4 sm:gap-6 px-4 py-3.5 rounded-[var(--radius-lg)] border text-left transition-colors min-h-[48px] ${
                selected ? "bg-cruze-mint/10 border-cruze-mint/50" : "bg-surface border-border hover:border-cruze-mint/30"
              }`}
            >
              <span className="text-sm font-medium text-ink flex-1">{o.label}</span>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-cruze-mint bg-cruze-mint" : "border-border"}`}>
                {selected && <span className="w-2 h-2 rounded-full bg-midnight" />}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onSkip}
        className="w-full text-center text-sm font-medium text-muted hover:text-ink transition-colors py-2"
      >
        Omitir
      </button>
    </div>
  );
}
