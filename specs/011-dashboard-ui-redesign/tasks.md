---
description: "Task list for Redesign de UI/UX das páginas da Dashboard"
---

# Tasks: Redesign de UI/UX das páginas da Dashboard

**Input**: Design documents from `/specs/011-dashboard-ui-redesign/`

**Prerequisites**: plan.md ✅, spec.md ✅, research.md ✅, data-model.md ✅, contracts/ui-primitives.md ✅

**Tests**: Incluídos para os primitivos de UI (`FormField`, `Button`) e como rede de regressão dos componentes do painel, conforme Princípio 6 (TDD/validação) e Decisão 6 do research.md.

**Organization**: Tarefas agrupadas por user story (P1 → P3) para implementação e teste independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências pendentes)
- **[Story]**: US1/US2/US3 (fases de user story). Setup/Foundational/Polish não têm label.
- Caminhos de arquivo são absolutos a partir da raiz do repositório.

## Path Conventions

App Next.js único (`src/`). Primitivos novos em `src/components/ui/`. Componentes do painel em `src/components/dashboard/`. Páginas em `src/app/dashboard/`.

---

## Phase 1: Setup

- [x] T001 Confirmar baseline verde: rodar `npm run test` e `npm run build` na branch `011-dashboard-ui-redesign` para registrar o estado atual antes do redesenho (referência de não-regressão para SC-006/FR-009).
- [x] T002 Criar a pasta de primitivos `src/components/ui/` (camada de apresentação compartilhada, hoje inexistente).

**Checkpoint**: Suíte atual verde e pasta `src/components/ui/` pronta.

---

## Phase 2: Foundational (primitivos compartilhados — BLOQUEIA todas as user stories)

**Purpose**: Os primitivos encapsulam os tokens do convite (research.md Decisão 1) e são consumidos por US1, US2 e US3. Nenhuma user story pode ser concluída sem eles.

### Tokens

- [x] T003 Em `src/app/globals.css`, adicionar (somente se reduzir duplicação) um utilitário/classe de campo refletindo os tokens do convite (`bg-[#ffe9f0] rounded-xl h-11 px-4 text-[15px]`, foco `ring-2 ring-[#f3d3dd]`, placeholder `#cf93a7`); caso contrário, documentar que os primitivos usam classes Tailwind inline. (data-model.md → Design Tokens)

### Primitivos com teste (TDD)

- [x] T004 [P] Escrever teste `src/components/ui/FormField.test.tsx`: rótulo associado ao controle via `htmlFor`/`id` (C1), suporte a `as='input'` e `as='select'` renderizando `children` como opções (C3), `disabled` bloqueia interação (C4). (contracts C1–C4)
- [x] T005 [P] Escrever teste `src/components/ui/Button.test.tsx`: variantes `primary|secondary|ghost|danger` (C5), `loading` mostra rótulo de progresso e desabilita (C6), botão somente-ícone exige `aria-label` (C8). (contracts C5–C8)
- [x] T006 Implementar `src/components/ui/FormField.tsx` (label + input/select padronizados; foco `ring-2 ring-[#f3d3dd]`; tokens do convite) até T004 passar. (data-model.md → FormField; G2/G3)
- [x] T007 Implementar `src/components/ui/Button.tsx` (4 variantes, estados hover/disabled/loading, ícone opcional, foco visível) até T005 passar. (data-model.md → Button; FR-003)

### Primitivos de layout (sem teste dedicado — verificados via componentes do painel)

- [x] T008 [P] Implementar `src/components/ui/SectionCard.tsx` (cantos/sombra/respiro padrão — `rounded-[1.5rem] bg-white p-5 sm:p-6 shadow-[0_12px_32px_rgba(185,75,105,.08)]`). (FR-005, C9)
- [x] T009 [P] Implementar `src/components/ui/SectionHeader.tsx` (`eyebrow` + `title` + `description`, hierarquia única). (FR-004, C10)
- [x] T010 [P] Implementar `src/components/ui/EmptyState.tsx` (estado vazio amigável padronizado). (FR-007, C11)
- [x] T011 Rodar `npm run test` e garantir que T004/T005 passam e nada regrediu.

**Checkpoint**: Primitivos prontos e testados — user stories podem começar.

---

## Phase 3: User Story 1 — Formulários alinhados ao padrão visual do convite (Priority: P1) 🎯 MVP

**Goal**: O formulário de cadastro manual e o de busca/filtro adotam a linguagem visual do convite (campos suaves, foco claro, rótulos, botões consistentes), sem alterar comportamento.

**Independent Test**: Abrir `/dashboard/cadastro-manual` e `/dashboard/confirmacoes`, comparar lado a lado com o formulário público; verificar campos, foco, mensagens e botões no padrão. Suíte Vitest do manager/filtros verde.

- [x] T012 [US1] Migrar `src/components/dashboard/DashboardRsvpManager.tsx` para usar `FormField` (nome, telefone, presença via `<select>` estilizado — research.md Decisão 3), `Button` (Salvar=primary com `loading`, Limpar=secondary, Adicionar adulto/criança=ghost+`Plus`, Remover=danger+`Trash2`), `SectionCard` e `SectionHeader`; manter exatamente o fluxo de submit/validação/`router.refresh()`. (FR-001, FR-002, FR-003, C13)
- [x] T013 [US1] Em `DashboardRsvpManager.tsx`, padronizar as mensagens de erro/sucesso com `role="alert"`/`aria-live` e ícone, não dependendo só de cor. (FR-006, C12)
- [x] T014 [US1] Rodar `npm run test -- DashboardRsvpManager` e ajustar seletores do teste apenas se a mudança de tag exigir (preferir queries por label/role); comportamento deve permanecer idêntico. (FR-009, SC-006)
- [x] T015 [P] [US1] Migrar `src/components/dashboard/DashboardFilters.tsx` para usar `FormField` (busca + status como `<select>` estilizado) e `Button` (Aplicar filtros=primary), dentro de `SectionCard`; manter submit GET de `q`/`status`. (FR-001, C14)
- [x] T016 [US1] Rodar `npm run test -- DashboardFilters` (e qualquer teste que renderize os filtros) garantindo verde. (FR-009)
- [x] T017 [US1] Validar visualmente as duas telas em 360/768/1280px: campos idênticos ao convite, foco visível por teclado, sem rolagem horizontal. (SC-001, SC-004, SC-005)

**Checkpoint**: MVP entregue — formulários do painel no padrão da aplicação e comportamento preservado.

---

## Phase 4: User Story 2 — Consistência visual entre todas as páginas (Priority: P2)

**Goal**: Visão geral, Cadastro manual, Lista de confirmações e Mural compartilham cabeçalhos, cartões, espaçamentos e tipografia consistentes.

**Independent Test**: Percorrer as 4 páginas; nenhum cabeçalho/cartão/estado vazio destoa do padrão.

- [x] T018 [P] [US2] Migrar `src/components/dashboard/RecadosManager.tsx` para `SectionCard` + `SectionHeader` + `EmptyState` + `Button` (Remover=danger com estado processando); manter `DELETE /api/recados/:id` e feedback. (FR-004, FR-005, FR-007, C15)
- [x] T019 [P] [US2] Migrar `src/components/dashboard/PresenceStats.tsx` para alinhar os cartões de estatística ao padrão (`SectionCard`/tokens). (FR-005)
- [x] T020 [US2] Atualizar `src/app/dashboard/page.tsx` (Visão geral) para usar `SectionHeader`/`SectionCard` no bloco de cabeçalho. (FR-004, FR-005)
- [x] T021 [P] [US2] Ajustar `src/app/dashboard/layout.tsx` (fundo/respiro do shell) e `src/components/dashboard/Sidebar.tsx` (tipografia e estado ativo alinhados ao padrão, mantendo navegação e foco). (FR-012, C17)
- [x] T022 [US2] Rodar `npm run test -- Sidebar PresenceStats` (e demais afetados) garantindo verde. (FR-009)
- [x] T023 [US2] Validar visualmente as 4 páginas lado a lado: cabeçalhos, cartões e estados vazios consistentes; nenhuma página destoante. (SC-002)

**Checkpoint**: Painel visualmente unificado.

---

## Phase 5: User Story 3 — Leitura e ações claras em listas e tabelas (Priority: P3)

**Goal**: Lista de confirmações e mural legíveis e com ações claras, inclusive no celular.

**Independent Test**: Abrir lista e mural em telas grande e pequena; legibilidade, alinhamento, distinção de status e clareza das ações.

- [x] T024 [US3] Migrar `src/components/dashboard/RsvpTable.tsx`: padronizar o cartão (`SectionCard`), reforçar legibilidade/alinhamento e a distinção visual confirmados × não-confirmados (sem depender só de cor). (FR-005, FR-011, C16)
- [x] T025 [US3] Garantir responsividade de `RsvpTable` em 360px (sem rolagem horizontal desconfortável — empilhamento/cartões em telas estreitas). (FR-008, SC-004)
- [x] T026 [US3] Rodar `npm run test -- RsvpTable` garantindo que linhas/idades/distinção continuam corretos. (FR-009)
- [x] T027 [US3] Validar visualmente a remoção no mural (feedback durante processamento) e a leitura da lista em 360/768/1280px. (FR-003, SC-004)

**Checkpoint**: Listas e tabelas claras e responsivas.

---

## Phase 6: Polish & Cross-Cutting

- [x] T028 [P] Auditoria de acessibilidade do painel: navegação por teclado em todos os campos/botões/links com foco visível (SC-005); rótulos associados; contraste adequado. (FR-010, Princípio 3)
- [x] T029 [P] Auditoria de responsividade final em 360/768/1280px nas 4 páginas: nenhuma rolagem horizontal indesejada. (FR-008, SC-004)
- [x] T030 Rodar a suíte completa `npm run test` e `npm run build`; confirmar verde e build ok (nenhuma funcionalidade quebrada). (SC-006, FR-009)
- [x] T031 Validação visual real final comparando o painel ao site público do convite e registrar evidência (sem expor dados reais de RSVP — Princípio 2). (SC-001, SC-002)

---

## Dependencies & Execution Order

### Ordem de fases

- **Setup (Phase 1)** → **Foundational (Phase 2)** → **US1 (Phase 3, MVP)** → **US2 (Phase 4)** → **US3 (Phase 5)** → **Polish (Phase 6)**.
- Phase 2 BLOQUEIA todas as user stories (os primitivos são pré-requisito).
- US1/US2/US3 são independentes entre si depois da Phase 2 e podem ser entregues incrementalmente; a ordem reflete prioridade de valor.

### Dependências internas

- T006 depende de T004; T007 depende de T005 (TDD).
- T012/T013 antes de T014; T015 antes de T016 (implementar → testar).
- T018–T021 podem ocorrer em paralelo (arquivos distintos), depois T022/T023.
- Polish depende da conclusão das stories trabalhadas.

### Paralelização

- **Phase 2**: T004, T005 em paralelo; T008, T009, T010 em paralelo (arquivos diferentes).
- **US1**: T015 [P] em paralelo com a migração do manager (T012–T014) — arquivos diferentes.
- **US2**: T018, T019, T021 em paralelo.
- **Polish**: T028, T029 em paralelo.

---

## Implementation Strategy

- **MVP = Phase 1 + 2 + 3 (US1)**: entrega o que a usuária pediu explicitamente (formulários no padrão). Demonstrável isoladamente.
- **Incremento 2 = US2**: unifica visualmente todo o painel.
- **Incremento 3 = US3**: refina leitura/ações em listas e mobile.
- **Fechamento = Polish**: acessibilidade, responsividade, build e validação visual real.
- Rede de segurança contínua: rodar `npm run test` após cada componente migrado para garantir FR-009 (nenhuma regressão funcional).

---

## Resumo

- **Total**: 31 tarefas
- **US1 (P1, MVP)**: 6 tarefas (T012–T017)
- **US2 (P2)**: 6 tarefas (T018–T023)
- **US3 (P3)**: 4 tarefas (T024–T027)
- **Setup/Foundational/Polish**: 15 tarefas (T001–T011, T028–T031)
- **Oportunidades de paralelização**: T004/T005, T008/T009/T010, T015, T018/T019/T021, T028/T029
