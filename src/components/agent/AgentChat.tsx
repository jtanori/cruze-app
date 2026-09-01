"use client";

import { useState, useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Send, Bot, User } from "lucide-react";
import { useAgentStore, type AgentMessage } from "@/stores/agent";
import { useAgent } from "./AgentProvider";
import { RichResponse } from "./RichResponse";
import { TypingIndicator } from "./TypingIndicator";
import type { ResponseContent } from "@/lib/agent-templates";

const SUGGESTED_PROMPTS = [
  "agent.suggest.crossings",
  "agent.suggest.sentry",
  "agent.suggest.waitTimes",
  "agent.suggest.configureTrip",
];

export function AgentChat() {
  const t = useTranslations();
  const { messages, addMessage } = useAgentStore();
  const { processMessage, loading: agentLoading } = useAgent();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [pendingResponse, setPendingResponse] = useState<ResponseContent | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing]);

  const handleSend = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    addMessage("user", content.trim());
    setInput("");
    setIsProcessing(true);
    setPendingResponse(null);

    try {
      const response = await processMessage(content.trim());
      setPendingResponse(response);
    } catch {
      addMessage("assistant", "Sorry, I encountered an error. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestionKey: string) => {
    handleSend(t(suggestionKey));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100dvh-var(--nav-header-height)-var(--nav-bottom-height))]">
      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {messages.length === 0 && !isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cruze-green/10">
              <Bot className="w-8 h-8 text-cruze-green" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-ink text-lg font-semibold">{t("agent.welcome")}</h2>
              <p className="text-faint text-sm max-w-[280px]">{t("agent.welcomeDescription")}</p>
            </div>

            {/* Suggested prompts */}
            <div className="w-full max-w-sm space-y-2">
              {SUGGESTED_PROMPTS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleSuggestionClick(key)}
                  className="w-full px-4 py-3 text-left bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm active:bg-surface-subtle transition-colors"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg) => (
              <MessageBubble key={msg.id} message={msg} />
            ))}
            {isProcessing && <TypingIndicator />}
            {pendingResponse && !isProcessing && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 bg-cruze-green/10">
                    <Bot className="w-4 h-4 text-cruze-green" />
                  </div>
                  <div className="px-4 py-3 rounded-[var(--radius-lg)] rounded-tl-sm bg-surface border border-border text-ink text-sm">
                    <RichResponse content={pendingResponse} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* Input bar */}
      <div className="px-5 py-3 border-t border-border bg-surface-elevated">
        <div className="flex items-center gap-2">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={t("agent.placeholder")}
            disabled={isProcessing}
            className="flex-1 h-12 px-4 bg-surface border border-border rounded-[var(--radius-md)] text-ink text-sm placeholder:text-faint focus:outline-none focus:border-cruze-green disabled:opacity-50"
          />
          <button
            onClick={() => handleSend(input)}
            disabled={!input.trim() || isProcessing}
            className="w-12 h-12 flex items-center justify-center rounded-[var(--radius-md)] bg-cruze-green text-dark disabled:opacity-40 active:bg-cruze-green/90 transition-colors"
            aria-label={t("agent.send")}
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

function MessageBubble({ message }: { message: AgentMessage }) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start gap-2 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
        {/* Avatar */}
        <div
          className={`w-8 h-8 flex items-center justify-center rounded-full shrink-0 ${
            isUser ? "bg-surface-raised" : "bg-cruze-green/10"
          }`}
        >
          {isUser ? (
            <User className="w-4 h-4 text-ink" />
          ) : (
            <Bot className="w-4 h-4 text-cruze-green" />
          )}
        </div>

        {/* Bubble */}
        <div
          className={`px-4 py-3 rounded-[var(--radius-lg)] text-sm ${
            isUser
              ? "bg-cruze-green text-dark rounded-tr-sm"
              : "bg-surface border border-border text-ink rounded-tl-sm"
          }`}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}
