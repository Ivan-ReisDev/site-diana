---
description: "Task list for excluir e editar confirmações no painel"
---

# Tasks: Excluir e editar confirmações no painel

**Input**: Design documents from `/specs/012-rsvp-edit-delete/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/rsvp-id-api.md](./contracts/rsvp-id-api.md)

**Tests**: INCLUÍDOS — a constituição do projeto exige TDD/validação (Princípio 6) e o plano lista arquivos de teste. Testes vêm antes da implementação em cada história.

**Organization**: Tarefas agrupadas por user story para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: US1 (excluir), US2 (editar), US3 (feedback/erros)

## Path Conventions

App Next.js único em `src/` (App Router). Testes co-localizados (`*.test.ts[x]`), executados com Vitest (`npm run test`).

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Confirmar base existente; nenhuma dependência ou migração nova.

- [X] T001 Revisar padrões reutilizados antes de codar: auth em [src/app/api/recados/[id]/route.ts](../../src/app/api/recados/\[id\]/route.ts), validação em [src/lib/rsvp/schema.ts](../../src/lib/rsvp/schema.ts), serialização/`normalizePhone` em [src/lib/rsvp/service.ts](../../src/lib/rsvp/service.ts) e primitivos em [src/components/ui/](../../src/components/ui/); confirmar que `npm run test` e `npm run build` rodam limpos no baseline.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Scaffolding compartilhado por US1 (DELETE) e US2 (PATCH). MUST complete antes das histórias.

- [X] T002 Criar o route handler compartilhado em `src/app/api/rsvp/[id]/route.ts` com o guard de sessão (`getCurrentAdminSession` → 401 `{ ok:false, message:"Não autorizado." }`) e a extração de `id` de `ctx.params` (Promise), sem ainda implementar DELETE/PATCH (apenas a base comum, espelhando `recados/[id]`).
- [X] T003 [P] Criar o client island de ações por linha em `src/components/dashboard/RsvpRowActions.tsx` (`"use client"`), recebendo `row: RsvpSummary` e `useRouter`, com um contêiner de ações vazio (placeholder) e estados locais de `feedback`/`error`.
- [X] T004 Renderizar `<RsvpRowActions row={row} />` por linha em [src/components/dashboard/RsvpTable.tsx](../../src/components/dashboard/RsvpTable.tsx) (adicionar uma célula/área de ações ao layout do card/linha, sem alterar as colunas de dados existentes).
- [X] T005 [P] Atualizar [src/components/dashboard/RsvpTable.test.tsx](../../src/components/dashboard/RsvpTable.test.tsx) para asserir que existe uma região de ações renderizada por linha.

**Checkpoint**: Base pronta — a lista renderiza um ponto de ação por confirmação; a rota `/api/rsvp/[id]` existe e rejeita sem sessão.

---

## Phase 3: User Story 1 — Excluir uma confirmação (Priority: P1) 🎯 MVP

**Goal**: O admin remove um registro específico da lista, com confirmação explícita; a lista e as estatísticas se atualizam.

**Independent Test**: Em `/dashboard/confirmacoes`, acionar excluir → confirmar → o registro some e os totais caem; cancelar não remove nada.

### Tests (US1)

- [X] T006 [P] [US1] Teste de service para `deleteRsvp` em `src/lib/rsvp/service.test.ts`: id existente → `true` e registro removido; id inexistente → `false` (usar Prisma mock/db de teste conforme padrão do projeto).
- [X] T007 [P] [US1] Teste do handler DELETE em `src/app/api/rsvp/[id]/route.test.ts`: sem sessão → 401; sucesso → 200 `{ ok:true, message:"Confirmação removida." }`; id inexistente → 404 `{ ok:false, message:"Confirmação não encontrada." }`.
- [X] T008 [P] [US1] Teste de componente em `src/components/dashboard/RsvpRowActions.test.tsx`: clicar "Excluir" abre confirmação; cancelar não chama `fetch`; confirmar chama `DELETE /api/rsvp/{id}` e dispara `router.refresh`.

### Implementation (US1)

- [X] T009 [US1] Adicionar `deleteRsvp(id, db = getPrismaClient()): Promise<boolean>` em [src/lib/rsvp/service.ts](../../src/lib/rsvp/service.ts), espelhando `deleteRecado` (retorna `false` quando não encontrado).
- [X] T010 [US1] Implementar o handler `DELETE` em `src/app/api/rsvp/[id]/route.ts` sobre a base do T002: chamar `deleteRsvp(id)`; 404 se `false`; 200 em sucesso (ver [contracts/rsvp-id-api.md](./contracts/rsvp-id-api.md)).
- [X] T011 [P] [US1] Criar `src/components/ui/ConfirmDialog.tsx` (`"use client"`): diálogo acessível de confirmação (título, mensagem, botões Confirmar/Cancelar) com foco gerenciado, fechar por Esc/backdrop, `role="dialog"`/`aria-modal`, usando `Button` (variante `danger` para confirmar) e a paleta do painel.
- [X] T012 [US1] Em `src/components/dashboard/RsvpRowActions.tsx`, adicionar o botão "Excluir" (ícone `Trash2`) que abre o `ConfirmDialog`; ao confirmar, `fetch('/api/rsvp/{id}', { method:'DELETE' })`, tratar sucesso (feedback + `router.refresh()`), 404 e falha de rede (mensagem de erro).

**Checkpoint**: US1 entregue e testável isoladamente — exclusão com confirmação funcionando ponta a ponta (FR-001..FR-005, FR-013..FR-016, SC-001, SC-003, SC-004, SC-006).

---

## Phase 4: User Story 2 — Editar uma confirmação preenchida errada (Priority: P1)

**Goal**: O admin corrige os dados de uma confirmação (nome, telefone, presença, adultos, crianças) por um formulário pré-preenchido; salvar reflete na lista e nas estatísticas.

**Independent Test**: Abrir editar → alterar telefone e nº de adultos → salvar → lista mostra os novos valores e estatísticas recalculam; cancelar não altera nada.

### Tests (US2)

- [X] T013 [P] [US2] Teste de service para `updateRsvp` em `src/lib/rsvp/service.test.ts`: sucesso retorna `RsvpSummary` atualizado; id inexistente (`P2025`) sinaliza "não encontrado"; telefone em conflito (`P2002`) sinaliza conflito; entrada inválida lança `ZodError`.
- [X] T014 [P] [US2] Teste do handler PATCH em `src/app/api/rsvp/[id]/route.test.ts`: sem sessão → 401; corpo inválido → 400; sucesso → 200 `{ ok:true, rsvp, message:"Confirmação atualizada." }`; id inexistente → 404; telefone duplicado → 409.
- [X] T015 [P] [US2] Teste de componente em `src/components/dashboard/RsvpEditForm.test.tsx`: renderiza pré-preenchido a partir de `row`; bloqueia submit com nome vazio (erro de campo); submit válido chama `PATCH`.

### Implementation (US2)

- [X] T016 [US2] Adicionar `updateRsvp(id, input, db = getPrismaClient())` em [src/lib/rsvp/service.ts](../../src/lib/rsvp/service.ts): validar com `rsvpInputSchema`; recalcular `phoneNormalized` via `normalizePhone`; `db.rsvp.update({ where:{id}, data:{ name, phone, phoneNormalized, attendance, adults:len, children:len, participants } })` sem tocar `message`/`groupName`; capturar `Prisma.PrismaClientKnownRequestError` `P2002` (conflito) e `P2025` (não encontrado) e reexpor de forma tratável; retornar `serializeRsvp`.
- [X] T017 [US2] Implementar o handler `PATCH` em `src/app/api/rsvp/[id]/route.ts` sobre a base do T002: parsear corpo, chamar `updateRsvp`; mapear `ZodError`→400, não encontrado→404, conflito→409, sucesso→200 (ver contrato).
- [X] T018 [US2] Criar `src/components/dashboard/RsvpEditForm.tsx` (`"use client"`): formulário pré-preenchido a partir de `row` (nome, telefone com `maskPhone`, presença, lista de adultos, lista de crianças com idade); reusar `FormField`/`Button`, validar com `rsvpInputSchema` + `toFieldErrors`; expor `onSaved`/`onCancel`. Reaproveitar a lógica de campos do [DashboardRsvpManager](../../src/components/dashboard/DashboardRsvpManager.tsx).
- [X] T019 [US2] Em `src/components/dashboard/RsvpRowActions.tsx`, adicionar o botão "Editar" que abre o `RsvpEditForm` (modal/inline) pré-preenchido; ao salvar, `fetch('/api/rsvp/{id}', { method:'PATCH', body })`, tratar sucesso (feedback + `router.refresh()`), 400/404/409 e falha de rede; cancelar fecha sem alterar.

**Checkpoint**: US2 entregue e testável isoladamente — edição pré-preenchida com validação e recálculo de estatísticas (FR-006..FR-012, SC-002, SC-004, SC-005).

---

## Phase 5: User Story 3 — Feedback claro e proteção contra erros (Priority: P2)

**Goal**: Toda ação dá feedback visual de sucesso/erro; dados inválidos e conflitos são bloqueados com mensagem clara.

**Independent Test**: Excluir/salvar com sucesso mostram confirmação; salvar com campo obrigatório vazio ou telefone em conflito é bloqueado com mensagem específica.

### Implementation (US3)

- [X] T020 [P] [US3] Padronizar o feedback em `RsvpRowActions.tsx` e `RsvpEditForm.tsx`: mensagens de sucesso com `role="status"`/`aria-live="polite"` e de erro com `role="alert"`, seguindo o padrão de [DashboardRsvpManager](../../src/components/dashboard/DashboardRsvpManager.tsx) (ícones `CheckCircle2`/`AlertCircle`, não depender só de cor — Princípio 3).
- [X] T021 [US3] Garantir tratamento explícito dos casos de erro no fluxo de edição (`RsvpEditForm`/`RsvpRowActions`): 409 → mensagem "telefone já cadastrado"; 404 → "confirmação não encontrada" + `router.refresh()`; erros de validação por campo bloqueando o submit; e no fluxo de exclusão, 404 tratado com refresh.
- [X] T022 [P] [US3] Testes de estados de erro em `src/components/dashboard/RsvpRowActions.test.tsx` e `src/components/dashboard/RsvpEditForm.test.tsx`: submit inválido bloqueado, conflito de telefone (409) exibido, exclusão de item já removido (404) tratada.

**Checkpoint**: US3 entregue — feedback e proteção consistentes (FR-009, FR-012, FR-014, SC-005).

---

## Phase 6: Polish & Cross-Cutting Concerns

- [X] T023 [P] Passe de responsividade e acessibilidade das ações e do `ConfirmDialog`/`RsvpEditForm` (alvos de toque, layout 360px+, foco/teclado, preservação de filtros `status`/`q` no `router.refresh` — FR-016), conforme o padrão responsivo do projeto.
- [X] T024 Rodar `npm run test` e `npm run build` (verde) e executar a validação manual do [quickstart.md](./quickstart.md) (excluir, editar, erros, filtros ativos) — evidência antes de concluir (Princípio 6).

---

## Dependencies & Execution Order

- **Setup (P1)** → **Foundational (P2)** → histórias.
- **Foundational** bloqueia US1 e US2 (route base T002; row-actions island T003–T004).
- **US1 (P1, MVP)**: T006–T012. Depende de T002/T003 (DELETE no route base; botão no island).
- **US2 (P1)**: T013–T019. Depende de T002/T003. Independente de US1 (PATCH e edit button são adições separadas ao mesmo route/island).
- **US3 (P2)**: T020–T022. Depende de US1 e US2 existirem (endurece o feedback de ambos).
- **Polish (P6)**: T023–T024. Por último.

Nota de arquivos compartilhados: `route.ts` (T010/T017) e `RsvpRowActions.tsx` (T012/T019) são tocados por US1 e US2 — dentro de cada história são sequenciais; entre histórias, faça US1 e depois US2 (ou coordene para evitar conflito de edição nesses dois arquivos).

## Parallel Opportunities

- **Foundational**: T003 e T005 `[P]` (arquivos distintos) enquanto T002/T004 seguem em sequência.
- **US1 tests**: T006, T007, T008 `[P]` juntos (arquivos distintos) antes da implementação. Impl: T011 (`ConfirmDialog`) `[P]` em paralelo a T009 (service).
- **US2 tests**: T013, T014, T015 `[P]` juntos antes da implementação.
- **US3**: T020 e T022 `[P]`.

## Implementation Strategy

- **MVP = Setup + Foundational + US1**: entrega a exclusão com confirmação, que já atende o pedido central ("quero poder excluir cada um desses").
- **Incremento 2 = US2**: adiciona a edição pré-preenchida.
- **Incremento 3 = US3 + Polish**: endurece feedback, erros, acessibilidade e responsividade.
