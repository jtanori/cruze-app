"use client";

import { Bot } from "lucide-react";

interface AgentWelcomeScreenProps {
  onPrompt: (prompt: string) => void;
  contextPrompts?: string[];
}

const DEFAULT_PROMPTS = [
  "\u00BFQu\u00E9 cruces est\u00E1n disponibles?",
  "\u00BFCu\u00E1l me conviene m\u00E1s?",
  "Revisa mi viaje",
  "\u00BFQu\u00E9 debo revisar antes de cruzar?",
];

export function AgentWelcomeScreen({ onPrompt, contextPrompts }: AgentWelcomeScreenProps) {
  const prompts = contextPrompts ?? DEFAULT_PROMPTS;

  return (
    <div className="flex flex-col items-center justify-center py-8 sm:py-12 px-4 sm:px-6 text-center space-y-4 sm:space-y-6">
      <div className="w-16 h-16 rounded-full bg-cruze-mint/10 flex items-center justify-center">
        <Bot className="w-8 h-8 text-cruze-mint" />
      </div>
      <div>
        <h2 className="text-ink text-lg font-semibold">Hola. Soy Cruze.</h2>
        <p className="text-faint text-sm mt-1">Puedo ayudarte a entender la frontera, comparar cruces o revisar tu viaje.</p>
      </div>
      <div className="w-full space-y-2">
        {prompts.map((p) => (
          <button
            key={p}
            onClick={() => onPrompt(p)}
            className="w-full px-4 py-3 text-left bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm hover:border-cruze-mint/30 transition-colors"
          >
            {p}
          </button>
        ))}
      </div>
    </div>
  );
}
