import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { FormField } from "./FormField";

describe("FormField", () => {
  it("C1: associa o rótulo ao controle via htmlFor/id", () => {
    render(<FormField id="phone" label="Telefone" type="tel" />);
    const input = screen.getByLabelText("Telefone");
    expect(input).toBeInTheDocument();
    expect(input.tagName).toBe("INPUT");
    expect(input).toHaveAttribute("id", "phone");
  });

  it("C3: renderiza como select com children como opções", () => {
    render(
      <FormField id="status" label="Status" as="select" defaultValue="all">
        <option value="all">Todos</option>
        <option value="yes">Confirmados</option>
      </FormField>,
    );
    const select = screen.getByLabelText("Status") as HTMLSelectElement;
    expect(select.tagName).toBe("SELECT");
    expect(select.options).toHaveLength(2);
    expect(select.value).toBe("all");
  });

  it("C4: aplica disabled no controle e bloqueia interação", () => {
    render(<FormField id="name" label="Nome" disabled />);
    const input = screen.getByLabelText("Nome") as HTMLInputElement;
    expect(input).toBeDisabled();
    expect(input).toHaveAttribute("disabled");
  });

  it("encaminha value/onChange ao input", () => {
    let value = "";
    render(
      <FormField
        id="phone"
        label="Telefone"
        value={value}
        onChange={(e) => {
          value = e.target.value;
        }}
      />,
    );
    const input = screen.getByLabelText("Telefone") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "999" } });
    expect(value).toBe("999");
  });

  it("aplica classes de estilo do convite (bg, rounded, focus)", () => {
    render(<FormField id="phone" label="Telefone" />);
    const input = screen.getByLabelText("Telefone");
    expect(input.className).toContain("invite-field");
  });
});