import { describe, it, expect } from "vitest";
import { mapCrossingChangeToAviso, mapBorderAlertEventToAviso } from "../aviso-mapping";
import type { CrossingChange } from "../live-crossing/types";
import type { BorderAlertEvent } from "../../types";

function makeCrossingChange(overrides: Partial<CrossingChange> = {}): CrossingChange {
  return {
    type: "STATUS_CHANGE",
    crossingId: "san-ysidro",
    previousStatus: "open",
    currentStatus: "closed",
    previousWait: 30,
    currentWait: 0,
    deltaMinutes: -30,
    deltaPercent: -1,
    detectedAt: "2026-01-01T00:00:00Z",
    ...overrides,
  };
}

function makeBorderAlertEvent(overrides: Partial<BorderAlertEvent> = {}): BorderAlertEvent {
  return {
    id: "alert-1",
    crossingId: "san-ysidro",
    crossingName: "San Ysidro",
    direction: "MX_TO_US",
    timestamp: "2026-01-01T00:00:00Z",
    type: "QUEUE_SURGE",
    severity: "IMPORTANT",
    headline: "Wait increased",
    description: "Wait time increased to 45 min",
    ...overrides,
  };
}

describe("mapCrossingChangeToAviso", () => {
  it("maps STATUS_CHANGE to crossing_changed with correct severity", () => {
    const change = makeCrossingChange();
    const aviso = mapCrossingChangeToAviso(change);

    expect(aviso.type).toBe("crossing_changed");
    expect(aviso.severity).toBe("critical");
    expect(aviso.crossingId).toBe("san-ysidro");
    expect(aviso.read).toBe(false);
    expect(aviso.dismissed).toBe(false);
  });

  it("maps open→limited STATUS_CHANGE to warning severity", () => {
    const change = makeCrossingChange({
      previousStatus: "open",
      currentStatus: "limited",
    });
    const aviso = mapCrossingChangeToAviso(change);
    expect(aviso.severity).toBe("warning");
  });

  it("maps closed→open STATUS_CHANGE to info severity", () => {
    const change = makeCrossingChange({
      previousStatus: "closed",
      currentStatus: "open",
    });
    const aviso = mapCrossingChangeToAviso(change);
    expect(aviso.severity).toBe("info");
  });

  it("maps WAIT_SURGE to wait_surge with warning severity", () => {
    const change = makeCrossingChange({
      type: "WAIT_SURGE",
      previousWait: 20,
      currentWait: 40,
    });
    const aviso = mapCrossingChangeToAviso(change);

    expect(aviso.type).toBe("wait_surge");
    expect(aviso.severity).toBe("warning");
    expect(aviso.previousValue).toBe("20");
    expect(aviso.currentValue).toBe("40");
  });

  it("maps WAIT_DROP to wait_drop with info severity", () => {
    const change = makeCrossingChange({
      type: "WAIT_DROP",
      previousWait: 45,
      currentWait: 25,
    });
    const aviso = mapCrossingChangeToAviso(change);

    expect(aviso.type).toBe("wait_drop");
    expect(aviso.severity).toBe("info");
  });

  it("generates unique ids", () => {
    const change = makeCrossingChange();
    const aviso1 = mapCrossingChangeToAviso(change);
    const aviso2 = mapCrossingChangeToAviso(change);
    expect(aviso1.id).not.toBe(aviso2.id);
  });
});

describe("mapBorderAlertEventToAviso", () => {
  it("maps QUEUE_SURGE to wait_surge", () => {
    const event = makeBorderAlertEvent({ type: "QUEUE_SURGE" });
    const aviso = mapBorderAlertEventToAviso(event);
    expect(aviso.type).toBe("wait_surge");
  });

  it("maps PORT_CLOSURE to crossing_changed", () => {
    const event = makeBorderAlertEvent({ type: "PORT_CLOSURE" });
    const aviso = mapBorderAlertEventToAviso(event);
    expect(aviso.type).toBe("crossing_changed");
  });

  it("maps severity correctly", () => {
    expect(mapBorderAlertEventToAviso(makeBorderAlertEvent({ severity: "NORMAL" })).severity).toBe("info");
    expect(mapBorderAlertEventToAviso(makeBorderAlertEvent({ severity: "NOTABLE" })).severity).toBe("info");
    expect(mapBorderAlertEventToAviso(makeBorderAlertEvent({ severity: "IMPORTANT" })).severity).toBe("warning");
    expect(mapBorderAlertEventToAviso(makeBorderAlertEvent({ severity: "CRITICAL" })).severity).toBe("critical");
  });

  it("preserves previousValue and currentValue", () => {
    const event = makeBorderAlertEvent({
      previousValue: "20",
      currentValue: "45",
    });
    const aviso = mapBorderAlertEventToAviso(event);
    expect(aviso.previousValue).toBe("20");
    expect(aviso.currentValue).toBe("45");
  });
});
