import * as React from "react";
import { describe, expect, it } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import {
  Button, Card, CardBody, CardTitle, Field, Input, Modal, ModalContent, ModalDescription, ModalTitle,
  ModalTrigger, Table, TableBody, TableCell, TableHead, TableHeader, TableRow, Toaster, toast,
} from "../index";

// Smoke tests: one per component, checking wiring and a11y — not every class.
describe("primitives", () => {
  it("Field wires label, error and aria onto Input", () => {
    render(<Field label="API key" error="Key expired"><Input mono /></Field>);
    const input = screen.getByLabelText("API key");
    expect(input.getAttribute("aria-invalid")).toBe("true");
    expect(screen.getByText("Key expired").id).toBe(input.getAttribute("aria-describedby"));
    expect(input.className).toContain("font-mono");
  });

  it("Card renders its parts", () => {
    render(<Card><CardBody><CardTitle>SOC 2</CardTitle></CardBody></Card>);
    expect(screen.getByRole("heading", { name: "SOC 2" })).toBeTruthy();
  });

  it("Modal opens from its trigger as an accessible dialog", () => {
    render(
      <Modal>
        <ModalTrigger asChild><Button>Rotate key</Button></ModalTrigger>
        <ModalContent>
          <ModalTitle>Rotate API key?</ModalTitle>
          <ModalDescription>The old key stops working.</ModalDescription>
        </ModalContent>
      </Modal>,
    );
    fireEvent.click(screen.getByRole("button", { name: "Rotate key" }));
    expect(screen.getByRole("dialog", { name: "Rotate API key?" })).toBeTruthy();
  });

  it("toast() shows a message in the Toaster", () => {
    render(<Toaster />);
    act(() => {
      toast.success("Evidence uploaded");
    });
    expect(screen.getAllByText("Evidence uploaded").length).toBeGreaterThan(0);
  });

  it("Table numeric cells are right-aligned mono", () => {
    render(
      <Table>
        <TableHeader><TableRow><TableHead>Control</TableHead><TableHead numeric>Evidence</TableHead></TableRow></TableHeader>
        <TableBody><TableRow><TableCell>CC6.1</TableCell><TableCell numeric>42 / 42</TableCell></TableRow></TableBody>
      </Table>,
    );
    expect(screen.getByText("42 / 42").className).toContain("tabular-nums");
    expect(screen.getByRole("columnheader", { name: "Evidence" }).className).toContain("text-right");
  });
});
