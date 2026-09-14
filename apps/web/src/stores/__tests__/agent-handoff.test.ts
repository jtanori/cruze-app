import { describe, it, expect, beforeEach } from "vitest";
import { useAgentStore } from "../agent";

describe("agent pendingContext — one-shot, never stale", () => {
  beforeEach(() => {
    useAgentStore.getState().clearPendingContext();
  });

  it("starts null: direct launches inherit nothing", () => {
    expect(useAgentStore.getState().pendingContext).toBeNull();
  });

  it("set → read → clear round-trips a single handoff", () => {
    useAgentStore
      .getState()
      .setPendingContext({ crossingId: "lukeville", crossingName: "Lukeville" });
    expect(useAgentStore.getState().pendingContext).toEqual({
      crossingId: "lukeville",
      crossingName: "Lukeville",
    });
    useAgentStore.getState().clearPendingContext();
    expect(useAgentStore.getState().pendingContext).toBeNull();
  });
});
