import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface AgentMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

interface AgentState {
  messages: AgentMessage[];
  addMessage: (role: "user" | "assistant", content: string) => void;
  clearHistory: () => void;
}

export const useAgentStore = create<AgentState>()(
  persist(
    (set) => ({
      messages: [],
      addMessage: (role, content) =>
        set((state) => ({
          messages: [
            ...state.messages,
            {
              id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
              role,
              content,
              timestamp: new Date().toISOString(),
            },
          ],
        })),
      clearHistory: () => set({ messages: [] }),
    }),
    {
      name: "cruze-agent",
    }
  )
);
