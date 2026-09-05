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

export function groupAvisosByTime(avisos: Aviso[]): { labelKey: string; label: string; items: Aviso[] }[] {
  const now = new Date();
  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);
  const startOfYesterday = new Date(startOfToday);
  startOfYesterday.setDate(startOfToday.getDate() - 1);

  const today: Aviso[] = [];
  const yesterday: Aviso[] = [];
  const earlier: Aviso[] = [];

  avisos.forEach((a) => {
    const d = new Date(a.timestamp);
    if (d >= startOfToday) today.push(a);
    else if (d >= startOfYesterday) yesterday.push(a);
    else earlier.push(a);
  });

  const groups: { labelKey: string; label: string; items: Aviso[] }[] = [];
  if (today.length) groups.push({ labelKey: "alerts.today", label: "Hoy", items: today });
  if (yesterday.length) groups.push({ labelKey: "alerts.yesterday", label: "Ayer", items: yesterday });
  if (earlier.length) groups.push({ labelKey: "alerts.earlier", label: "Anterior", items: earlier });
  return groups;
}
