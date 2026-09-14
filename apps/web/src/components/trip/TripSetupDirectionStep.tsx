"use client";

import { ArrowUp, ArrowDown } from "lucide-react";
import type { TripDirection } from "@/lib/trip-setup-flow";

interface TripSetupDirectionStepProps {
  value: TripDirection | null;
  onSelect: (dir: TripDirection) => void;
}

export function TripSetupDirectionStep({ value, onSelect }: TripSetupDirectionStepProps) {
  return (
    <div className="space-y-4 sm:space-y-5">
      <div>
        <h2 className="text-xl font-bold text-ink">{"¿Hacia dónde vas?"}</h2>
        <p className="text-sm text-muted mt-1">Selecciona la dirección de tu cruce</p>
      </div>

      <div className="space-y-3">
        {[
          { dir: "northbound" as TripDirection, label: "Estados Unidos", sub: "Hacia el norte", icon: ArrowUp },
          { dir: "southbound" as TripDirection, label: "México", sub: "Hacia el sur", icon: ArrowDown },
        ].map((o) => {
          const Icon = o.icon;
          const selected = value === o.dir;
          return (
            <button
              key={o.dir}
              onClick={() => onSelect(o.dir)}
              className={`w-full flex items-center gap-4 sm:gap-6 px-4 py-4 rounded-[var(--radius-lg)] border text-left transition-colors min-h-[64px] ${
                selected ? "bg-cruze-mint/10 border-cruze-mint/50" : "bg-surface border-border hover:border-cruze-mint/30"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${selected ? "bg-cruze-mint" : "bg-surface-elevated"}`}>
                <Icon className={`w-5 h-5 ${selected ? "text-midnight" : "text-muted"}`} />
              </div>
              <div>
                <p className="text-sm font-semibold text-ink">{o.label}</p>
                <p className="text-xs text-muted">{o.sub}</p>
              </div>
              <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${selected ? "border-cruze-mint bg-cruze-mint" : "border-border"}`}>
                {selected && <span className="w-2 h-2 rounded-full bg-midnight" />}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
