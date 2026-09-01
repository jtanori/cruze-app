"use client";

import Link from "next/link";
import type { ResponseContent, ResponseCard, ResponseChecklistItem, ResponseDataRow } from "@/lib/agent-templates";

interface RichResponseProps {
  content: ResponseContent;
}

export function RichResponse({ content }: RichResponseProps) {
  return (
    <div className="space-y-3">
      <p className="text-ink text-sm leading-relaxed whitespace-pre-line">
        {content.text}
      </p>

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
        </div>
      )}

      {content.checklist && content.checklist.length > 0 && (
        <div className="bg-surface rounded-[var(--radius-md)] border border-border p-3 space-y-2">
          {content.checklist.map((item, i) => (
            <ChecklistItem key={i} item={item} />
          ))}
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
