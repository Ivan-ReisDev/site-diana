---
description: "Task list for feature 008 — Ajuste de idade no RSVP e Mural de Recados persistente"
---

# Tasks: Ajuste de idade no RSVP e Mural de Recados persistente

**Input**: Design documents from `specs/008-rsvp-child-age-mural/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: INCLUÍDOS — o projeto adota TDD/validação (Constituição, princípio 6; research D6) e já possui suíte Vitest.

**Organization**: Tarefas agrupadas por user story. US1 e US2 são independentes e podem ser entregues separadamente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependência pendente)
- **[Story]**: US1 (RSVP idade só de criança) ou US2 (Mural persistente)

## Path Conventions

Single-project Next.js App Router: `src/app`, `src/components`, `src/lib`, `prisma/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Pré-requisitos compartilhados antes de codar.

- [X] T001 Ler os docs do Next 16 antes de escrever route handlers: `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`, `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/route.md` e `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/dynamic-routes.md` (params assíncrono em `[id]`, caching dinâmico na listagem) — ver [plan.md](./plan.md) e [AGENTS.md](../../AGENTS.md)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Não há trabalho compartilhado bloqueante entre as duas histórias — US1 e US2 são independentes. A infraestrutura específica de cada história está dentro da sua fase (ex.: model `Recado` na Phase 4). Pode prosseguir direto para as user stories.

*(Nenhuma tarefa nesta fase.)*

---

## Phase 3: User Story 1 — Confirmar presença sem idade de adultos (Priority: P1) 🎯 MVP

**Goal**: No formulário de confirmação (público e criação manual no painel), adultos têm apenas nome; idade só para crianças. Persistência e exibições ajustadas, sem quebrar confirmações antigas.

**Independent Test**: Abrir o formulário → adultos sem campo de idade, crianças com idade; enviar com criança sem idade é bloqueado; envio válido persiste e aparece no painel (adultos sem idade, crianças com idade).

### Tests for User Story 1

- [X] T002 [P] [US1] Atualizar testes de schema em `src/lib/rsvp/schema.test.ts`: adulto válido só com `name`, criança exige `age`, `adults` exige ≥1
- [X] T003 [P] [US1] Atualizar testes de service em `src/lib/rsvp/service.test.ts`: adultos serializados sem `age`; participante adulto antigo com `age` é ignorado (não exibido); contadores corretos
- [X] T004 [P] [US1] Atualizar `src/app/api/rsvp/route.test.ts`: payload válido com adultos sem `age` e crianças com `age`

### Implementation for User Story 1

- [X] T005 [US1] Em `src/lib/rsvp/schema.ts`: criar `rsvpAdultSchema` (apenas `name` não vazio) e `rsvpChildSchema` (`name` + `age` 0–120); `rsvpInputSchema.adults` usa `rsvpAdultSchema` e `children` usa `rsvpChildSchema` (ver [contracts/rsvp-schema-change.md](./contracts/rsvp-schema-change.md))
- [X] T006 [US1] Em `src/lib/rsvp/service.ts`: ajustar `buildRsvpMutation`, `serializeRsvp` e `parseStoredParticipants` para adultos sem `age` (ignorar `age` legado em dados antigos)
- [X] T007 [US1] Em `src/app/api/rsvp/route.ts`: ajustar a mensagem de erro de validação para refletir adultos só com nome
- [X] T008 [US1] Em `src/app/InvitationSite.tsx`: remover o `<label>Idade</label>`+input de idade da seção Adultos; ajustar texto auxiliar ("Informe o nome completo de cada adulto."); remover idade da validação local de adultos (manter a de criança); remover idade do cartão de confirmação de adultos; ajustar o tipo de estado dos adultos
- [X] T009 [US1] Em `src/components/dashboard/DashboardRsvpManager.tsx`: remover input/estado/validação de idade dos adultos no formulário de criação manual (linhas ~76, 87, 184, 199–223); manter idade das crianças
- [X] T010 [US1] Em `src/components/dashboard/RsvpTable.tsx`: exibir adultos sem idade (separar formatação: adultos = só nome; crianças = nome + idade), incluindo confirmações antigas sem erro

**Checkpoint US1**: Formulário público e painel sem idade de adulto; idade de criança obrigatória; testes US1 passam.

---

## Phase 4: User Story 2 — Deixar um recado que permanece salvo (Priority: P1)

**Goal**: Recados persistidos no banco, exibidos após recarregar/em outro dispositivo, publicação instantânea, rate limiting por dispositivo e remoção pela organizadora no painel admin.

**Independent Test**: Enviar recado → aparece na hora; recarregar/abrir em outro navegador → continua; nome/mensagem vazios bloqueiam; >5 recados em poucos minutos → 429; admin remove no `/dashboard` → some do mural.

### Foundational for User Story 2

- [X] T011 [US2] Em `prisma/schema.prisma`: adicionar `model Recado` (id cuid, nome, mensagem, createdAt + `@@index([createdAt])`) conforme [data-model.md](./data-model.md); rodar `npm run db:migrate` e `npm run db:generate`

### Tests for User Story 2

- [X] T012 [P] [US2] Criar `src/lib/recados/schema.test.ts`: `nome` e `mensagem` obrigatórios (trim), `mensagem` máx. 240
- [X] T013 [P] [US2] Criar `src/lib/recados/service.test.ts`: `listRecados` (ordem desc), `createRecado`, `deleteRecado` com PrismaClient mockado
- [X] T014 [P] [US2] Criar `src/lib/recados/rate-limit.test.ts`: bloqueia após N envios na janela por dispositivo; libera após a janela
- [X] T015 [P] [US2] Criar `src/app/api/recados/route.test.ts`: `GET` lista; `POST` valida (400), respeita rate limit (429) e cria (200) — service mockado
- [X] T016 [P] [US2] Criar `src/app/api/recados/[id]/route.test.ts`: `DELETE` exige sessão admin (401 sem sessão; 200 com sessão; 404 inexistente)

### Implementation for User Story 2

- [X] T017 [P] [US2] Criar `src/lib/recados/schema.ts`: `recadoInputSchema` (`nome` trim min 1; `mensagem` trim min 1 max 240)
- [X] T018 [P] [US2] Criar `src/lib/recados/rate-limit.ts`: limitador em memória por dispositivo (default 5/10min, configurável por env) conforme research D4
- [X] T019 [US2] Criar `src/lib/recados/service.ts`: `listRecados`, `createRecado`, `deleteRecado` (injeção de `PrismaClient`, padrão de `src/lib/rsvp/service.ts`)
- [X] T020 [US2] Criar `src/app/api/recados/route.ts`: `GET` (lista, dinâmico/sem cache) e `POST` (valida → rate limit por dispositivo via `x-forwarded-for`/IP → cria) conforme [contracts/recados-api.md](./contracts/recados-api.md)
- [X] T021 [US2] Criar `src/app/api/recados/[id]/route.ts`: `DELETE` com `getCurrentAdminSession` (401 se não autenticado), `await params` para `id`, 404 se inexistente
- [X] T022 [US2] Em `src/app/InvitationSite.tsx`: substituir o estado em memória do mural por integração com a API — carregar via `GET /api/recados` no mount (estados loading/erro/vazio), enviar via `POST` (desabilitar botão durante envio, tratar 429, preservar texto digitado em erro, inserir novo recado na lista)
- [X] T023 [P] [US2] Criar `src/components/dashboard/RecadosManager.tsx`: lista recados com botão remover que chama `DELETE /api/recados/[id]` e atualiza a lista
- [X] T024 [US2] Em `src/app/dashboard/page.tsx`: buscar recados no servidor (`listRecados`) e renderizar uma seção de moderação com `<RecadosManager>` (já protegido por `getCurrentAdminSession`)

**Checkpoint US2**: Recados persistem e sobrevivem a reload/outro dispositivo; rate limit ativo; admin remove pelo painel.

---

## Phase 5: Polish & Cross-Cutting Concerns

**Purpose**: Validação final (Constituição, princípio 6).

- [X] T025 Rodar `npm test` e garantir todas as suítes verdes (rsvp + recados + rate-limit + rotas)
- [X] T026 Rodar `npm run build` e garantir build de produção sem erros
- [X] T027 Validação visual manual seguindo [quickstart.md](./quickstart.md): RSVP sem idade de adulto (público e painel); mural persistente após reload e em outro navegador; rate limit (429); remoção de recado no admin; responsividade mobile e labels acessíveis

---

## Dependencies & Execution Order

### Story independence

- **US1** e **US2** são independentes — podem ser implementadas/entregues em qualquer ordem ou em paralelo por pessoas diferentes.
- **Atenção a conflito de arquivo**: `src/app/InvitationSite.tsx` é tocado por T008 (US1) e T022 (US2) em seções diferentes. Se feito pela mesma pessoa, executar sequencialmente para evitar conflito de merge.

### Within User Story 1

- Tests (T002–T004) antes da implementação.
- T005 (schema) antes de T006 (service). T007/T008/T009/T010 dependem do novo schema (T005). T008/T009/T010 são arquivos distintos → podem ser paralelos entre si após T005.

### Within User Story 2

- T011 (model + migration) bloqueia service/rotas (T019–T021).
- T017 (schema) e T018 (rate-limit) antes das rotas (T020).
- T019 (service) antes de T020/T021/T024.
- T022 (mural na página) depende de T020 (GET/POST).
- T023 (RecadosManager) depende de T021 (DELETE). T024 depende de T019 + T023.

### Polish

- Phase 5 depois de US1 e/ou US2 concluídas.

---

## Parallel Execution Examples

**US1 — após T005, em paralelo:**
```
T008 [US1] InvitationSite (form público)
T009 [US1] DashboardRsvpManager (criação manual)
T010 [US1] RsvpTable (exibição)
```

**US1 tests em paralelo (início):** `T002, T003, T004`

**US2 tests em paralelo (após T011):** `T012, T013, T014, T015, T016`

**US2 libs base em paralelo:** `T017 (schema)`, `T018 (rate-limit)`

---

## Implementation Strategy

- **MVP (entrega 1)**: Phase 1 + **US1** (T002–T010) + validação. Já entrega a mudança de idade pedida.
- **Entrega 2**: **US2** (T011–T024) — mural persistente com moderação e rate limit.
- **Fechamento**: Phase 5 (testes, build, validação visual).

**Total de tarefas**: 27
**Por história**: Setup 1 · US1 9 (T002–T010) · US2 14 (T011–T024) · Polish 3
