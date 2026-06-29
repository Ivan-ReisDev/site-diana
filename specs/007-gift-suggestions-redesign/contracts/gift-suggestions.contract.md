# UI Contract: GiftSuggestions

**Feature**: 007-gift-suggestions-redesign | **Date**: 2026-06-29

Contrato de comportamento/apresentação da seção `#gifts`. Serve de base para os testes Vitest e para a validação visual.

## Componente

```ts
// src/components/invitation/GiftSuggestions.tsx
export type GiftItem = { id: number; nome: string; imagem: string };
export type GiftSuggestion = { giftId: number; ideias: string[] };

export const giftItems: GiftItem[];          // 11 categorias
export const giftSuggestions: GiftSuggestion[]; // 11 categorias

export function GiftSuggestions(): JSX.Element; // sem props; dados internos
```

- Componente de apresentação, **sem estado** e **sem props** (dados estáticos internos), montado por `InvitationSite.tsx` como `<GiftSuggestions />` dentro/junto da `motion.section id="gifts"`.

## Contrato de renderização (asserções testáveis)

| ID | Dado | Quando | Então |
|----|------|--------|-------|
| C1 | A seção é renderizada | sempre | Renderiza o título "Sugestões de Presente". |
| C2 | A seção é renderizada | sempre | Renderiza os 11 nomes de categoria de `giftItems` (ex.: "Brinquedos musicais", "Sapatinhos e Sandálias"). |
| C3 | A seção é renderizada | sempre | Cada presente exibe pelo menos uma ideia da sua `GiftSuggestion.ideias`. |
| C4 | A seção é renderizada | sempre | **Nenhum** texto monetário aparece: sem `R$`, sem "Sugestão de valor", sem números de preço. |
| C5 | A seção é renderizada | sempre | **Nenhum** bloco "Onde comprar" e **nenhum** `<a>`/link de loja na seção. |
| C6 | Item com `imagem` preenchida | render | Renderiza `<img>` com `alt` = nome do presente e `loading="lazy"`. |
| C7 | Item com `imagem` vazia | render | Renderiza fallback com ícone (sem `<img>` quebrada), sem erro de layout. |
| C8 | Texto introdutório | render | Não menciona "lojas"/"onde encontrá-los"; comunica que é apenas sugestão/inspiração. |

## Não-objetivos

- Não há reserva de presente, não há preço, não há link externo.
- A seção `#pix` (valores via Pix) não é alterada por este componente.

## Acessibilidade / Responsividade

- Imagens com `alt` significativo (nome do presente).
- Grid responsivo (1 coluna em mobile → 2 → 3 conforme largura), alvos legíveis de 320px a 1920px.
- Contraste e tipografia conforme a paleta do convite.
