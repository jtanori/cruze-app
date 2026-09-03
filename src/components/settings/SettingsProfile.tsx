"use client";

import { useState } from "react";
import { Select } from "@/components/primitives/Select";

interface SettingsProfileProps {
  className?: string;
}

export function SettingsProfile({ className = "" }: SettingsProfileProps) {
  const [travelMode, setTravelMode] = useState("privateVehicle");
  const [accessType, setAccessType] = useState("standard");

  return (
    <div className={`space-y-5 ${className}`}>
      <h2 className="text-lg font-bold text-ink">Perfil</h2>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-muted">Modo de viaje</label>
          <Select value={travelMode} onChange={(e) => setTravelMode(e.target.value)} options={[{value:"walking",label:"A pie"},{value:"privateVehicle",label:"Veh\u00EDculo privado"},{value:"commercial",label:"Comercial"}]} className="mt-1" />
        </div>
        <div>
          <label className="text-xs font-medium text-muted">Tipo de acceso</label>
          <Select value={accessType} onChange={(e) => setAccessType(e.target.value)} options={[{value:"standard",label:"Est\u00E1ndar"},{value:"readyLane",label:"Ready Lane"},{value:"sentri",label:"SENTRI"}]} className="mt-1" />
        </div>
      </div>
    </div>
  );
}
