import { describe, it, expect } from "vitest";
import {
  buildCrossingSharePayload,
  type CrossingShareInput,
} from "../crossing-share";

const base: CrossingShareInput = {
  id: "lukeville",
  name: "Lukeville",
  locale: "es",
  statusLabel: "Operativo",
  unknownStatusLabel: "Estado desconocido",
  northLabel: "Norte",
  southLabel: "Sur",
  waitNorthbound: 20,
  waitSouthbound: 14,
  freshnessText: "Hace 2 min",
  viewInLabel: "Ver en CRUZE",
};

describe("buildCrossingSharePayload", () => {
  it("full snapshot (es)", () => {
    const p = buildCrossingSharePayload(base);
    expect(p).toEqual({
      title: "Lukeville",
      text: [
        "Lukeville",
        "",
        "● Operativo",
        "Norte 20 min · Sur 14 min",
        "Hace 2 min",
        "",
        "Ver en CRUZE",
        "https://cruze.com.mx/es/crossing/lukeville",
      ].join("\n"),
      url: "https://cruze.com.mx/es/crossing/lukeville",
    });
  });

  it("unknown status renders explicit line, waits preserved", () => {
    const p = buildCrossingSharePayload({ ...base, statusLabel: null });
    expect(p.text).toContain("● Estado desconocido");
    expect(p.text).toContain("Norte 20 min · Sur 14 min");
  });

  it("missing southbound omits Sur line", () => {
    const p = buildCrossingSharePayload({ ...base, waitSouthbound: null });
    expect(p.text).toContain("Norte 20 min");
    expect(p.text).not.toContain("Sur");
  });

  it("missing both waits omits wait line, missing freshness omits it", () => {
    const p = buildCrossingSharePayload({
      ...base,
      waitNorthbound: null,
      waitSouthbound: null,
      freshnessText: null,
    });
    expect(p.text).not.toContain("Norte");
    expect(p.text).not.toContain("Hace");
    expect(p.text).toContain("Ver en CRUZE");
  });

  it("locale-aware URL", () => {
    const p = buildCrossingSharePayload({ ...base, locale: "en" });
    expect(p.url).toBe("https://cruze.com.mx/en/crossing/lukeville");
  });
});
