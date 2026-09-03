/**
 * Analytics Events
 * Event name constants and tracking placeholder for monetization.
 * Day-0: Logs to console. Phase 2+: Connect to analytics provider.
 */

import type { MonetizationEvent, MonetizationEventPayload } from "@/types/monetization";

type EventName = MonetizationEvent | string;

interface AnalyticsEventPayload {
  event: EventName;
  timestamp: string;
  sessionId: string;
  metadata?: Record<string, string | number | boolean>;
}

const SESSION_ID = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

const EVENT_QUEUE: AnalyticsEventPayload[] = [];
const MAX_QUEUE_SIZE = 100;

/**
 * Track an event.
 * Day-0: Console log + localStorage queue.
 */
export function trackEvent(
  event: EventName,
  metadata?: Record<string, string | number | boolean>
): void {
  const payload: AnalyticsEventPayload = {
    event,
    timestamp: new Date().toISOString(),
    sessionId: SESSION_ID,
    metadata,
  };

  // Console log in development
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics] ${event}`, metadata || "");
  }

  // Add to queue
  EVENT_QUEUE.push(payload);
  if (EVENT_QUEUE.length > MAX_QUEUE_SIZE) {
    EVENT_QUEUE.shift();
  }

  // Persist to localStorage
  saveEventQueue();
}

/**
 * Get all queued events.
 */
export function getQueuedEvents(): AnalyticsEventPayload[] {
  return [...EVENT_QUEUE];
}

/**
 * Flush event queue (call when sending to analytics provider).
 */
export function flushEvents(): AnalyticsEventPayload[] {
  const events = [...EVENT_QUEUE];
  EVENT_QUEUE.length = 0;
  saveEventQueue();
  return events;
}

/**
 * Get event count by type.
 */
export function getEventCounts(): Record<string, number> {
  const counts: Record<string, number> = {};
  for (const event of EVENT_QUEUE) {
    counts[event.event] = (counts[event.event] || 0) + 1;
  }
  return counts;
}

function saveEventQueue(): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("cruze-analytics", JSON.stringify(EVENT_QUEUE));
  } catch {
    // Storage full
  }
}

function loadEventQueue(): void {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem("cruze-analytics");
    if (raw) {
      const parsed = JSON.parse(raw);
      EVENT_QUEUE.push(...parsed);
    }
  } catch {
    // Invalid data
  }
}

// Load on import
if (typeof window !== "undefined") {
  loadEventQueue();
}