import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { RichResponse } from "../RichResponse";
import type { ResponseContent } from "@/lib/agent-templates";
import enMessages from "@/i18n/messages/en.json";

const CONTENT: ResponseContent = {
  text: "Top crossings:",
  dataRows: [{ label: "San Ysidro", value: "30 min", highlight: true }],
  suggestions: ["Compare with other crossings", "Get directions"],
};

function renderRich(
  content: ResponseContent,
  onSuggestion?: (suggestion: string) => void
) {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <RichResponse content={content} onSuggestion={onSuggestion} />
    </NextIntlClientProvider>
  );
}

describe("RichResponse suggestions", () => {
  it("renders suggestion chips", () => {
    renderRich(CONTENT);
    expect(screen.getByText("Compare with other crossings")).toBeTruthy();
    expect(screen.getByText("Get directions")).toBeTruthy();
  });

  it("calls onSuggestion with chip text on click", () => {
    const onSuggestion = vi.fn();
    renderRich(CONTENT, onSuggestion);
    fireEvent.click(screen.getByText("Get directions"));
    expect(onSuggestion).toHaveBeenCalledTimes(1);
    expect(onSuggestion).toHaveBeenCalledWith("Get directions");
  });

  it("renders without crashing when no handler is attached", () => {
    renderRich(CONTENT);
    fireEvent.click(screen.getByText("Compare with other crossings"));
  });

  it("omits the chip row with no suggestions", () => {
    const { container } = renderRich({ text: "plain answer" });
    // Suggestion chips use rounded-full; copy/share/save buttons do not.
    expect(container.querySelector("button.rounded-full")).toBeNull();
  });

  it("links cards with a crossing id to crossing detail", () => {
    const { container } = renderRich({
      text: "Pick one:",
      cards: [{ id: "san-ysidro", title: "San Ysidro", value: "30 min" }],
    });
    const link = container.querySelector('a[href="/crossing/san-ysidro"]');
    expect(link).not.toBeNull();
    expect(link!.textContent).toContain("San Ysidro");
  });

  it("renders id-less cards as plain divs", () => {
    const { container } = renderRich({
      text: "Note:",
      cards: [{ title: "Most common", value: "San Ysidro" }],
    });
    expect(container.querySelector("a")).toBeNull();
  });
});
