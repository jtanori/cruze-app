"use client";

import { useState } from "react";
import Link from "next/link";
import { Copy, Share2, Download, Bookmark, ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ResponseContent, ResponseCard, ResponseChecklistItem, ResponseDataRow } from "@/lib/agent-templates";

interface RichResponseProps {
  content: ResponseContent;
  onSuggestion?: (suggestion: string) => void;
}

export function RichResponse({ content, onSuggestion }: RichResponseProps) {
  const t = useTranslations();

  return (
    <div className="space-y-3">
      {content.text && (
        <div>
          <p className="text-ink text-sm leading-relaxed whitespace-pre-line">
            {content.text}
          </p>
          <SectionActions content={content.text} />
        </div>
      )}

      {content.cards && content.cards.length > 0 && (
        <div className="space-y-2">
          {content.cards.map((card, i) => (
            <Card key={i} card={card} />
          ))}
        </div>
      )}

      {content.dataRows && content.dataRows.length > 0 && (
        <div className="bg-surface rounded-[var(--radius-md)] border border-border p-3 space-y-2">
          {content.dataRows.map((row, i) => (
            <DataRow key={i} row={row} isLast={i === content.dataRows!.length - 1} />
          ))}
          <SectionActions content={formatDataRows(content.dataRows)} />
        </div>
      )}

      {content.checklist && content.checklist.length > 0 && (
        <div className="bg-surface rounded-[var(--radius-md)] border border-border p-3 space-y-2">
          {content.checklist.map((item, i) => (
            <ChecklistItem key={i} item={item} />
          ))}
          <SectionActions content={formatChecklist(content.checklist)} />
        </div>
      )}

      {content.action && (
        <Link
          href={content.action.href}
          className="inline-flex items-center gap-1 text-cruze-green text-sm font-medium hover:underline"
        >
          {content.action.label}
          <span className="text-xs">→</span>
        </Link>
      )}

      {content.suggestions && content.suggestions.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {content.suggestions.map((suggestion, i) => (
            <button
              key={i}
              onClick={() => onSuggestion?.(suggestion)}
              className="px-3 py-1.5 text-xs font-medium text-cruze-green bg-cruze-green/10 border border-cruze-green/30 rounded-full hover:bg-cruze-green/20 transition-colors"
            >
              <ArrowRight className="w-3 h-3 inline mr-1" />
              {suggestion}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function formatDataRows(rows: ResponseDataRow[]): string {
  return rows.map(r => `${r.label}: ${r.value}`).join("\n");
}

function formatChecklist(items: ResponseChecklistItem[]): string {
  return items.map(i => `${i.checked ? "✓" : "☐"} ${i.label}${i.required ? " *" : ""}`).join("\n");
}

function SectionActions({ content }: { content: string }) {
  const [copied, setCopied] = useState(false);
  
  const handleCopy = async () => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ text: content });
    } else {
      await handleCopy();
    }
  };

  const handleSave = () => {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "cruze-response.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex items-center gap-1 mt-2 pt-2 border-t border-border-subtle">
      <button onClick={handleCopy} className="p-1.5 rounded text-faint hover:text-ink hover:bg-surface-elevated transition-colors" aria-label="Copy">
        <Copy className="w-4 h-4" />
      </button>
      <button onClick={handleShare} className="p-1.5 rounded text-faint hover:text-ink hover:bg-surface-elevated transition-colors" aria-label="Share">
        <Share2 className="w-4 h-4" />
      </button>
      <button onClick={handleSave} className="p-1.5 rounded text-faint hover:text-ink hover:bg-surface-elevated transition-colors" aria-label="Save">
        <Download className="w-4 h-4" />
      </button>
      <button className="p-1.5 rounded text-faint hover:text-ink hover:bg-surface-elevated transition-colors ml-auto" aria-label="Bookmark">
        <Bookmark className="w-4 h-4" />
      </button>
      {copied && <span className="text-xs text-cruze-green ml-2">Copied!</span>}
    </div>
  );
}

function Card({ card }: { card: ResponseCard }) {
  const statusColors = {
    open: "border-improving/30 bg-improving/5",
    limited: "border-caution/30 bg-caution/5",
    closed: "border-critical/30 bg-critical/5",
    neutral: "border-border bg-surface",
  };

  return (
    <div className={`rounded-[var(--radius-md)] border p-3 ${statusColors[card.status || "neutral"]}`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-ink text-sm font-medium">{card.title}</p>
          {card.subtitle && (
            <p className="text-faint text-xs mt-0.5">{card.subtitle}</p>
          )}
        </div>
        {card.value && (
          <div className="text-right">
            <span className="text-ink text-lg font-semibold tabular">{card.value}</span>
            {card.unit && (
              <span className="text-faint text-xs ml-1">{card.unit}</span>
            )}
          </div>
        )}
      </div>
      {card.detail && (
        <p className="text-faint text-xs mt-2">{card.detail}</p>
      )}
    </div>
  );
}

function DataRow({ row, isLast }: { row: ResponseDataRow; isLast: boolean }) {
  return (
    <div className={`flex items-center justify-between ${!isLast ? "pb-2 border-border-subtle" : ""}`}>
      <span className="text-ink text-sm">{row.label}</span>
      <span className={`text-sm font-medium tabular ${row.highlight ? "text-cruze-green" : "text-ink"}`}>
        {row.value}
      </span>
    </div>
  );
}

function ChecklistItem({ item }: { item: ResponseChecklistItem }) {
  return (
    <div className="flex items-start gap-2">
      <div className={`w-4 h-4 mt-0.5 rounded border flex-shrink-0 flex items-center justify-center ${
        item.checked
          ? "bg-cruze-green border-cruze-green"
          : "border-border"
      }`}>
        {item.checked && (
          <svg className="w-2.5 h-2.5 text-background" viewBox="0 0 12 12" fill="none">
            <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <div className="flex-1">
        <span className="text-ink text-sm">{item.label}</span>
        {item.required && (
          <span className="text-critical text-xs ml-1">*</span>
        )}
      </div>
    </div>
  );
}
