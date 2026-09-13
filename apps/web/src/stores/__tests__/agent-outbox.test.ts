import { describe, it, expect, beforeEach } from "vitest";
import { useAgentStore } from "../agent";

describe("agent store — offline outbox (P5)", () => {
  beforeEach(() => {
    useAgentStore.getState().clearHistory();
    useAgentStore.getState().clearOutbox();
  });

  it("enqueues offline messages in order", () => {
    const first = useAgentStore.getState().enqueueOutbox("hola");
    const second = useAgentStore.getState().enqueueOutbox("wait times?");
    expect(first.id).not.toBe(second.id);
    const outbox = useAgentStore.getState().outbox;
    expect(outbox.map((q) => q.content)).toEqual(["hola", "wait times?"]);
  });

  it("dequeues flushed messages individually", () => {
    const first = useAgentStore.getState().enqueueOutbox("hola");
    useAgentStore.getState().enqueueOutbox("wait times?");
    useAgentStore.getState().dequeueOutbox(first.id);
    expect(useAgentStore.getState().outbox.map((q) => q.content)).toEqual([
      "wait times?",
    ]);
  });

  it("clearOutbox empties the queue", () => {
    useAgentStore.getState().enqueueOutbox("hola");
    useAgentStore.getState().clearOutbox();
    expect(useAgentStore.getState().outbox).toEqual([]);
  });
});
