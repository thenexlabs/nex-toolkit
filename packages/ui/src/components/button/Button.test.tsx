import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { Button } from "./Button";

const cls = (el: HTMLElement) => el.className.split(/\s+/);

describe("Button", () => {
  it("renders a type=button primary/md button by default", () => {
    render(<Button>Request a demo</Button>);
    const btn = screen.getByRole("button", { name: "Request a demo" });
    expect(btn.getAttribute("type")).toBe("button");
    expect(cls(btn)).toEqual(expect.arrayContaining(["bg-accent", "text-on-accent", "rounded-control", "h-9"]));
  });

  it("keeps an explicit type", () => {
    render(<Button type="submit">Save</Button>);
    expect(screen.getByRole("button").getAttribute("type")).toBe("submit");
  });

  it.each([
    ["secondary", "border-line-strong"],
    ["ghost", "text-fg-muted"],
    ["danger", "bg-danger"],
  ] as const)("applies the %s variant", (variant, expected) => {
    render(<Button variant={variant}>x</Button>);
    const c = cls(screen.getByRole("button"));
    expect(c).toContain(expected);
    expect(c).not.toContain("bg-accent");
  });

  it.each([
    ["sm", "h-8"],
    ["lg", "h-11"],
  ] as const)("applies the %s size", (size, expected) => {
    render(<Button size={size}>x</Button>);
    expect(cls(screen.getByRole("button"))).toContain(expected);
  });

  it("lets className override NEX classes instead of stacking them", () => {
    render(<Button className="rounded-card shadow-glow-md">x</Button>);
    const c = cls(screen.getByRole("button"));
    expect(c).toContain("rounded-card");
    expect(c).not.toContain("rounded-control");
    expect(c).toContain("shadow-glow-md");
  });

  it("forwards refs to the <button>", () => {
    const ref = React.createRef<HTMLButtonElement>();
    render(<Button ref={ref}>x</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("calls onClick", () => {
    const onClick = vi.fn();
    render(<Button onClick={onClick}>x</Button>);
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it("loading: shows a spinner, sets aria-busy and blocks clicks", () => {
    const onClick = vi.fn();
    const { container } = render(
      <Button loading onClick={onClick}>
        Saving
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Saving" });
    expect(btn.getAttribute("aria-busy")).toBe("true");
    expect((btn as HTMLButtonElement).disabled).toBe(true);
    expect(container.querySelector('[data-slot="spinner"]')).not.toBeNull();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("disabled passes through", () => {
    render(<Button disabled>x</Button>);
    expect((screen.getByRole("button") as HTMLButtonElement).disabled).toBe(true);
  });

  it("asChild renders the child element with Button styling and no nested <button>", () => {
    const { container } = render(
      <Button asChild variant="secondary">
        <a href="/demo">Book a demo</a>
      </Button>,
    );
    const link = screen.getByRole("link", { name: "Book a demo" });
    expect(link.getAttribute("href")).toBe("/demo");
    expect(cls(link)).toEqual(expect.arrayContaining(["border-line-strong", "rounded-control"]));
    expect(container.querySelector("button")).toBeNull();
    expect(link.getAttribute("type")).toBeNull();
  });

  it("asChild + disabled marks the link inactive", () => {
    render(
      <Button asChild disabled>
        <a href="/demo">Book a demo</a>
      </Button>,
    );
    const link = screen.getByRole("link");
    expect(link.getAttribute("aria-disabled")).toBe("true");
    expect(link.getAttribute("tabindex")).toBe("-1");
  });
});
