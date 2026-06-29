# Tasks: Novo Formato de Sugestões de Presente

**Feature**: 007-gift-suggestions-redesign
**Branch**: `007-gift-suggestions-redesign`
**Spec**: [./spec.md](./spec.md) · **Plan**: [./plan.md](./plan.md) · **Data Model**: [./data-model.md](./data-model.md) · **Contract**: [./contracts/gift-suggestions.contract.md](./contracts/gift-suggestions.contract.md)

> Reformatar a seção `#gifts` para ser só inspiração: 12 cards com imagem
> ilustrativa, nome e ideias (2-3) por presente — sem preço, sem "Onde comprar"
> (lojas/links), alinhada à identidade visual do sistema.

## Fases

- **Phase 1 — Setup**: gerar/extração do esqueleto
- **Phase 2 — Tests (TDD)**: testes do componente antes da implementação
- **Phase 3 — Core**: componente de apresentação
- **Phase 4 — Integration**: montar no `InvitationSite.tsx`
- **Phase 5 — Polish**: validação (lint/test/build) e atualização da spec

## Tarefas

- [X] **T01** [P] Criar `src/components/invitation/GiftSuggestions.tsx` com:
  - tipos `GiftItem = { id; nome; imagem }` e `GiftSuggestion = { giftId; ideias: string[] }`,
  - `giftItems` (12 itens) e `giftSuggestions` (12 itens) sem `preco`, `reservado`,
    `reservadoPor`, `lojas`,
  - render de grid responsivo com imagem (`loading="lazy"`, `alt`=nome), fallback
    com ícone (`Sparkles`) sobre `#fff5f8` quando `imagem` vazia, badge "Sugestão",
    nome, lista de ideias — sem preço, sem bloco "Onde comprar", sem `<a>`/links.
- [X] **T02** [P] Criar `src/components/invitation/GiftSuggestions.test.tsx`
  cobrindo o contrato **C1–C8** (ver `contracts/gift-suggestions.contract.md`):
  título, 12 nomes, ≥1 ideia por presente, ausência de `R$`/preço, ausência de
  "Onde comprar"/links, `<img>` com `alt`+`loading=lazy` quando há imagem, fallback
  sem `<img>` quando imagem ausente, texto introdutório sem "lojas".
- [X] **T03** Editar `src/app/InvitationSite.tsx`:
  - remover `<section id="gifts">` inline (linhas ~1164–1266),
  - remover `type GiftItem`, `type GiftSuggestion`, arrays `giftItems` e
    `giftSuggestions`,
  - importar `GiftSuggestions` de `@/components/invitation/GiftSuggestions`,
  - montar `<GiftSuggestions />` no lugar (mantendo `motion.section id="gifts"`
    com `whileInView`, paddings `px-5 pb-32 pt-24 sm:px-8 lg:px-12`, container
    `mx-auto max-w-6xl`),
  - remover imports de `Lightbulb`, `ShoppingBag`, `ExternalLink` se ficarem sem
    uso, **sem tocar** em `giftAmounts` nem na seção `#pix`.
- [X] **T04** Rodar validações:
  - `npm test` — Vitest (`GiftSuggestions.test.tsx` deve passar, nenhum teste
    existente deve quebrar),
  - `npm run lint` — ESLint sem erros,
  - `npm run build` — build de produção sem erros de tipo.
- [X] **T05** Verificar manualmente (no `npm run dev`):
  - 12 cards renderizam,
  - zero `R$`/preço, zero "Onde comprar", zero links externos na seção,
  - layout íntegro em 320px, tablet, desktop,
  - seção `#pix` inalterada.

## Verificação cruzada (Checklist)

- FR-001 / FR-008 → T01 (12 cards, 2-3 ideias, imagem ilustrativa)
- FR-002 → T01 (sem `preco`) + T02 (C4: nenhum `R$`)
- FR-003 → T01 (sem `lojas`) + T02 (C5: nenhum "Onde comprar"/`<a>`)
- FR-004 → T01 (texto introdutório reescrito) + T02 (C8)
- FR-005 → T01 (reusa paleta/tipografia/animação do `InvitationSite.tsx`)
- FR-006 → T01 (grid responsivo `sm:grid-cols-2 lg:grid-cols-3`)
- FR-007 → T01 (fallback `Sparkles` quando `imagem` vazia) + T02 (C7)
- SC-001..SC-005 → cobertos pelos T02 + T05

## Critérios de pronto

- T01–T05 marcadas como concluídas.
- `npm test` verde.
- `npm run lint` verde.
- `npm run build` verde.
- Nenhuma referência a `R$`, `Onde comprar`, `ShoppingBag` ou links externos na
  seção `#gifts` (verificável por `rg` no diretório `src/`).

## Resultado da execução (2026-06-29)

- `npm test` — 22 test files / 83 tests passaram (8 novos em
  `GiftSuggestions.test.tsx`).
- `npm run lint` — 0 errors (20 warnings, todas elas pré-existentes ou no
  padrão `<img>` do projeto).
- `npm run build` — compilado com sucesso, 0 erros de TypeScript, 9 páginas
  estáticas geradas.
- `InvitationSite.tsx` reduzido de 1492 → 1052 linhas.
- `rg -E "R\$|lojas|Onde comprar" src/components/invitation/GiftSuggestions.tsx` →
  0 matches.
