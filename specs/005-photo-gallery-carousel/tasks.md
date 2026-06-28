---
description: "Task list for Galeria de Fotos em Carrossel na seção Nossa História"
---

# Tasks: Galeria de Fotos em Carrossel na seção "Nossa História"

**Input**: Design documents from `/specs/005-photo-gallery-carousel/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/photo-gallery.contract.md, quickstart.md

**Tests**: INCLUÍDOS — a constituição (§6 TDD/validação) e o Constitution Check do plano exigem testes unitários (Vitest + @testing-library/react, já configurados).

**Organization**: Tarefas agrupadas por user story (US1 → US2 → US3), em ordem de prioridade.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos nas descrições

## Path Conventions

- Projeto único Next.js App Router em `src/`; assets estáticos em `public/`. Caminhos relativos à raiz do repositório.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Disponibilizar as fotos estáticas e criar os esqueletos de arquivo.

- [x] T001 Criar a pasta `public/galeria/` e adicionar as fotos da Diana com nomes web-safe (`diana-1.jpg`, `diana-2.jpg`, ...)
- [x] T002 [P] Criar esqueleto do hook em `src/hooks/usePhotoCarousel.ts` (`"use client"`, tipo `GalleryPhoto` e assinatura `UsePhotoCarouselResult` conforme `contracts/photo-gallery.contract.md`)
- [x] T003 [P] Criar esqueleto do componente em `src/components/invitation/PhotoGalleryCarousel.tsx` (`"use client"`, prop `photos`/`interval`) e declarar o array `galleryPhotos: { src, alt }[]` apontando para `public/galeria/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Máquina de estados do carrossel e a fiação de integração (remover timeline, montar a galeria) que todas as stories usam.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [x] T004 Implementar a lógica em `src/hooks/usePhotoCarousel.ts` (`activeIndex`, `isAutoPlaying`, handlers `select`/`next`/`prev`, autoplay com timer padrão 5s, reset do timer no `select`, sem autoplay se `total === 1`) conforme `data-model.md`
- [x] T005 [P] Testes unitários do hook em `src/hooks/usePhotoCarousel.test.ts` (índice inicial, `select`, `next`/`prev` circular, autoplay com timers falsos, reset no `select`, sem autoplay com 1 foto)
- [x] T006 Integrar em `src/app/InvitationSite.tsx`: remover o `const timeline` (~linha 399) e a coluna direita `timeline.map` (~linhas 819–831), montando `<PhotoGalleryCarousel photos={galleryPhotos} />` no lugar e mantendo a coluna esquerda (FR-001)

**Checkpoint**: Hook testado e galeria montada na seção — o trabalho das stages pode começar.

---

## Phase 3: User Story 1 - Ver as fotos da princesa em destaque (Priority: P1) 🎯 MVP

**Goal**: A seção "Nossa História" mostra uma foto grande em destaque que avança automaticamente em laço, no lugar da antiga timeline.

**Independent Test**: Abrir a seção e confirmar que o lado direito exibe uma foto grande que troca sozinha ao longo do tempo, e que a timeline antiga sumiu.

### Tests for User Story 1

- [x] T007 [P] [US1] Teste de componente em `src/components/invitation/PhotoGalleryCarousel.test.tsx`: renderiza a foto em destaque; `onError` da imagem exibe placeholder sem quebrar

### Implementation for User Story 1

- [x] T008 [US1] Implementar a foto em destaque em `src/components/invitation/PhotoGalleryCarousel.tsx`: container com proporção fixa (`aspect-[4/5]`/`aspect-square`) + `<img object-cover>`, `loading` adequado (primeira `eager`, demais `lazy`) (FR-002, FR-012)
- [x] T009 [US1] Adicionar a transição suave (crossfade) da foto em destaque com `framer-motion` (`AnimatePresence`/`motion`) e ligar o avanço automático ao hook (FR-003)
- [x] T010 [US1] Tratar falha de carregamento (`onError`) com placeholder rosa e seguir o carrossel; tratar caso de 1 foto sem autoplay (FR-009)

**Checkpoint**: Galeria com foto em destaque e autoplay funcional — MVP entregue.

---

## Phase 4: User Story 2 - Escolher qual foto ver (Priority: P2)

**Goal**: O convidado clica numa miniatura e ela vira a foto em destaque, com a miniatura ativa destacada; o autoplay reinicia.

**Independent Test**: Clicar numa miniatura e confirmar que ela entra em destaque (< 1s), fica marcada como ativa, e o autoplay não pula logo em seguida.

### Tests for User Story 2

- [x] T011 [P] [US2] Testes de componente em `src/components/invitation/PhotoGalleryCarousel.test.tsx`: clicar numa miniatura muda a foto em destaque e marca a miniatura como ativa (`aria-current`); seleção reseta o autoplay

### Implementation for User Story 2

- [x] T012 [US2] Implementar as miniaturas em `src/components/invitation/PhotoGalleryCarousel.tsx`: botões com `<img object-cover>`, `aria-label` e indicação de ativa (`aria-current`), alvo de toque ≥ 44px (FR-002, FR-005)
- [x] T013 [US2] Ligar o clique da miniatura ao `select()` do hook (entra em destaque imediatamente e reseta o timer de autoplay) (FR-004, FR-006)

**Checkpoint**: Seleção manual funcional, respeitando o autoplay.

---

## Phase 5: User Story 3 - Navegar pela galeria em qualquer dispositivo (Priority: P3)

**Goal**: A galeria se adapta às telas — desktop com destaque + miniaturas lado a lado; mobile com destaque acima + faixa de miniaturas rolável — e todas as fotos ficam acessíveis.

**Independent Test**: Abrir em celular/tablet/desktop e confirmar layout adaptado, miniaturas acessíveis (rolagem horizontal no mobile) e legibilidade de 320px a 1920px.

### Tests for User Story 3

- [x] T014 [P] [US3] Teste de componente em `src/components/invitation/PhotoGalleryCarousel.test.tsx`: todas as miniaturas são renderizadas como botões acessíveis (todas as fotos alcançáveis)

### Implementation for User Story 3

- [x] T015 [US3] Implementar o layout responsivo em `src/components/invitation/PhotoGalleryCarousel.tsx`: desktop/tablet com destaque + miniaturas ao lado; mobile com destaque acima + faixa `overflow-x-auto` com scroll-snap (FR-007, FR-008)
- [x] T016 [US3] Garantir acesso a todas as fotos quando as miniaturas não couberem (rolagem das miniaturas) e legibilidade de 320px a 1920px, retrato e paisagem (FR-008, SC-004)

**Checkpoint**: Galeria responsiva e navegável em qualquer dispositivo.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Reduced-motion, acessibilidade e validação final.

- [x] T017 [P] Respeitar `prefers-reduced-motion` via `useReducedMotion()` em `src/components/invitation/PhotoGalleryCarousel.tsx` (desligar autoplay e simplificar transições) (FR-010)
- [x] T018 Passagem de acessibilidade/estética em `src/components/invitation/PhotoGalleryCarousel.tsx`: navegação por teclado das miniaturas, `alt` descritivo, estética de princesa e card sem borda no padrão atual (FR-011, constituição §3)
- [x] T019 Rodar `npm test` e `npm run build` e corrigir falhas (constituição §6)
- [x] T020 Validação visual real (desktop + mobile) seguindo o checklist de `specs/005-photo-gallery-carousel/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories.
- **User Stories (Phase 3–5)**: dependem da Foundational. As stages compartilham `PhotoGalleryCarousel.tsx`, então recomenda-se ordem sequencial P1 → P2 → P3 (mesmo arquivo).
- **Polish (Phase 6)**: depende das stories desejadas concluídas.

### User Story Dependencies

- **US1 (P1)**: começa após a Foundational. Entrega o MVP (destaque + autoplay).
- **US2 (P2)**: estende o componente com miniaturas/seleção; sobre a US1.
- **US3 (P3)**: refina o layout responsivo; sobre US1/US2.

### Within Each User Story

- Teste do componente escrito antes da implementação da stage (deve falhar primeiro).
- Hook (Foundational) antes das stages.
- Implementação de UI antes da fiação de integração.

### Parallel Opportunities

- Setup: T002 e T003 em paralelo (arquivos diferentes).
- Foundational: T005 (teste do hook) em paralelo com a integração do host (T006).
- Testes de cada story ([P]) podem ser escritos cedo; a implementação das stages é sequencial por compartilhar `PhotoGalleryCarousel.tsx`.
- Polish: T017 antes do fim; T019/T020 ao final.

---

## Parallel Example: Setup + Foundational

```bash
# Setup — arquivos diferentes, em paralelo:
Task: "Criar esqueleto do hook em src/hooks/usePhotoCarousel.ts"                         # T002
Task: "Criar esqueleto do componente em src/components/invitation/PhotoGalleryCarousel.tsx"  # T003

# Foundational — teste do hook em paralelo com integração do host:
Task: "Testes unitários do hook em src/hooks/usePhotoCarousel.test.ts"   # T005
Task: "Integrar e remover a timeline em src/app/InvitationSite.tsx"      # T006
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup (fotos + esqueletos).
2. Phase 2: Foundational (hook + integração/remover timeline).
3. Phase 3: US1 — foto em destaque + autoplay.
4. **PARAR e VALIDAR**: a galeria troca sozinha e a timeline sumiu.

### Incremental Delivery

1. Setup + Foundational → fundação pronta.
2. US1 → valida → MVP (destaque + autoplay).
3. US2 → valida → seleção por miniaturas.
4. US3 → valida → responsivo (mobile com faixa rolável).
5. Polish → reduced-motion/a11y + build + validação visual.

---

## Notes

- [P] = arquivos diferentes, sem dependências.
- As stages vivem em `PhotoGalleryCarousel.tsx`; editar em sequência evita conflitos.
- Verificar que os testes falham antes de implementar.
- Commit após cada task ou grupo lógico.
- Sem novas dependências; sem dados persistidos; fotos estáticas em `public/galeria/`; timeline removida de vez.
