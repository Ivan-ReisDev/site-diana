import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import {
  GiftSuggestions,
  giftItems,
  giftSuggestions,
} from "./GiftSuggestions";

afterEach(() => {
  cleanup();
});

describe("GiftSuggestions — US1 (sugestões como ideias puras)", () => {
  it("C1: renderiza o título 'Sugestões de Presente'", () => {
    render(<GiftSuggestions />);
    expect(
      screen.getByRole("heading", { name: /Sugestões de Presente/i }),
    ).toBeInTheDocument();
  });

  it("C2: renderiza os 11 nomes de presente de giftItems", () => {
    render(<GiftSuggestions />);

    expect(giftItems).toHaveLength(11);
    expect(giftSuggestions).toHaveLength(11);

    for (const item of giftItems) {
      expect(
        screen.getByRole("heading", { name: item.nome, level: 3 }),
      ).toBeInTheDocument();
    }
  });

  it("C3: cada presente exibe pelo menos uma ideia da sua GiftSuggestion.ideias", () => {
    render(<GiftSuggestions />);

    for (const sug of giftSuggestions) {
      const item = giftItems.find((g) => g.id === sug.giftId);
      expect(item).toBeDefined();

      const heading = screen.getByRole("heading", {
        name: item!.nome,
        level: 3,
      });
      const article = heading.closest("article");
      expect(article).not.toBeNull();

      const list = within(article as HTMLElement).getByRole("list");
      const items = within(list).getAllByRole("listitem");
      expect(items.length).toBeGreaterThanOrEqual(1);
      expect(sug.ideias.length).toBeGreaterThanOrEqual(1);

      const renderedTexts = items.map((li) => li.textContent ?? "");
      for (const ideia of sug.ideias) {
        expect(renderedTexts.some((text) => text.includes(ideia))).toBe(true);
      }
    }
  });

  it("C4: nenhum texto monetário aparece (sem 'R$', 'Sugestão de valor' ou preço)", () => {
    const { container } = render(<GiftSuggestions />);
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/R\$/);
    expect(text).not.toMatch(/sugest[ãa]o de valor/i);
    expect(text).not.toMatch(/pre[çc]o/i);
  });

  it("C5: nenhum bloco 'Onde comprar' e nenhum <a>/link na seção", () => {
    const { container } = render(<GiftSuggestions />);
    const text = container.textContent ?? "";

    expect(text).not.toMatch(/onde comprar/i);
    expect(container.querySelectorAll("a").length).toBe(0);
  });
});

describe("GiftSuggestions — US2 (estilo do sistema)", () => {
  it("C6: item com imagem renderiza <img> com alt = nome e loading='lazy'", () => {
    render(<GiftSuggestions />);

    const itemWithImage = giftItems.find((g) => g.imagem);
    expect(itemWithImage).toBeDefined();

    const images = screen.getAllByRole("img", { name: itemWithImage!.nome });
    expect(images.length).toBeGreaterThan(0);
    for (const img of images) {
      expect(img.tagName).toBe("IMG");
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("alt", itemWithImage!.nome);
    }
  });

  it("C7: item com imagem vazia renderiza fallback (sem <img> quebrada)", () => {
    // Cria um item extra com imagem vazia para forçar o caminho de fallback.
    const fallbackItem = {
      id: 999,
      nome: "Presente sem imagem",
      imagem: "",
    };
    const fallbackSuggestion = {
      giftId: 999,
      ideias: ["Ideia de exemplo para fallback"],
    };

    const originalItems = [...giftItems];
    const originalSuggestions = [...giftSuggestions];
    giftItems.push(fallbackItem);
    giftSuggestions.push(fallbackSuggestion);

    try {
      render(<GiftSuggestions />);

      // O card existe com o nome.
      const heading = screen.getByRole("heading", {
        name: fallbackItem.nome,
        level: 3,
      });
      const article = heading.closest("article");
      expect(article).not.toBeNull();

      // O card NÃO contém um <img> com alt = nome do item sem imagem.
      const imgs = within(article as HTMLElement).queryAllByRole("img", {
        name: fallbackItem.nome,
      });
      expect(imgs).toHaveLength(0);

      // A ideia é renderizada normalmente.
      expect(
        within(article as HTMLElement).getByText(
          /Ideia de exemplo para fallback/,
        ),
      ).toBeInTheDocument();
    } finally {
      giftItems.length = 0;
      giftItems.push(...originalItems);
      giftSuggestions.length = 0;
      giftSuggestions.push(...originalSuggestions);
    }
  });

  it("C8: o texto introdutório não menciona 'lojas'/'onde encontrá-los' e comunica inspiração", () => {
    const { container } = render(<GiftSuggestions />);

    const heading = screen.getByRole("heading", {
      name: /Sugestões de Presente/i,
    });
    const introWrap = heading.parentElement;
    expect(introWrap).not.toBeNull();

    const introText = (introWrap as HTMLElement).textContent ?? "";
    expect(introText).not.toMatch(/lojas?/i);
    expect(introText).not.toMatch(/onde (voc[êe] )?(pode )?encontr/i);
    expect(introText).not.toMatch(/comprar/i);

    // Comunica inspiração/sugestão.
    expect(introText).toMatch(/inspir|ideia/i);

    // Sanidade: a ausência é local, não algo vazio.
    expect(container.textContent ?? "").toMatch(/inspir|ideia/i);
  });
});
