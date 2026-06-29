import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Plus } from "lucide-react";
import { Button } from "./Button";

describe("Button", () => {
  it("C5: renderiza as quatro variantes", () => {
    const { rerender } = render(<Button variant="primary">Primário</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "primary");

    rerender(<Button variant="secondary">Secundário</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "secondary");

    rerender(<Button variant="ghost">Fantasma</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "ghost");

    rerender(<Button variant="danger">Perigo</Button>);
    expect(screen.getByRole("button")).toHaveAttribute("data-variant", "danger");
  });

  it("C6: loading mostra rótulo de progresso e desabilita o botão", () => {
    render(<Button variant="primary" loading>Savar grupo</Button>);
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("aria-busy", "true");
    expect(btn).toHaveTextContent(/salvando/i);
  });

  it("C7: aceita disabled nativo e bloqueia interação", () => {
    const onClick = vi.fn();
    render(
      <Button variant="secondary" disabled onClick={onClick}>
        Limpar
      </Button>,
    );
    const btn = screen.getByRole("button");
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  it("C8: botão somente-ícone exige aria-label", () => {
    const { rerender } = render(
      <Button variant="ghost" icon={<Plus data-testid="plus-icon" />} aria-label="Adicionar" />,
    );
    expect(screen.getByRole("button", { name: "Adicionar" })).toBeInTheDocument();

    rerender(<Button variant="ghost" icon={<Plus />} />);
    expect(screen.getByRole("button")).toBeInTheDocument();
    expect(screen.getByRole("button")).not.toHaveAttribute("aria-label");
  });

  it("renderiza ícone junto do rótulo quando ambos fornecidos", () => {
    render(
      <Button variant="primary" icon={<Plus data-testid="plus-icon" />}>
        Adicionar adulto
      </Button>,
    );
    expect(screen.getByTestId("plus-icon")).toBeInTheDocument();
    expect(screen.getByRole("button")).toHaveTextContent("Adicionar adulto");
  });

  it("dispara onClick quando clicável", () => {
    const onClick = vi.fn();
    render(
      <Button variant="primary" onClick={onClick}>
        Salvar
      </Button>,
    );
    fireEvent.click(screen.getByRole("button"));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});