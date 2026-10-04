import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Badge } from "./Badge";

const cls = (el: HTMLElement) => el.className.split(/\s+/);

describe("Badge", () => {
  it("renders a neutral <span> by default", () => {
    render(<Badge>Draft</Badge>);
    const el = screen.getByText("Draft");
    expect(el.tagName).toBe("SPAN");
    expect(cls(el)).toEqual(expect.arrayContaining(["rounded-badge", "text-xs", "bg-raised", "text-fg-muted", "border-line"]));
  });

  it.each([
    ["accent", "text-accent-text", "bg-accent/10"],
    ["success", "text-success-text", "bg-success/10"],
    ["warning", "text-warning-text", "bg-warning/10"],
    ["danger", "text-danger-text", "bg-danger/10"],
    ["info", "text-info-text", "bg-info/10"],
  ] as const)("tone=%s uses the %s / tint pair", (tone, text, bg) => {
    render(<Badge tone={tone}>x</Badge>);
    const c = cls(screen.getByText("x"));
    expect(c).toContain(text);
    expect(c).toContain(bg);
    expect(c).not.toContain("bg-raised");
  });

  it("dot renders a decorative dot before the label", () => {
    render(
      <Badge tone="success" dot>
        Passing
      </Badge>,
    );
    const el = screen.getByText("Passing");
    const dot = el.querySelector('[data-slot="dot"]');
    expect(dot).not.toBeNull();
    expect(dot?.getAttribute("aria-hidden")).toBe("true");
    expect(el.firstElementChild).toBe(dot);
  });

  it("no dot by default", () => {
    render(<Badge>x</Badge>);
    expect(screen.getByText("x").querySelector('[data-slot="dot"]')).toBeNull();
  });

  it("mono switches to monospace tabular figures", () => {
    render(<Badge mono>CVE-2026-1234</Badge>);
    expect(cls(screen.getByText("CVE-2026-1234"))).toEqual(expect.arrayContaining(["font-mono", "tabular-nums"]));
  });

  it("className overrides instead of stacking", () => {
    render(<Badge className="rounded-pill">x</Badge>);
    const c = cls(screen.getByText("x"));
    expect(c).toContain("rounded-pill");
    expect(c).not.toContain("rounded-badge");
  });

  it("passes through native props and forwards ref", () => {
    const ref = React.createRef<HTMLSpanElement>();
    render(
      <Badge ref={ref} title="3 controls failing" data-testid="b">
        3
      </Badge>,
    );
    expect(ref.current).toBeInstanceOf(HTMLSpanElement);
    expect(screen.getByTestId("b").getAttribute("title")).toBe("3 controls failing");
  });
});
