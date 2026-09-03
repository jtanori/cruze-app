"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface CrossingDetailRequirementsSectionProps {
  requirements: string[];
  className?: string;
}

export function CrossingDetailRequirementsSection({ requirements, className = "" }: CrossingDetailRequirementsSectionProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className={`space-y-2 ${className}`}>
      <button onClick={() => setExpanded(!expanded)} className="w-full flex items-center justify-between">
        <p className="text-xs font-semibold uppercase tracking-wider text-muted">REQUISITOS</p>
        {expanded ? <ChevronUp className="w-4 h-4 text-muted" /> : <ChevronDown className="w-4 h-4 text-muted" />}
      </button>
      {expanded && (
        <ul className="space-y-1.5">
          {requirements.map((r) => (
            <li key={r} className="text-sm text-ink flex gap-2"><span className="text-muted">•</span> {r}</li>
          ))}
          {requirements.length === 0 && <li className="text-sm text-muted">No hay requisitos adicionales</li>}
        </ul>
      )}
    </div>
  );
}
