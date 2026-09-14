/**
 * AV-01 — Unified Aviso types.
 *
 * Replaces BorderAlertEvent as the canonical notification model.
 * Extends with product-level event types, read/dismissed state,
 * and diff tracking from BorderAlertEvent.
 */

export type AvisoType =
  | "crossing_changed"      // STATUS_CHANGE from CrossingChange
  | "wait_surge"            // WAIT_SURGE from CrossingChange
  | "wait_drop"             // WAIT_DROP from CrossingChange
  | "recommendation_changed"
  | "trip_reminder"
  | "checklist_reminder"
  | "data_warning"          // freshness degradation
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
  previousValue?: string;
  currentValue?: string;
  timestamp: string;
  read: boolean;
  dismissed: boolean;
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
    if (a.dismissed) return;
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
