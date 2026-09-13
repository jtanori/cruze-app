import { describe, it, expect, vi } from "vitest";
import { flushAgentOutbox } from "../agent-outbox";
import type { QueuedAgentMessage } from "@/stores/agent";

function queued(id: string, content: string): QueuedAgentMessage {
  return { id, content, timestamp: new Date().toISOString() };
}

describe("flushAgentOutbox", () => {
  it("sends in FIFO order and dequeues each on success", async () => {
    const queue = [queued("1", "first"), queued("2", "second")];
    const sent: string[] = [];
    const dequeued: string[] = [];

    await flushAgentOutbox(
      () => queue[0],
      async (c) => {
        sent.push(c);
      },
      (id) => {
        dequeued.push(id);
        queue.shift();
      }
    );

    expect(sent).toEqual(["first", "second"]);
    expect(dequeued).toEqual(["1", "2"]);
    expect(queue).toHaveLength(0);
  });

  it("stops at first failure, keeping the rest queued", async () => {
    const queue = [queued("1", "first"), queued("2", "second")];
    const dequeued: string[] = [];

    await expect(
      flushAgentOutbox(
        () => queue[0],
        async (c) => {
          if (c === "second") throw new Error("offline again");
        },
        (id) => {
          dequeued.push(id);
          queue.shift();
        }
      )
    ).rejects.toThrow("offline again");
    expect(dequeued).toEqual(["1"]);
    expect(queue).toHaveLength(1);
  });

  it("a repeated run after drain is a no-op (no double-send)", async () => {
    const queue = [queued("1", "only")];
    const sent: string[] = [];
    const takeNext = () => queue[0];
    const dequeue = (_id: string) => {
      queue.shift();
    };
    const send = async (c: string) => {
      sent.push(c);
    };

    await flushAgentOutbox(takeNext, send, dequeue);
    await flushAgentOutbox(takeNext, send, dequeue);

    expect(sent).toEqual(["only"]);
    expect(queue).toHaveLength(0);
  });

  it("no-ops on empty outbox", async () => {
    const send = vi.fn();
    const dequeue = vi.fn();
    await flushAgentOutbox(() => undefined, send, dequeue);
    expect(send).not.toHaveBeenCalled();
    expect(dequeue).not.toHaveBeenCalled();
  });
});
