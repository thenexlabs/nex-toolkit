import * as React from "react";
import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./Input";

describe("Input aria-invalid precedence (NB-012)", () => {
  it("invalid wins over an explicit aria-invalid={false}", () => {
    render(<Input aria-label="k" invalid aria-invalid={false} />);
    expect(screen.getByLabelText("k").getAttribute("aria-invalid")).toBe("true");
  });

  it("invalid wins over an explicit aria-invalid={undefined}", () => {
    render(<Input aria-label="k" invalid aria-invalid={undefined} />);
    expect(screen.getByLabelText("k").getAttribute("aria-invalid")).toBe("true");
  });

  it("passes a consumer's aria-invalid through when invalid is not set", () => {
    render(<Input aria-label="k" aria-invalid="grammar" />);
    expect(screen.getByLabelText("k").getAttribute("aria-invalid")).toBe("grammar");
  });

  it("omits aria-invalid when the input is valid", () => {
    render(<Input aria-label="k" />);
    expect(screen.getByLabelText("k").hasAttribute("aria-invalid")).toBe(false);
  });
});
