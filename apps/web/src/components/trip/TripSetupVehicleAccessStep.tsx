"use client";

import type { AccessType } from "@/lib/trip-setup-flow";

interface TripSetupVehicleAccessStepProps {
  value: AccessType | null;
  onSelect: (access: AccessType) => void;
}

export function TripSetupVehicleAccessStep({ value, onSelect }: TripSetupVehicleAccessStepProps) {
  const options: { access: AccessType; label: string; desc: string }[] = [
    { access: "standard", label: "Cruce estándar", desc: "Carriles generales" },
    { access: "readyLane", label: "Ready Lane", desc: "Documentos RFID" },
    { access: "sentri", label: "SENTRI / Global Entry", desc: "Carriles exprés" },
    { access: "unknown", label: "No estoy seguro", desc: "Mostrar todas las opciones" },
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"¿Cómo cruzas normalmente?"}</h2>
        <p className="text-sm text-muted mt-1">Filtra recomendaciones por tipo de acceso</p>
      </div>

      <div className="space-y-3">
        {options.map((o) => {
          const selected = value === o.access;
          return (
            <button
              key={o.access}
              onClick={() => onSelect(o.access)}
              className={`w-full flex items-center gap-4 sm:gap-6 px-4 py-4 rounded-[var(--radius-lg)] border text-left transition-colors min-h-[56px] ${
                selected ? "bg-cruze-mint/10 border-cruze-mint/50" : "bg-surface border-border hover:border-cruze-mint/30"
              }`}
            >
              <div className="flex-1">
                <p className="text-sm font-semibold text-ink">{o.label}</p>
                <p className="text-xs text-muted">{o.desc}</p>
              </div>
              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-cruze-mint bg-cruze-mint" : "border-border"}`}>
                {selected && <span className="w-2 h-2 rounded-full bg-midnight" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
