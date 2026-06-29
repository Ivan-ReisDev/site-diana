---
description: "Task list for Dashboard em páginas separadas"
---

# Tasks: Dashboard em páginas separadas

**Input**: Design documents from `specs/009-dashboard-separate-pages/`

**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/routes.md](./contracts/routes.md)

**Tests**: Apenas um teste de componente é incluído (Sidebar — item ativo), conforme previsto no plano e no Princípio 6 (validação). Os demais testes existentes do dashboard devem permanecer verdes.

**Organization**: Tarefas agrupadas por user story (P1 → P3) para implementação e validação independentes.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: US1, US2, US3
- Caminhos de arquivo exatos incluídos

## Path Conventions

Projeto único Next.js (App Router): `src/app/`, `src/components/`, `src/lib/` na raiz do repositório.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação e leitura das convenções do Next.js 16 (difere do treino — ver AGENTS.md).

- [x] T001 Ler convenções do App Router em `node_modules/next/dist/docs/`: layouts/pages aninhados (`01-app/.../layouts-and-pages.md`), `03-api-reference/03-file-conventions/page.md` e `layout.md` (assinatura async, `params`/`searchParams` como Promise), `03-api-reference/04-functions/use-pathname.md` e `03-api-reference/02-components/link.md`. Anotar diferenças relevantes antes de codar.

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Centralizar a proteção de autenticação no layout para que TODAS as rotas filhas fiquem protegidas antes de existirem.

**⚠️ CRITICAL**: Nenhuma página de seção pode ser criada sem o guard centralizado, sob risco de expor dados sem sessão.

- [x] T002 Mover a checagem de sessão para o layout em `src/app/dashboard/layout.tsx`: tornar o componente `async`, chamar `getCurrentAdminSession()` de `@/lib/auth/session` e, se ausente, `redirect('/login')` (de `next/navigation`); manter `<Sidebar/>` + `<main>` envolvendo `children`.

**Checkpoint**: Layout protege todo o segmento `/dashboard/*`. Páginas de seção podem ser criadas.

---

## Phase 3: User Story 1 - Navegar entre seções por páginas distintas (Priority: P1) 🎯 MVP

**Goal**: Cada seção do painel vira uma rota própria que exibe somente seu conteúdo; o menu navega entre páginas (não mais âncoras).

**Independent Test**: Autenticado, clicar em cada item do menu navega para uma URL distinta exibindo apenas aquela seção; recarregar mantém a seção.

### Implementation for User Story 1

- [x] T003 [US1] Converter `src/app/dashboard/page.tsx` para conter SOMENTE a Visão geral: remover o guard de sessão (agora no layout), buscar `stats` via `getDashboardData({ status: 'all', q: '' })` de `@/lib/rsvp/service`, renderizar o cabeçalho "Lista de presença" + `<PresenceStats stats={stats} />`. Remover as demais `<section>` (cadastro/confirmações/mural) desta página.
- [x] T004 [P] [US1] Criar `src/app/dashboard/cadastro-manual/page.tsx` (Server Component async): buscar `rows` via `getDashboardData(...)` e renderizar `<DashboardRsvpManager initialRows={rows} />`.
- [x] T005 [P] [US1] Criar `src/app/dashboard/confirmacoes/page.tsx` (Server Component async): receber `searchParams` (Promise) com `status` e `q`, fazer `await`, buscar `rows` via `getDashboardData({ status, q })` e renderizar `<DashboardFilters q={q} status={status} />` + `<RsvpTable rows={rows} />` (preservar tipo `DashboardStatusFilter`).
- [x] T006 [P] [US1] Criar `src/app/dashboard/mural/page.tsx` (Server Component async): buscar `listRecados()` de `@/lib/recados/service`, mapear para `{ id, nome, mensagem, createdAt: createdAt.toISOString() }` e renderizar `<RecadosManager initialRecados={...} />`.
- [x] T007 [US1] Atualizar `src/components/dashboard/Sidebar.tsx`: trocar `<a href="#...">` por `next/link`; definir os 4 itens de `NAV_LINKS` para rotas reais (`/dashboard`, `/dashboard/cadastro-manual`, `/dashboard/confirmacoes`, `/dashboard/mural`) com os labels "Visão geral", "Cadastro manual", "Lista de confirmações", "Mural de recados" (novo item, Q1=A); manter `onClick={close}` para fechar o menu mobile ao navegar.

**Checkpoint**: As 4 seções são páginas navegáveis e independentes (MVP entregue).

---

## Phase 4: User Story 2 - Menu lateral indica a seção atual (Priority: P2)

**Goal**: O item do menu correspondente à rota atual aparece destacado e acessível.

**Independent Test**: Em cada rota, o item de menu correspondente recebe destaque visual e `aria-current="page"`; os demais não.

### Implementation for User Story 2

- [x] T008 [US2] Em `src/components/dashboard/Sidebar.tsx`, usar `usePathname()` (de `next/navigation`) para marcar o item ativo: match **exato** para `/dashboard` (Visão geral) e por **prefixo** para `/dashboard/confirmacoes` (continua ativo com query de filtro); aplicar classe de destaque e `aria-current="page"` ao item ativo.
- [x] T009 [P] [US2] Criar `src/components/dashboard/Sidebar.test.tsx` (Vitest + Testing Library): mockar `usePathname` e verificar que, para cada rota, apenas o item correspondente tem `aria-current="page"` (incluir caso `/dashboard` exato vs subrota).

**Checkpoint**: Navegação orientada — usuário sabe em qual seção está.

---

## Phase 5: User Story 3 - Entrada padrão e endereços antigos funcionam (Priority: P3)

**Goal**: `/dashboard` cai na Visão geral por padrão e links antigos com âncora não quebram.

**Independent Test**: Acessar `/dashboard` mostra a Visão geral; abrir `/dashboard#confirmacoes` exibe uma seção válida sem erro.

### Implementation for User Story 3

- [x] T010 [US3] Verificar que `/dashboard` (raiz) renderiza a Visão geral sem redirect (Q2=B já satisfeito por T003); confirmar que `/dashboard#confirmacoes` cai na Visão geral válida (fragmento ignorado) sem tela quebrada. Ajustar T003 caso algum resíduo de âncora cause erro.
- [x] T011 [US3] Em telas pequenas, confirmar/garantir no `src/components/dashboard/Sidebar.tsx` que selecionar um item fecha o menu colapsado (`close()`) e navega para a página correspondente (comportamento já ligado em T007 — validar que continua funcionando com `next/link`).

**Checkpoint**: Entrada padrão e compatibilidade de âncora cobertas.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Garantir paridade de funcionalidades e validação real (Princípio 6).

- [x] T012 [P] Rodar `npm test` e confirmar que os testes existentes do dashboard (`PresenceStats`, `DashboardRsvpManager`, `DashboardFilters`, `RsvpTable`) seguem verdes e o novo `Sidebar.test.tsx` passa.
- [x] T013 Rodar `npm run build` e corrigir quaisquer erros de tipo/rota nas novas páginas (assinaturas async, `searchParams` Promise).
- [x] T014 Validação visual real (desktop + mobile) das 4 rotas seguindo [quickstart.md](./quickstart.md): navegação, item ativo, reload mantém seção, deep-link de filtro em `/dashboard/confirmacoes?status=...&q=...`, redirect para `/login` sem sessão, menu mobile fechando ao navegar.

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — começar imediatamente.
- **Foundational (Phase 2)**: depende do Setup — **bloqueia** todas as user stories (guard no layout).
- **User Stories (Phase 3+)**: dependem da Foundational.
  - US1 é o MVP e deve vir primeiro (cria as rotas/menu base).
  - US2 e US3 dependem das rotas de US1 existirem.
- **Polish (Phase 6)**: depois de US1–US3.

### User Story Dependencies

- **US1 (P1)**: após Foundational. Base de tudo (rotas + menu navegável).
- **US2 (P2)**: após US1 (edita o mesmo `Sidebar.tsx`, adicionando estado ativo). Não paraleliza com T007.
- **US3 (P3)**: após US1 (depende da raiz = Visão geral e do `next/link`). Majoritariamente verificação/ajuste.

### Within Each User Story

- T004, T005, T006 ([P]) são arquivos novos distintos — podem ser feitos em paralelo entre si; T003 (edita page.tsx) também é independente desses.
- T007 (Sidebar) deve vir após as páginas existirem para navegar para alvos válidos.
- US2: T008 antes de T009 (implementação antes do teste? aqui o teste valida o comportamento — pode escrever T009 primeiro e ver falhar, depois T008, se preferir TDD).

### Parallel Opportunities

- T004, T005, T006 em paralelo (páginas novas independentes).
- T003 pode correr em paralelo com T004–T006 (arquivo diferente).
- T009 (teste do Sidebar) é arquivo separado — paralelizável após T008.
- T012 paralelo a outras tarefas de polish que não toquem os mesmos arquivos.

---

## Parallel Example: User Story 1

```bash
# Após o layout (Foundational) estar pronto, criar as páginas novas em paralelo:
Task: "Criar src/app/dashboard/cadastro-manual/page.tsx (DashboardRsvpManager)"
Task: "Criar src/app/dashboard/confirmacoes/page.tsx (DashboardFilters + RsvpTable)"
Task: "Criar src/app/dashboard/mural/page.tsx (RecadosManager)"
# E, em paralelo, ajustar a raiz:
Task: "Converter src/app/dashboard/page.tsx para somente a Visão geral"
# Depois, com as rotas existindo, atualizar o menu:
Task: "Atualizar Sidebar para next/link com 4 itens"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1 (Setup) → ler docs Next 16.
2. Phase 2 (Foundational) → guard no layout.
3. Phase 3 (US1) → 4 páginas + menu com `next/link`.
4. **PARAR e VALIDAR**: navegar entre as seções, recarregar, conferir isolamento.
5. Demo do MVP.

### Incremental Delivery

1. Setup + Foundational → base pronta.
2. US1 → navegação por páginas (MVP).
3. US2 → destaque do item ativo.
4. US3 → entrada padrão + compat. de âncora + menu mobile.
5. Polish → testes, build, validação visual.

---

## Notes

- [P] = arquivos diferentes, sem dependências.
- Nenhuma entidade/dado novo: reaproveita `getDashboardData`, `listRecados`, componentes e auth existentes.
- `Sidebar.tsx` é tocado em US1 (links) e US2 (ativo) — sequencial, não paralelo entre essas fases.
- Commitar após cada tarefa ou grupo lógico; validar cada checkpoint.
- Atenção Next 16: `layout`/`page` async, `searchParams` é Promise, `usePathname`/`Link` são client (`Sidebar` já é `"use client"`).
