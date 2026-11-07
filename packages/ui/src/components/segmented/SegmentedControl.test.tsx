import * as React from "react";
import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { SegmentedControl } from "./SegmentedControl";

const options = [{ value: "graph", label: "Graph" }, { value: "table", label: "Table" }] as const;

describe("SegmentedControl", () => {
  it("is a labelled group of toggle buttons with the chosen one pressed", () => {
    render(<SegmentedControl label="View" options={options} value="graph" onValueChange={() => {}} />);
    expect(screen.getByRole("group", { name: "View" }).className).toContain("shadow-well");
    expect(screen.getByRole("button", { name: "Graph" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Table" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("reports the choice and does not submit a form", () => {
    const onValueChange = vi.fn();
    render(<form><SegmentedControl label="View" options={options} value="graph" onValueChange={onValueChange} /></form>);
    const table = screen.getByRole("button", { name: "Table" });
    expect(table.getAttribute("type")).toBe("button");
    fireEvent.click(table);
    expect(onValueChange).toHaveBeenCalledWith("table");
  });

  it("applies its size", () => {
    render(<SegmentedControl label="View" options={options} value="graph" onValueChange={() => {}} size="lg" />);
    expect(screen.getByRole("button", { name: "Graph" }).className).toContain("h-9");
  });
});
