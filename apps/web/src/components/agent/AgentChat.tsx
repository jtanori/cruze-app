"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Send, Bot, User, HelpCircle } from "lucide-react";
import { useAgentStore, type AgentMessage } from "@/stores/agent";
import { useAgent } from "./AgentProvider";
import { RichResponse } from "./RichResponse";
import { TypingIndicator } from "./TypingIndicator";
import { useNetworkStatus } from "@/lib/network-status";
import { flushAgentOutbox } from "@/lib/agent-outbox";

const SUGGESTED_PROMPTS = [
  "agent.suggest.crossings",
  "agent.suggest.sentry",
  "agent.suggest.waitTimes",
  "agent.suggest.configureTrip",
];

function MessageBubble({
  message,
  onSuggestion,
}: {
  message: AgentMessage;
  onSuggestion?: (suggestion: string) => void;
}) {
  const isUser = message.role === "user";

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex items-start gap-2 max-w-[85%] ${
          isUser ? "flex-row-reverse" : "flex-row"
        }`}
      >
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

        <div
          className={`px-4 py-3 rounded-[var(--radius-lg)] text-sm ${
            isUser
              ? "bg-cruze-green text-dark rounded-tr-sm"
              : "bg-surface border border-border text-ink rounded-tl-sm"
          }`}
        >
          {isUser || !message.richContent ? (
            message.content
          ) : (
            // richContent.text already carries the body — rendering both
            // message.content and RichResponse duplicated the answer.
            <RichResponse content={message.richContent} onSuggestion={onSuggestion} />
          )}
        </div>
      </div>
    </div>
  );
}

export function AgentChat() {
  const t = useTranslations();
  const { messages, addMessage } = useAgentStore();
  const outboxCount = useAgentStore((s) => s.outbox.length);
  const pendingConsumed = useRef(false);
  const flushingRef = useRef(false);
  const { processMessage } = useAgent();
  const { online } = useNetworkStatus();
  const [input, setInput] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [streamingContent, setStreamingContent] = useState<string | null>(null);
  const [showGuide, setShowGuide] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  const handleSend = async (content: string) => {
    if (!content.trim() || isProcessing) return;

    const trimmed = content.trim();
    setInput("");

    // P5: offline → echo immediately, queue for flush on reconnect
    if (!online) {
      addMessage("user", trimmed);
      useAgentStore.getState().enqueueOutbox(trimmed);
      return;
    }

    setIsProcessing(true);
    setStreamingContent("");

    try {
      const response = await processMessage(trimmed);
      
      // Simulate streaming effect for better UX
      if (response.text) {
        const words = response.text.split(" ");
        let currentText = "";
        for (const word of words) {
          currentText += (currentText ? " " : "") + word;
          setStreamingContent(currentText);
          await new Promise(r => setTimeout(r, 30));
        }
      }
      setStreamingContent(null);
    } catch {
      addMessage("assistant", t("agent.errorState"));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSend(suggestion);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend(input);
    }
  };

  // One-shot C03 handoff: consume pending crossing context once, then clear.
  // Direct launches (no context) render the default welcome — never stale.
  useEffect(() => {
    if (pendingConsumed.current) return;
    const ctx = useAgentStore.getState().pendingContext;
    if (!ctx) return;
    pendingConsumed.current = true;
    addMessage("assistant", t("agent.askingAbout", { name: ctx.crossingName }));
    useAgentStore.getState().clearPendingContext();
  }, [t, addMessage]);

  // P5: flush queued messages in order when back online.
  // flushingRef + pull-based drain make StrictMode double-effects safe.
  useEffect(() => {
    if (!online || flushingRef.current) return;
    if (useAgentStore.getState().outbox.length === 0) return;
    flushingRef.current = true;
    setIsProcessing(true);
    flushAgentOutbox(
      () => useAgentStore.getState().outbox[0],
      (c) => processMessage(c, { echoUser: false }),
      (id) => useAgentStore.getState().dequeueOutbox(id)
    )
      .catch(() => {
        // Send failed (offline again) — failure stays queued for next reconnect.
      })
      .finally(() => {
        flushingRef.current = false;
        setIsProcessing(false);
      });
  }, [online, outboxCount, processMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isProcessing, scrollToBottom]);

  return (
    <div className="flex flex-col h-[calc(100dvh-var(--nav-header-height)-var(--nav-bottom-height))]">
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 pb-24">
        {messages.length === 0 && !isProcessing ? (
          <div className="flex flex-col items-center justify-center h-full space-y-4 sm:space-y-6">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-cruze-green/10">
              <Bot className="w-8 h-8 text-cruze-green" />
            </div>
            <div className="text-center space-y-2">
              <h2 className="text-ink text-lg font-semibold">{t("agent.welcome")}</h2>
              <p className="text-faint text-sm max-w-[280px]">{t("agent.welcomeDescription")}</p>
            </div>

            <div className="w-full space-y-2">
              {SUGGESTED_PROMPTS.map((key) => (
                <button
                  key={key}
                  onClick={() => handleSuggestionClick(t(key))}
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
              <MessageBubble key={msg.id} message={msg} onSuggestion={handleSend} />
            ))}
            {isProcessing && streamingContent && (
              <div className="flex justify-start">
                <div className="flex items-start gap-2 max-w-[85%]">
                  <div className="w-8 h-8 flex items-center justify-center rounded-full shrink-0 bg-cruze-green/10">
                    <Bot className="w-4 h-4 text-cruze-green" />
                  </div>
                  <div className="px-4 py-3 rounded-[var(--radius-lg)] rounded-tl-sm bg-surface border border-border text-ink text-sm">
                    {streamingContent}
                    <span className="inline-block w-2 h-4 animate-pulse bg-cruze-green ml-1" />
                  </div>
                </div>
              </div>
            )}
            {isProcessing && !streamingContent && <TypingIndicator />}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      <div className="fixed bottom-[var(--nav-bottom-height)] left-0 right-0 z-[var(--z-overlay)]">
        <div className="px-5 py-3 border-t border-border bg-surface-elevated bg-opacity-95 backdrop-blur-sm">
          {outboxCount > 0 && (
            <p className="text-faint text-xs mb-2 text-center" role="status">
              {t("agent.queuedOffline", { count: outboxCount })}
            </p>
          )}
          {showGuide && (
            <div className="mb-2 p-4 bg-surface border border-border rounded-[var(--radius-md)] space-y-3">
              <p className="text-ink text-sm font-semibold">{t("agent.guide.title")}</p>
              <p className="text-faint text-xs leading-relaxed whitespace-pre-line">
                {t("agent.guide.body")}
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTED_PROMPTS.map((key) => (
                  <button
                    key={key}
                    onClick={() => {
                      setShowGuide(false);
                      handleSend(t(key));
                    }}
                    className="px-3 py-1.5 text-xs font-medium text-cruze-green bg-cruze-green/10 border border-cruze-green/30 rounded-full hover:bg-cruze-green/20 transition-colors"
                  >
                    {t(key)}
                  </button>
                ))}
              </div>
            </div>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowGuide((v) => !v)}
              className="w-12 h-12 shrink-0 flex items-center justify-center rounded-[var(--radius-md)] border border-border text-faint hover:text-ink active:bg-surface-subtle transition-colors"
              aria-label={t("agent.guide.title")}
            >
              <HelpCircle className="w-5 h-5" />
            </button>
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (!input.trim() || isProcessing) return;
                  handleSend(input);
                }
              }}
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
    </div>
  );
}