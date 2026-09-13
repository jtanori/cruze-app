import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ResponseContent } from "@/lib/agent-templates";

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  richContent?: ResponseContent;
  timestamp: string;
}

export interface AgentCrossingContext {
  crossingId: string;
  crossingName: string;
}

export interface QueuedAgentMessage {
  id: string;
  content: string;
  timestamp: string;
}

interface AgentState {
  messages: AgentMessage[];
  addMessage: (role: "user" | "assistant", content: string, richContent?: ResponseContent) => void;
  clearHistory: () => void;
  /**
   * P5 — offline outbox. User messages composed while offline are queued
   * here (visible immediately in thread) and flushed in order on reconnect.
   * Persisted so a reload while offline never loses drafts.
   */
  outbox: QueuedAgentMessage[];
  enqueueOutbox: (content: string) => QueuedAgentMessage;
  dequeueOutbox: (id: string) => void;
  clearOutbox: () => void;
  /**
   * One-shot navigation handoff (C03 → Agent). Ephemeral by design:
   * excluded from persistence so a direct Agent launch can never
   * inherit a stale crossing context. Consume-and-clear on read.
   */
  pendingContext: AgentCrossingContext | null;
  setPendingContext: (ctx: AgentCrossingContext) => void;
  clearPendingContext: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (role, content, richContent) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              role,
              content,
              richContent,
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      clearHistory: () => set({ messages: [] }),
      outbox: [],
      enqueueOutbox: (content) => {
        const queued: QueuedAgentMessage = {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
          content,
          timestamp: new Date().toISOString(),
        };
        set((state) => ({ outbox: [...state.outbox, queued] }));
        return queued;
      },
      dequeueOutbox: (id) =>
        set((state) => ({ outbox: state.outbox.filter((q) => q.id !== id) })),
      clearOutbox: () => set({ outbox: [] }),
      pendingContext: null,
      setPendingContext: (ctx) => set({ pendingContext: ctx }),
      clearPendingContext: () => set({ pendingContext: null }),
    }),
    {
      name: "cruze-agent",
      partialize: (state) => ({ messages: state.messages, outbox: state.outbox }),
    }
  )
);
