import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { NextIntlClientProvider } from "next-intl";
import { CrossingDetailHero } from "../CrossingDetailHero";
import { CrossingDetailLaneSection } from "../CrossingDetailLaneSection";
import { DataTimestamp } from "../../primitives/DataTimestamp";
import esMessages from "@/i18n/messages/es.json";

describe("C03 hero — waits survive unknown status", () => {
  it("renders both waits + Desconocido without timestamp", () => {
    const { container } = render(
      <CrossingDetailHero
        crossingName="Lukeville"
        status="unknown"
        waitTime={20}
        direction="both"
        secondaryWaitTime={14}
      />
    );
    const text = container.textContent ?? "";
    expect(text).toContain("Lukeville");
    expect(text).toContain("Desconocido");
    expect(text).toContain("20 min");
    expect(text).toContain("14 min");
    expect(text).not.toMatch(/datos/i);
  });
});

describe("C03 lanes — category qualifier disambiguates", () => {
  it("no two rows share identical labels", () => {
    const { container } = render(
      <NextIntlClientProvider locale="es" messages={esMessages}>
        <CrossingDetailLaneSection
          lanes={[
            { type: "Standard", waitTime: 20, category: "passenger" },
            { type: "Ready Lane", waitTime: 20, category: "passenger" },
            { type: "Standard", waitTime: 0, category: "commercial" },
          ]}
        />
      </NextIntlClientProvider>
    );
    const text = container.textContent ?? "";
    expect(text).toContain("Vehículo");
    expect(text).toContain("Comercial");
    // Full row labels are unique even though "Standard" repeats.
    expect(text).toContain("Standard · Vehículo");
    expect(text).toContain("Standard · Comercial");
  });
});

describe("C03 hero — country-pair direction labels", () => {
  it("marks the south slot estimated when flagged", () => {
    const { container } = render(
      <CrossingDetailHero
        crossingName="San Luis"
        status="operational"
        waitTime={45}
        direction="both"
        secondaryWaitTime={32}
        secondaryEstimated
        secondaryEstimatedLabel="US → MX · est."
      />
    );
    const text = container.textContent ?? "";
    expect(text).toContain("MX → US");
    expect(text).toContain("US → MX · est.");
  });

  it("labels plain country pairs without the flag", () => {
    const { container } = render(
      <CrossingDetailHero
        crossingName="San Luis"
        status="operational"
        waitTime={45}
        direction="both"
        secondaryWaitTime={32}
      />
    );
    expect(container.textContent ?? "").toContain("MX → US");
    expect(container.textContent ?? "").toContain("US → MX");
    expect(container.textContent ?? "").not.toContain("est.");
  });

  it("single-direction mode shows the travel pair, never bare Norte/Sur", () => {
    const { container } = render(
      <CrossingDetailHero
        crossingName="San Luis"
        status="operational"
        waitTime={45}
        direction="northbound"
      />
    );
    const text = container.textContent ?? "";
    expect(text).toContain("MX → US");
    expect(text).not.toMatch(/Norte/);
  });
});

describe("C03 lanes — empty state explains why", () => {
  it("shows empty notice with reason", () => {
    const { container } = render(
      <NextIntlClientProvider locale="es" messages={esMessages}>
        <CrossingDetailLaneSection lanes={[]} emptyNote="Solo norte" />
      </NextIntlClientProvider>
    );
    expect(container.textContent ?? "").toContain("No hay datos de carriles");
    expect(container.textContent ?? "").toContain("Solo norte");
  });
});

describe("DataTimestamp — normalized vocabulary", () => {
  it("live → Ahora, recent → Hace X, stale → label, unavailable → Sin datos", () => {
    const now = Date.now();
    const { container, rerender } = render(
      <DataTimestamp timestamp={new Date(now - 30_000).toISOString()} />
    );
    expect(container.textContent ?? "").toContain("Ahora");
    expect(container.textContent ?? "").not.toMatch(/en vivo/i);

    rerender(<DataTimestamp timestamp={new Date(now - 5 * 60_000).toISOString()} />);
    expect(screen.getByText("Hace 5 min")).not.toBeNull();

    rerender(<DataTimestamp timestamp={new Date(now - 45 * 60_000).toISOString()} />);
    expect(container.textContent ?? "").toContain("Datos desactualizados");

    rerender(<DataTimestamp timestamp={null} />);
    expect(container.textContent ?? "").toContain("Sin datos");
  });
});
