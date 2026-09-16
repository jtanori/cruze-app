import { describe, it, expect, beforeEach } from "vitest";
import { usePrivacyStore } from "../privacy";

describe("privacy store — append-only versioned acknowledgements", () => {
  beforeEach(() => {
    usePrivacyStore.getState().reset();
  });

  it("starts unacknowledged", () => {
    expect(usePrivacyStore.getState().isAcknowledged("1.0")).toBe(false);
  });

  it("acknowledge records with timestamp and matches version", () => {
    usePrivacyStore.getState().acknowledge({
      documentKey: "privacy",
      documentVersion: "1.0",
      locale: "es",
      jurisdiction: "MX",
      withOptionals: true,
    });
    const state = usePrivacyStore.getState();
    expect(state.isAcknowledged("1.0")).toBe(true);
    expect(state.acknowledgements[0].acknowledgedAt).toBeTruthy();
    expect(state.acknowledgements[0].jurisdiction).toBe("MX");
  });

  it("old versions never count — re-review required on bump", () => {
    usePrivacyStore.getState().acknowledge({
      documentKey: "privacy",
      documentVersion: "1.0",
      locale: "es",
      jurisdiction: "UNKNOWN",
      withOptionals: false,
    });
    expect(usePrivacyStore.getState().isAcknowledged("2.0")).toBe(false);
    expect(usePrivacyStore.getState().isAcknowledged("1.0")).toBe(true);
  });

  it("records accumulate, never overwritten", () => {
    const api = usePrivacyStore.getState();
    api.acknowledge({
      documentKey: "privacy",
      documentVersion: "1.0",
      locale: "es",
      jurisdiction: "MX",
      withOptionals: false,
    });
    api.acknowledge({
      documentKey: "privacy",
      documentVersion: "2.0",
      locale: "es",
      jurisdiction: "MX",
      withOptionals: true,
    });
    expect(usePrivacyStore.getState().acknowledgements).toHaveLength(2);
  });
});
