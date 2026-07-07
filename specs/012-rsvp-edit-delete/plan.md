# Implementation Plan: Excluir e editar confirmações no painel

**Branch**: `012-rsvp-edit-delete` | **Date**: 2026-07-06 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/012-rsvp-edit-delete/spec.md`

## Summary

Adicionar as ações de **excluir** e **editar** a cada confirmação listada em `/dashboard/confirmacoes`. Hoje a lista ([RsvpTable](../../src/components/dashboard/RsvpTable.tsx)) é somente leitura: renderizada por um Server Component ([confirmacoes/page.tsx](../../src/app/dashboard/confirmacoes/page.tsx)) que chama `getDashboardData`. Não há endpoint para remover ou atualizar um RSVP por `id` — só existe `POST /api/rsvp` (upsert por telefone) e o padrão `DELETE /api/recados/[id]`.

Abordagem: (1) criar `src/app/api/rsvp/[id]/route.ts` com `DELETE` (remover por id) e `PATCH` (atualizar por id), espelhando o padrão de auth de [recados/[id]/route.ts](../../src/app/api/recados/\[id\]/route.ts); (2) adicionar `deleteRsvp(id)` e `updateRsvp(id, input)` ao [service de RSVP](../../src/lib/rsvp/service.ts), reusando `rsvpInputSchema` e tratando o conflito de telefone único (`P2002`) e "não encontrado" (`P2025`); (3) adicionar ações por linha na lista via um componente **client** de ações (`RsvpRowActions`) com confirmação de exclusão e um formulário de edição pré-preenchido que reusa `FormField`/`Button`/`rsvpInputSchema`/`maskPhone`/`toFieldErrors` já existentes. A validação e o conjunto de campos são exatamente os do cadastro manual ([DashboardRsvpManager](../../src/components/dashboard/DashboardRsvpManager.tsx)): nome, telefone, presença, adultos e crianças com idade.

## Technical Context

**Language/Version**: TypeScript 5 / React 19.2.4 / Next.js 16.2.7 (App Router)

**Primary Dependencies**: Next.js (App Router, Route Handlers, Server + Client Components), Prisma ORM (PostgreSQL), Zod (validação, `rsvpInputSchema`), lucide-react (ícones), Tailwind CSS v4. Nenhuma dependência nova.

**Storage**: PostgreSQL via Prisma. Modelo `Rsvp` (id cuid, `phoneNormalized` único, `participants` JSON). Sem migração de schema — as operações usam colunas existentes.

**Testing**: Vitest + @testing-library/react (`npm run test`). Padrões existentes: `route.test.ts` (auth + status codes), testes de service, testes de componente (`RsvpTable.test.tsx`, `DashboardRsvpManager.test.tsx`).

**Target Platform**: Web mobile-first responsivo; tema claro forçado. Painel autenticado (`noindex`).

**Project Type**: Web application (app Next.js único, estrutura `src/`).

**Performance Goals**: Ações pontuais do admin (baixo volume). Sem novas dependências; atualização da lista via `router.refresh()` (revalidação do Server Component), sem full reload.

**Constraints**: Reusar validação/campos do cadastro manual (FR-007/FR-008); exclusão exige confirmação explícita (FR-002); ações só para admin autenticado (FR-013, Princípio 2); telefone permanece identificador único, editar não pode duplicar/sobrescrever (FR-012); acessibilidade — diálogo de confirmação e formulário com foco/teclado/labels (Princípio 3); pt-BR; responsivo 360px+.

**Scale/Scope**: 1 novo route handler (`DELETE` + `PATCH`), 2 funções de service, 1 componente client de ações + 1 formulário de edição (reutilizando o do cadastro), pequenas mudanças em `RsvpTable`/`confirmacoes/page.tsx`. Testes correspondentes. Sem mudança de modelo de dados.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Impacto | Status |
|-----------|---------|--------|
| 1. Valor para convidados primeiro | Ferramenta interna da administradora; melhora controle sobre a lista sem afetar a experiência do convidado | ✅ Pass |
| 2. Privacidade e segurança | Excluir/editar exigem sessão de admin válida (FR-013); nenhum dado real em testes/prints; operações por `id` sem expor PII adicional | ✅ Pass |
| 3. Acessibilidade | Diálogo de confirmação e formulário de edição com labels, foco visível, navegação por teclado e mensagens não dependentes só de cor (reusa `FormField`/`Button` já acessíveis) | ✅ Pass |
| 4. Performance e SEO | Sem novas dependências/requisições em massa; atualização via revalidação do Server Component; painel é autenticado/`noindex` | ✅ Pass |
| 5. Design emocional sem excesso | Reusa primitivos blush/rosê existentes (`Button` variante `danger`, `FormField`, `SectionCard`); confirmação discreta, sem poluição | ✅ Pass |
| 6. TDD/validação | Testes Vitest para service (delete/update + conflito), route (auth/404/409) e componente; build + validação visual real obrigatórios | ✅ Pass |

No violations. Complexity Tracking não necessário.

## Project Structure

### Documentation (this feature)

```text
specs/012-rsvp-edit-delete/
├── plan.md              # This file
├── research.md          # Phase 0 output — decisões (rota por id, conflito de telefone, campo message)
├── data-model.md        # Phase 1 output — entidade Rsvp e transições de estado das operações
├── quickstart.md        # Phase 1 output — como validar manualmente
├── contracts/
│   └── rsvp-id-api.md    # Contrato dos endpoints DELETE/PATCH /api/rsvp/[id]
├── checklists/
│   └── requirements.md   # Spec quality checklist (de /speckit-specify)
└── tasks.md              # Phase 2 output (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
src/app/api/rsvp/
├── route.ts                        # EXISTE (POST upsert) — inalterado
├── route.test.ts                   # EXISTE — inalterado
└── [id]/
    ├── route.ts                    # NEW: DELETE (remover por id) + PATCH (atualizar por id) com auth
    └── route.test.ts               # NEW: auth 401, 404 não encontrado, 409 conflito de telefone, 200 ok

src/lib/rsvp/
├── service.ts                      # EDIT: + deleteRsvp(id), + updateRsvp(id, input) (conflito P2002 / not found P2025)
└── service.test.ts                 # NEW/EDIT: cobre deleteRsvp e updateRsvp (sucesso, não encontrado, conflito)

src/components/dashboard/
├── RsvpTable.tsx                   # EDIT: renderizar <RsvpRowActions> por linha (client island)
├── RsvpTable.test.tsx              # EDIT: garante que ações aparecem por linha
├── RsvpRowActions.tsx              # NEW (client): botões Editar/Excluir, confirmação, chamadas fetch, router.refresh
├── RsvpRowActions.test.tsx         # NEW
├── RsvpEditForm.tsx                # NEW (client): formulário de edição pré-preenchido (reusa campos do cadastro)
└── RsvpEditForm.test.tsx           # NEW

src/components/ui/
└── ConfirmDialog.tsx               # NEW (client): diálogo acessível de confirmação de exclusão (reutilizável)

src/app/dashboard/confirmacoes/
└── page.tsx                        # inalterado (RsvpTable já recebe rows; ações são client islands internas)
```

**Structure Decision**: App Next.js único em `src/`. A lista permanece um Server Component; a interatividade (confirmar, editar, enviar) é isolada em **client islands** por linha (`RsvpRowActions` + `RsvpEditForm`), seguindo o padrão de mutação já usado no painel (fetch → `router.refresh()`). A API por `id` fica em `src/app/api/rsvp/[id]/route.ts`, espelhando `recados/[id]`.

## Complexity Tracking

Sem violações constitucionais — seção não aplicável.
