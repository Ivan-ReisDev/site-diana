# Research — Dashboard em páginas separadas

**Feature**: 009-dashboard-separate-pages | **Date**: 2026-06-29

Não há `NEEDS CLARIFICATION` técnicos pendentes (as 2 clarificações de escopo foram resolvidas no spec: Q1=A, Q2=B). Este documento registra as decisões técnicas para a reorganização.

## Decisão 1: Estrutura de rotas via App Router (route segments aninhados)

- **Decisão**: Criar segmentos `cadastro-manual/`, `confirmacoes/` e `mural/` sob `src/app/dashboard/`, cada um com seu `page.tsx`. A raiz `src/app/dashboard/page.tsx` passa a ser a Visão geral.
- **Rationale**: O App Router já compartilha `layout.tsx` entre o segmento pai e os filhos automaticamente — a Sidebar e o `<main>` continuam envolvendo todas as páginas sem duplicação. Q2=B evita um redirect na raiz.
- **Alternativas consideradas**:
  - Route groups `(secao)` — desnecessário, não há divergência de layout entre seções.
  - Query param `?secao=` numa única página — mantém o acoplamento atual e não dá deep-link limpo; rejeitado.
  - Rotas paralelas/`@slot` — overkill para navegação sequencial simples.
- **Ação Next 16**: confirmar em `node_modules/next/dist/docs/.../layouts-and-pages.md` que layouts aninhados aplicam ao segmento e descendentes.

## Decisão 2: Autenticação centralizada no layout

- **Decisão**: Mover `getCurrentAdminSession()` + `redirect('/login')` para `src/app/dashboard/layout.tsx` (Server Component async), cobrindo todas as rotas filhas. Cada `page.tsx` foca apenas em buscar dados da seção.
- **Rationale**: Hoje a checagem vive em `page.tsx`. Sem mover, cada nova página precisaria repetir o guard, com risco de esquecer e expor dados. O layout é o ponto único que envolve todos os segmentos.
- **Alternativas consideradas**:
  - Repetir o guard em cada `page.tsx` — funciona, mas duplicado e propenso a erro; rejeitado em favor do layout.
  - Middleware (`middleware.ts`) — mais robusto, porém a sessão atual é lida via helper de cookies/DB no server; manter o padrão existente reduz risco. Pode ser evolução futura.
- **Ação Next 16**: confirmar em `.../file-conventions/layout.md` que `layout` pode ser `async` e usar `redirect()`.

## Decisão 3: Item ativo no menu via `usePathname()`

- **Decisão**: `Sidebar` (já é `"use client"`) usa `usePathname()` para marcar o item da rota atual com estilo ativo e `aria-current="page"`. Links viram `next/link`.
- **Rationale**: Navegação client-side sem reload completo; `usePathname` é a API canônica para destacar a rota atual. `aria-current` atende ao Princípio 3 (acessibilidade).
- **Detalhe de correspondência**: a Visão geral (`/dashboard`) precisa de match exato (não-prefixo), senão ficaria ativa em todas as subrotas. As subrotas usam comparação direta de pathname.
- **Alternativas consideradas**: `useSelectedLayoutSegment()` — também válido; `usePathname` é mais explícito para 4 rotas fixas.

## Decisão 4: Preservar filtros/busca em `/dashboard/confirmacoes`

- **Decisão**: A página de confirmações continua lendo `searchParams` (`status`, `q`) — agora no escopo da própria rota. `DashboardFilters` e `RsvpTable` são reusados sem alteração de lógica.
- **Rationale**: O comportamento de filtro/busca já existe na página única; mover para a rota dedicada mantém deep-link de filtros (`/dashboard/confirmacoes?status=...&q=...`) e recarregamento estável (FR-009).
- **Ação Next 16**: `searchParams` é `Promise` — manter o `await` já usado hoje.

## Decisão 5: Compatibilidade com âncoras antigas

- **Decisão**: Não criar redirects de âncora. Links antigos `/dashboard#confirmacoes` resolvem para `/dashboard` (Visão geral); o fragmento `#confirmacoes` é ignorado pelo navegador sem erro.
- **Rationale**: Fragmentos (`#`) não são enviados ao servidor; não há como redirecionar server-side de forma confiável e não vale JS de compatibilidade para um painel interno. A Visão geral é um destino válido (atende ao edge case sem tela quebrada).
- **Alternativas consideradas**: script client que lê `location.hash` e faz `router.push` para a subrota equivalente — complexidade desnecessária para uso interno; rejeitado.

## Riscos / Notas

- Garantir que mover o guard de auth para o layout não altere o comportamento de `redirect` (o `layout` async roda no server antes das páginas).
- Testes existentes dos componentes (`RsvpTable`, `DashboardRsvpManager`, etc.) permanecem válidos pois a lógica interna não muda.
- Validação visual obrigatória (Princípio 6) das 4 rotas em desktop e mobile, incluindo o menu colapsado fechando ao navegar.
