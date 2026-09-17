import { describe, it, expect, vi, beforeEach, type Mock } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AvisosView } from "../AvisosView";
import type { Aviso } from "@/lib/avisos";
import enMessages from "@/i18n/messages/en.json";

function makeAviso(id: string, overrides: Partial<Aviso> = {}): Aviso {
  return {
    id,
    type: "wait_surge",
    severity: "warning",
    title: `Surge ${id}`,
    description: `Wait rose ${id}`,
    crossingId: "san-ysidro",
    crossingName: "San Ysidro",
    timestamp: new Date().toISOString(),
    read: false,
    dismissed: false,
    ...overrides,
  };
}

const AVISOS = [makeAviso("a1"), makeAviso("a2")];

interface ViewHandlers {
  avisos: Aviso[];
  selectedId: string | null;
  onSelect: Mock<(aviso: Aviso) => void>;
  onBack: Mock<() => void>;
  onAskAgent: Mock<(aviso: Aviso) => void>;
  onViewRecommendation: Mock<(aviso: Aviso) => void>;
}

function renderView(props: Partial<ViewHandlers> = {}) {
  const handlers: ViewHandlers = {
    avisos: AVISOS,
    selectedId: null,
    onSelect: vi.fn(),
    onBack: vi.fn(),
    onAskAgent: vi.fn(),
    onViewRecommendation: vi.fn(),
    ...props,
  };
  render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <AvisosView {...handlers} />
    </NextIntlClientProvider>
  );
  return handlers;
}

describe("AvisosView", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("lists avisos when none selected", () => {
    renderView();
    expect(screen.getByText("Surge a1")).toBeTruthy();
    expect(screen.getByText("Surge a2")).toBeTruthy();
  });

  it("shows empty state with no avisos", () => {
    renderView({ avisos: [] });
    expect(screen.getByText("No changes — the border is steady")).toBeTruthy();
  });

  it("selects a row on click", () => {
    const handlers = renderView();
    fireEvent.click(screen.getByText("Surge a1"));
    expect(handlers.onSelect).toHaveBeenCalledTimes(1);
    expect(handlers.onSelect.mock.calls[0][0].id).toBe("a1");
  });

  it("renders detail with actions when selected", () => {
    const handlers = renderView({ selectedId: "a1" });
    // Detail view replaces the list
    expect(screen.queryByText("Surge a2")).toBeNull();
    fireEvent.click(screen.getByText("Ask Agent"));
    expect(handlers.onAskAgent).toHaveBeenCalledWith(
      expect.objectContaining({ id: "a1" })
    );
    fireEvent.click(screen.getByText("View recommendation"));
    expect(handlers.onViewRecommendation).toHaveBeenCalledWith(
      expect.objectContaining({ id: "a1" })
    );
  });

  it("goes back to the list", () => {
    const handlers = renderView({ selectedId: "a1" });
    fireEvent.click(screen.getByText(/Back/));
    expect(handlers.onBack).toHaveBeenCalledTimes(1);
  });

  it("renders nothing_detail-safe when selected id is stale", () => {
    renderView({ selectedId: "gone" });
    expect(screen.getByText("Surge a1")).toBeTruthy();
  });
});
