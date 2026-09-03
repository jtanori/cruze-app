"use client";

interface CrossingDetailRestrictionsSectionProps {
  restrictions: string[];
  className?: string;
}

export function CrossingDetailRestrictionsSection({ restrictions, className = "" }: CrossingDetailRestrictionsSectionProps) {
  return (
    <div className={`space-y-2 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-wider text-muted">RESTRICCIONES</p>
      {restrictions.length === 0 ? (
        <p className="text-sm text-muted">Sin restricciones reportadas</p>
      ) : (
        <ul className="space-y-1.5">
          {restrictions.map((r) => (
            <li key={r} className="text-sm text-ink flex gap-2"><span className="text-warning">•</span> {r}</li>
          ))}
        </ul>
      )}
    </div>
  );
}
