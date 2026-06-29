# Contrato de Rotas — Dashboard em páginas separadas

**Feature**: 009-dashboard-separate-pages | **Date**: 2026-06-29

Este é o contrato de UI/navegação (não há API nova). Define as rotas, o que cada uma exibe, a proteção e os parâmetros aceitos.

## Layout compartilhado

- **Arquivo**: `src/app/dashboard/layout.tsx`
- **Responsabilidade**: renderiza `<Sidebar/>` + `<main>`; executa `getCurrentAdminSession()` e, se ausente, `redirect('/login')`.
- **Aplica a**: todas as rotas abaixo (segmento `/dashboard` e descendentes).

## Rotas

### `GET /dashboard` — Visão geral (entrada padrão)
- **Conteúdo**: cabeçalho "Lista de presença" + `PresenceStats` (totais).
- **Dados**: `stats` de `getDashboardData({ status:'all', q:'' })`.
- **Proteção**: sessão de admin (via layout). Sem sessão → `/login`.
- **Menu ativo**: "Visão geral" (match **exato** do pathname).
- **Compat.**: alvo de links antigos `/dashboard#...` (fragmento ignorado, sem erro).

### `GET /dashboard/cadastro-manual` — Cadastro manual
- **Conteúdo**: `DashboardRsvpManager` (form adicionar/atualizar grupo).
- **Dados**: `rows` de `getDashboardData(...)` como `initialRows`.
- **Proteção**: sessão de admin. Sem sessão → `/login`.
- **Menu ativo**: "Cadastro manual".

### `GET /dashboard/confirmacoes` — Lista de confirmações
- **Conteúdo**: `DashboardFilters` + `RsvpTable`.
- **Parâmetros (query)**: `status` (`all` | filtros existentes) e `q` (busca). Lidos de `searchParams` (Promise).
- **Dados**: `rows` de `getDashboardData({ status, q })`.
- **Proteção**: sessão de admin. Sem sessão → `/login`.
- **Menu ativo**: "Lista de confirmações".
- **Deep-link**: `/dashboard/confirmacoes?status=...&q=...` recarregável e estável (FR-009).

### `GET /dashboard/mural` — Mural de recados
- **Conteúdo**: `RecadosManager`.
- **Dados**: `listRecados()` mapeado para `{ id, nome, mensagem, createdAt: ISO }`.
- **Proteção**: sessão de admin. Sem sessão → `/login`.
- **Menu ativo**: "Mural de recados" (novo item de menu — Q1=A).

## Contrato do menu (Sidebar)

```text
NAV_LINKS = [
  { href: '/dashboard',                  label: 'Visão geral',          match: 'exact'  },
  { href: '/dashboard/cadastro-manual',  label: 'Cadastro manual',      match: 'exact'  },
  { href: '/dashboard/confirmacoes',     label: 'Lista de confirmações',match: 'prefix' },
  { href: '/dashboard/mural',            label: 'Mural de recados',     match: 'exact'  },
]
```

- Usa `next/link`.
- Item ativo: comparação com `usePathname()`. `/dashboard` exige match exato (senão fica ativo em todas as subrotas). `confirmacoes` usa prefixo para permanecer ativo com query de filtro.
- Item ativo recebe estilo de destaque **e** `aria-current="page"`.
- No mobile, ao clicar em um item, o menu colapsado fecha (`close()`) e navega.

## Invariantes de teste

- Acessar cada rota autenticado mostra **apenas** o conteúdo daquela seção.
- Acessar qualquer rota sem sessão redireciona para `/login`.
- O item de menu correspondente à rota atual tem `aria-current="page"`; os demais não.
- Recarregar `/dashboard/confirmacoes?status=x&q=y` preserva filtro e busca.
