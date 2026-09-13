import { describe, it, expect } from "vitest";
import {
  buildHistory,
  resolveFollowUp,
  type ConversationTurn,
} from "../agent-conversation";

function turn(role: "user" | "assistant", text: string): ConversationTurn {
  return { role, text };
}

describe("buildHistory", () => {
  it("maps store messages to turns", () => {
    const history = buildHistory([
      { id: "1", role: "user", content: "hola", timestamp: "" },
      { id: "2", role: "assistant", content: "hi", timestamp: "" },
    ]);
    expect(history).toEqual([
      { role: "user", text: "hola" },
      { role: "assistant", text: "hi" },
    ]);
  });

  it("keeps only the last N turns", () => {
    const messages = Array.from({ length: 10 }, (_, i) => ({
      id: `${i}`,
      role: (i % 2 === 0 ? "user" : "assistant") as "user" | "assistant",
      content: `m${i}`,
      timestamp: "",
    }));
    expect(buildHistory(messages, 4).map((t) => t.text)).toEqual([
      "m6",
      "m7",
      "m8",
      "m9",
    ]);
  });
});

describe("resolveFollowUp", () => {
  it("passes through with no history", () => {
    const res = resolveFollowUp("wait times?", []);
    expect(res).toEqual({ effectiveMessage: "wait times?", usedHistory: false });
  });

  it("attaches previous turn on pronoun signal", () => {
    const history = [
      turn("user", "compare San Ysidro crossings"),
      turn("assistant", "here is the comparison"),
    ];
    const res = resolveFollowUp("and what about that one?", history);
    expect(res.usedHistory).toBe(true);
    expect(res.effectiveMessage).toContain("compare San Ysidro crossings");
    expect(res.effectiveMessage).toContain("and what about that one?");
  });

  it("attaches previous turn on Spanish fragment", () => {
    const history = [turn("user", "tiempos de espera en Otay")];
    const res = resolveFollowUp("y los documentos?", history);
    expect(res.usedHistory).toBe(true);
    expect(res.effectiveMessage).toContain("tiempos de espera en Otay");
  });

  it("treats affirmation as acceptance of previous turn", () => {
    const history = [turn("user", "compare crossings")];
    const res = resolveFollowUp("yes", history);
    expect(res.usedHistory).toBe(true);
    expect(res.effectiveMessage).toContain("compare crossings");
  });

  it("treats Spanish affirmation the same", () => {
    const history = [turn("user", "cuéntame sobre SENTRI")];
    const res = resolveFollowUp("sí", history);
    expect(res.usedHistory).toBe(true);
  });

  it("passes through fresh intents untouched", () => {
    const history = [turn("user", "compare crossings")];
    const res = resolveFollowUp("what documents do I need?", history);
    expect(res.usedHistory).toBe(false);
    expect(res.effectiveMessage).toBe("what documents do I need?");
  });

  it("does not attach when repeating the same message", () => {
    const history = [turn("user", "wait times?")];
    const res = resolveFollowUp("wait times?", history);
    expect(res.usedHistory).toBe(false);
  });

  it("ignores assistant-only history (no user turn to inherit)", () => {
    const history = [turn("assistant", "hi there")];
    const res = resolveFollowUp("yes", history);
    expect(res.usedHistory).toBe(false);
  });
});
