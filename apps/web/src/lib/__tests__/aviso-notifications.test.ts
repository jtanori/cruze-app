import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import {
  filterNotifiableAvisos,
  getNotificationPermission,
  loadSeenIds,
  notifyAviso,
  requestNotificationPermission,
  saveSeenIds,
} from "../aviso-notifications";
import type { Aviso } from "../avisos";

function makeAviso(overrides: Partial<Aviso> = {}): Aviso {
  return {
    id: "a1",
    type: "crossing_changed",
    severity: "critical",
    title: "Crossing closed",
    description: "San Ysidro northbound closed",
    crossingId: "san-ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
    ...overrides,
  };
}

describe("filterNotifiableAvisos", () => {
  it("includes unread, non-dismissed, unseen critical avisos", () => {
    const out = filterNotifiableAvisos([makeAviso()], new Set());
    expect(out).toHaveLength(1);
  });

  it("excludes warning/info severities", () => {
    expect(
      filterNotifiableAvisos([makeAviso({ severity: "warning" })], new Set())
    ).toHaveLength(0);
    expect(
      filterNotifiableAvisos([makeAviso({ severity: "info" })], new Set())
    ).toHaveLength(0);
  });

  it("excludes read, dismissed, and already-seen avisos", () => {
    expect(
      filterNotifiableAvisos([makeAviso({ read: true })], new Set())
    ).toHaveLength(0);
    expect(
      filterNotifiableAvisos([makeAviso({ dismissed: true })], new Set())
    ).toHaveLength(0);
    expect(
      filterNotifiableAvisos([makeAviso()], new Set(["a1"]))
    ).toHaveLength(0);
  });
});

describe("seen-ids persistence", () => {
  beforeEach(() => localStorage.clear());

  it("round-trips through localStorage", () => {
    saveSeenIds(new Set(["a1", "a2"]));
    expect(loadSeenIds()).toEqual(new Set(["a1", "a2"]));
  });

  it("returns empty set on corrupt storage", () => {
    localStorage.setItem("cruze-notified-avisos", "not-json{{{");
    expect(loadSeenIds()).toEqual(new Set());
  });
});

describe("Notification API guards", () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("reports unsupported with no Notification global", () => {
    vi.stubGlobal("Notification", undefined);
    expect(getNotificationPermission()).toBe("unsupported");
    expect(notifyAviso(makeAviso())).toBe(false);
  });

  it("passes through denied permission without constructing", () => {
    const Ctor = vi.fn();
    vi.stubGlobal(
      "Notification",
      Object.assign(Ctor, { permission: "denied" })
    );
    expect(getNotificationPermission()).toBe("denied");
    expect(notifyAviso(makeAviso())).toBe(false);
    expect(Ctor).not.toHaveBeenCalled();
  });

  it("constructs a tagged notification when granted", () => {
    const Ctor = vi.fn();
    vi.stubGlobal(
      "Notification",
      Object.assign(Ctor, { permission: "granted" })
    );
    expect(notifyAviso(makeAviso())).toBe(true);
    expect(Ctor).toHaveBeenCalledTimes(1);
    expect(Ctor.mock.calls[0][0]).toBe("Crossing closed");
    expect(Ctor.mock.calls[0][1]).toMatchObject({
      body: "San Ysidro northbound closed",
      tag: "cruze-aviso-a1",
    });
  });

  it("requestPermission resolves without prompting when already decided", async () => {
    vi.stubGlobal(
      "Notification",
      Object.assign(vi.fn(), {
        permission: "denied",
        requestPermission: vi.fn(),
      })
    );
    const perm = await requestNotificationPermission();
    expect(perm).toBe("denied");
  });

  it("requestPermission returns unsupported with no API", async () => {
    vi.stubGlobal("Notification", undefined);
    expect(await requestNotificationPermission()).toBe("unsupported");
  });
});
