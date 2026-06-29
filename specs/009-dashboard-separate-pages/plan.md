# Implementation Plan: Dashboard em páginas separadas

**Branch**: `009-dashboard-separate-pages` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/009-dashboard-separate-pages/spec.md`

## Summary

Hoje o painel administrativo ([src/app/dashboard/page.tsx](../../src/app/dashboard/page.tsx)) renderiza **todas as seções numa única página**, separadas apenas por âncoras de id (`#visao-geral`, `#cadastro-manual`, `#confirmacoes`, `#mural-recados`). O menu lateral ([src/components/dashboard/Sidebar.tsx](../../src/components/dashboard/Sidebar.tsx)) navega por âncora (`<a href="#...">`).

A mudança transforma cada seção em uma **rota própria** dentro do App Router, reusando o layout existente ([src/app/dashboard/layout.tsx](../../src/app/dashboard/layout.tsx)) com a `Sidebar` e a checagem de sessão:

- `/dashboard` → **Visão geral** (cabeçalho + `PresenceStats`)
- `/dashboard/cadastro-manual` → `DashboardRsvpManager`
- `/dashboard/confirmacoes` → `DashboardFilters` + `RsvpTable`
- `/dashboard/mural` → `RecadosManager`

O menu passa a usar `next/link` com destaque do item ativo via `usePathname()`. A proteção de autenticação (`getCurrentAdminSession` → `redirect('/login')`) é movida para o layout (ou repetida por página) para cobrir todas as rotas. Decisões de clarificação: **Q1=A** (mural com página própria) e **Q2=B** (`/dashboard` é a Visão geral, sem redirect).

Nenhuma entidade de dados nova; é uma reorganização de apresentação/navegação reutilizando os componentes e serviços atuais.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.7 (App Router)

**Primary Dependencies**: framer-motion, lucide-react; serviços existentes `getDashboardData` ([src/lib/rsvp/service.ts](../../src/lib/rsvp/service.ts)) e `listRecados` ([src/lib/recados/service.ts](../../src/lib/recados/service.ts)); auth via `getCurrentAdminSession` ([src/lib/auth/session.ts](../../src/lib/auth/session.ts))

**Storage**: PostgreSQL via Prisma (inalterado — apenas leitura nos server components das páginas)

**Testing**: Vitest (`npm test`) + Testing Library; padrão existente de testes de componente do dashboard (ex.: [src/components/dashboard/RsvpTable.test.tsx](../../src/components/dashboard/RsvpTable.test.tsx))

**Target Platform**: Web responsivo (mobile-first), painel administrativo autenticado

**Project Type**: Aplicação web Next.js single-project (App Router em `src/app`, libs em `src/lib`, componentes em `src/components`)

**Performance Goals**: Cada página carrega só os dados da própria seção; visão geral, cadastro manual e confirmações leem `getDashboardData`, mural lê `listRecados` — sem regressão perceptível.

**Constraints**:
- ⚠️ **Next.js 16 difere do treino** (ver [AGENTS.md](../../AGENTS.md)): antes de criar as páginas/layout, consultar em `node_modules/next/dist/docs/`:
  - `01-app/.../layouts-and-pages.md` (segmentos de rota aninhados, layouts compartilhados)
  - `03-api-reference/03-file-conventions/page.md` e `layout.md` (assinatura de `page`/`layout`, `searchParams`/`params` **assíncronos**)
  - `03-api-reference/04-functions/use-pathname.md` (item ativo no menu — Client Component)
  - `03-api-reference/02-components/link.md` (navegação client-side)
- `searchParams` é `Promise` (já tratado hoje na página única) — manter para `/dashboard/confirmacoes` (filtro `status` + busca `q`).
- Autenticação: toda rota sob `/dashboard` exige sessão válida → redirecionar para `/login` (centralizar no layout para evitar duplicação).
- Acessibilidade (Princípio 3): menu com `aria-current="page"` no item ativo; manter navegação por teclado e labels existentes.
- Links antigos com âncora (`/dashboard#confirmacoes`) não devem quebrar: caem em `/dashboard` (Visão geral) válida; a âncora é ignorada sem erro (FR + edge case).

**Scale/Scope**: Painel administrativo de baixo volume (uso interno da família); 4 rotas, reutilização de 5 componentes existentes.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Painel é interno (admin), mas separar seções melhora a clareza e o uso em dispositivos; cada seção carrega só o que precisa | ✅ Pass |
| 2. Privacidade e segurança | Checagem de sessão centralizada no layout cobre **todas** as novas rotas; nenhum dado real em código | ✅ Pass |
| 3. Acessibilidade | Menu vira `next/link` com `aria-current="page"`; navegação por teclado e labels dos formulários preservadas | ✅ Pass |
| 4. Performance e SEO | Páginas server-side leem apenas os dados da própria seção; sem JS extra relevante | ✅ Pass |
| 5. Design emocional sem excesso | Reutiliza componentes e visual atuais; só muda a navegação | ✅ Pass |
| 6. TDD/validação | Testes de componentes reutilizados continuam válidos; novo teste para o item ativo da Sidebar; `npm run build` + validação visual real das 4 rotas | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/009-dashboard-separate-pages/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Phase 0 — decisões técnicas (App Router, item ativo, auth no layout)
├── data-model.md        # Phase 1 — sem entidades novas (documenta reaproveitamento)
├── quickstart.md        # Phase 1 — como validar as 4 rotas
├── contracts/
│   └── routes.md        # Phase 1 — contrato de rotas (URLs, dados, proteção)
└── tasks.md             # Phase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
src/app/dashboard/
├── layout.tsx                      # ALTERADO: mover checagem de sessão (redirect /login) para cá; mantém <Sidebar/> + <main>
├── page.tsx                        # ALTERADO: passa a ser SÓ a "Visão geral" (cabeçalho + PresenceStats)
├── cadastro-manual/
│   └── page.tsx                    # NOVO: server component → DashboardRsvpManager
├── confirmacoes/
│   └── page.tsx                    # NOVO: server component → DashboardFilters + RsvpTable (lê searchParams status/q)
└── mural/
    └── page.tsx                    # NOVO: server component → RecadosManager

src/components/dashboard/
├── Sidebar.tsx                     # ALTERADO: next/link em vez de <a href="#...">; 4 itens; item ativo via usePathname()
└── Sidebar.test.tsx                # NOVO: testa link ativo (aria-current) por rota

# Reutilizados sem alteração de lógica:
#   PresenceStats.tsx, DashboardRsvpManager.tsx, DashboardFilters.tsx, RsvpTable.tsx, RecadosManager.tsx
```

**Structure Decision**: Single-project Next.js App Router. Cada seção vira um *route segment* aninhado sob `src/app/dashboard/`, compartilhando `layout.tsx` (Sidebar + proteção de auth). `page.tsx` da raiz vira a Visão geral (Q2=B). Componentes de seção são reaproveitados como estão; cada `page.tsx` é um Server Component que busca apenas os dados da sua seção e renderiza o componente correspondente.

## Complexity Tracking

> Sem violações de constituição. Nada a justificar.
