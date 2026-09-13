import { describe, it, expect } from "vitest";
import {
  classifyIntent,
  extractCrossingMention,
  extractDirection,
} from "../intent-classifier";

const CROSSINGS = [
  { id: "san-ysidro", name: "San Ysidro", mexicanCity: "Tijuana", usCity: "San Diego" },
  { id: "otay-mesa", name: "Otay Mesa", mexicanCity: "Tijuana", usCity: "San Diego" },
];

describe("classifyIntent — core bands", () => {
  it.each([
    ["how long is the wait?", "wait_times"],
    ["cuánto tarda la fila?", "wait_times"],
    ["waiting time in minutes?", "wait_times"],
    // KNOWN LIMIT: "hours" matches wait_times' `hours?` pattern first,
    // so English hours queries route to wait_times. Spanish "horario" is unambiguous.
    ["what are the hours?", "wait_times"],
    ["¿cuál es el horario?", "hours"],
    ["what documents do I need?", "documents"],
    ["¿qué necesito para cruzar?", "documents"],
    ["how do I get SENTRI?", "sentry"],
    ["compare crossings", "compare"],
    ["¿cuál es mejor?", "compare"],
    ["can I bring food?", "rules"],
    ["¿puedo llevar comida?", "rules"],
    ["hello", "greeting"],
    ["hola, ¿qué puedes hacer?", "greeting"],
    // KNOWN LIMIT: "happening"/"pasando" match the earlier status rule,
    // so these route to status (whose suggestions still offer whatsHappening).
    ["what's happening now?", "status"],
    ["¿qué está pasando?", "status"],
  ])("classifies %p as %p", (message, expected) => {
    expect(classifyIntent(message)).toBe(expected);
  });
});

describe("classifyIntent — whatshappening reachability", () => {
  it("reaches whatshappening via unambiguous triggers", () => {
    expect(classifyIntent("any alerts?")).toBe("whatshappening");
    expect(classifyIntent("breaking news at the border")).toBe("whatshappening");
    expect(classifyIntent("¿hay noticias?")).toBe("whatshappening");
  });
});

describe("classifyIntent — direction band", () => {
  it.each([
    ["directions to San Ysidro", "direction"],
    ["direction to Otay Mesa", "direction"],
    ["¿direcciones a San Ysidro?", "direction"],
    ["voy a Tijuana", "direction"],
    ["going to Mexico", "direction"],
    ["north or south?", "direction"],
  ])("classifies %p as %p", (message, expected) => {
    expect(classifyIntent(message)).toBe(expected);
  });
});

describe("classifyIntent — rule priority (first match wins)", () => {
  it("prefers hours over status for open/closed", () => {
    // "open" appears in both hours and status rules; hours is earlier
    expect(classifyIntent("is the crossing open?")).toBe("hours");
  });

  it("prefers status over whatshappening for 'qué pasa'", () => {
    // "qué pasa" matches status (earlier) before whatshappening
    expect(classifyIntent("qué pasa ahora?")).toBe("status");
  });

  it("prefers wait_times for minutes mention", () => {
    expect(classifyIntent("30 min wait, is that normal?")).toBe("wait_times");
  });
});

describe("classifyIntent — fallbacks and boundaries", () => {
  it("returns general for empty and whitespace", () => {
    expect(classifyIntent("")).toBe("general");
    expect(classifyIntent("   ")).toBe("general");
  });

  it("returns general for unmatched text", () => {
    expect(classifyIntent("tell me a joke about borders")).toBe("general");
  });

  it("does not match word fragments (they ≠ hey)", () => {
    expect(classifyIntent("they crossed yesterday")).toBe("general");
  });

  it("is case-insensitive", () => {
    expect(classifyIntent("WAIT TIMES PLEASE")).toBe("wait_times");
    expect(classifyIntent("¿DÓNDE QUEDA SENTRI?")).toBe("sentry");
  });

  it("trims surrounding whitespace", () => {
    expect(classifyIntent("  hola  ")).toBe("greeting");
  });
});

describe("extractCrossingMention", () => {
  it("matches by crossing name case-insensitively", () => {
    expect(extractCrossingMention("wait at SAN YSIDRO?", CROSSINGS)).toBe("san-ysidro");
  });

  it("matches by mexican city", () => {
    expect(extractCrossingMention("cruces en Tijuana", CROSSINGS)).toBe("san-ysidro");
  });

  it("matches by us city", () => {
    expect(extractCrossingMention("near San Diego", CROSSINGS)).toBe("san-ysidro");
  });

  it("returns null when no crossing mentioned", () => {
    expect(extractCrossingMention("what documents do I need?", CROSSINGS)).toBeNull();
  });

  it("returns first match on ambiguous city", () => {
    expect(extractCrossingMention("Tijuana crossings", CROSSINGS)).toBe("san-ysidro");
  });
});

describe("extractDirection", () => {
  it("detects MX_TO_US", () => {
    expect(extractDirection("going to USA tomorrow")).toBe("MX_TO_US");
    expect(extractDirection("cruce northbound")).toBe("MX_TO_US");
  });

  it("detects US_TO_MX", () => {
    expect(extractDirection("driving to Mexico")).toBe("US_TO_MX");
    expect(extractDirection("southbound lanes")).toBe("US_TO_MX");
  });

  it("returns null when no direction", () => {
    expect(extractDirection("what is the wait time?")).toBeNull();
  });
});
