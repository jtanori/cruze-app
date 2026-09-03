export type AvisoType =
  | "crossing_changed"
  | "recommendation_changed"
  | "crossing_closed"
  | "wait_increased"
  | "wait_decreased"
  | "trip_reminder"
  | "checklist_reminder"
  | "data_warning"
  | "unusual_condition";

export type AvisoSeverity = "info" | "warning" | "critical";

export interface Aviso {
  id: string;
  type: AvisoType;
  severity: AvisoSeverity;
  title: string;
  description: string;
  crossingId?: string;
  crossingName?: string;
  timestamp: string;
}

export function groupAvisosByTime(avisos: Aviso[]): { label: string; items: Aviso[] }[] {
  const now = new Date();
  const today: Aviso[] = [];
  const yesterday: Aviso[] = [];
  const earlier: Aviso[] = [];

  avisos.forEach((a) => {
    const d = new Date(a.timestamp);
    const diffDays = Math.floor((now.getTime() - d.getTime()) / 86400000);
    if (diffDays === 0) today.push(a);
    else if (diffDays === 1) yesterday.push(a);
    else earlier.push(a);
  });

  const groups: { label: string; items: Aviso[] }[] = [];
  if (today.length) groups.push({ label: "Hoy", items: today });
  if (yesterday.length) groups.push({ label: "Ayer", items: yesterday });
  if (earlier.length) groups.push({ label: "Anterior", items: earlier });
  return groups;
}
