import type { QueuedAgentMessage } from "@/stores/agent";

/**
 * P5 — Flush the offline outbox in FIFO order.
 *
 * Pulls the head of the queue on each iteration so concurrent or
 * repeated flush runs (e.g. React StrictMode double-effects) can never
 * double-send: a message is dequeued right after its send resolves, and
 * only on success. Stops at the first failure, leaving the rest queued.
 */
export async function flushAgentOutbox(
  takeNext: () => QueuedAgentMessage | undefined,
  send: (content: string) => Promise<unknown>,
  dequeue: (id: string) => void
): Promise<void> {
  for (;;) {
    const next = takeNext();
    if (!next) return;
    await send(next.content);
    dequeue(next.id);
  }
}
