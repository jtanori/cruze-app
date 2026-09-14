import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { AgentChat } from "../AgentChat";
import { useAgentStore } from "@/stores/agent";
import enMessages from "@/i18n/messages/en.json";

const processMessageMock = vi.fn(async () => ({ text: "ok" }));

vi.mock("../AgentProvider", () => ({
  useAgent: () => ({ processMessage: processMessageMock }),
}));

vi.mock("@/components/location/LocationProvider", () => ({
  useLocationContext: () => ({ location: null }),
}));

vi.mock("@/lib/network-status", () => ({
  useNetworkStatus: () => ({ online: true }),
}));

function renderChat() {
  return render(
    <NextIntlClientProvider locale="en" messages={enMessages}>
      <AgentChat />
    </NextIntlClientProvider>
  );
}

describe("AgentChat help guide", () => {
  beforeEach(() => {
    useAgentStore.getState().clearHistory();
    useAgentStore.getState().clearOutbox();
    processMessageMock.mockClear();
    // jsdom has no scrollIntoView; AgentChat scrolls on new messages.
    window.HTMLElement.prototype.scrollIntoView = vi.fn();
  });

  it("toggles the guide panel from the help button", () => {
    renderChat();
    expect(screen.queryByText("What can I ask?")).toBeNull();
    fireEvent.click(screen.getByLabelText("What can I ask?"));
    expect(screen.getByText("What can I ask?")).toBeTruthy();
    fireEvent.click(screen.getByLabelText("What can I ask?"));
    expect(screen.queryByText("What can I ask?")).toBeNull();
  });

  it("sends the tapped example and closes the guide", () => {
    // Seed history so the welcome-screen duplicates of these prompts stay hidden.
    useAgentStore.getState().addMessage("user", "hola");
    renderChat();
    fireEvent.click(screen.getByLabelText("What can I ask?"));
    fireEvent.click(screen.getByText("What are the current wait times?"));
    expect(processMessageMock).toHaveBeenCalledTimes(1);
    expect((processMessageMock.mock.calls[0] as string[])[0]).toBe(
      "What are the current wait times?"
    );
    expect(screen.queryByText("What can I ask?")).toBeNull();
  });
});
