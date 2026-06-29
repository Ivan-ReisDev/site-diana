# Phase 0 — Research: Ajuste de idade no RSVP e Mural de Recados persistente

Todas as ambiguidades de produto foram resolvidas em `/speckit-clarify` (ver seção Clarifications da spec). Este documento registra as decisões técnicas.

## D1 — Separar schema de adulto (sem idade) e criança (com idade)

- **Decisão**: Criar `rsvpAdultSchema` (apenas `name`) e manter `rsvpChildSchema`/`rsvpGuestSchema` com `name` + `age`. `rsvpInputSchema.adults` passa a usar o schema de adulto.
- **Rationale**: A regra de negócio diverge entre adulto e criança; um único `rsvpGuestSchema` com idade obrigatória força idade em adultos. Schemas distintos deixam a validação explícita e testável (FR-001, FR-003, FR-004).
- **Tratamento de dados antigos**: `parseStoredParticipants` no service usa `safeParse` com fallback; para adultos antigos com `age`, o campo extra é simplesmente ignorado na serialização (não exibido). Garante FR-005 sem migração obrigatória.
- **Alternativas consideradas**: (a) Tornar `age` opcional no schema único — rejeitado por enfraquecer a validação da idade da criança; (b) Migrar dados antigos removendo `age` de adultos — desnecessário para o objetivo e adiciona risco.

## D2 — Persistência do Mural com novo model Prisma `Recado`

- **Decisão**: Novo model `Recado` (id, nome, mensagem, createdAt) + migration. Service `src/lib/recados/service.ts` com `listRecados`, `createRecado`, `deleteRecado`, espelhando o padrão de `src/lib/rsvp/service.ts` (injeção de `PrismaClient` para testes).
- **Rationale**: Reaproveita a infraestrutura Prisma/pg já existente ([prisma.ts](../../src/lib/db/prisma.ts)) e o padrão de service testável da base. Cumpre FR-006/FR-007.
- **Alternativas consideradas**: Reusar o campo `message` do model `Rsvp` — rejeitado: recado é entidade independente do RSVP (autor pode não ter confirmado presença) e tem ciclo de vida próprio.

## D3 — Endpoints REST e carregamento na página

- **Decisão**:
  - `POST /api/recados` cria recado (valida nome+mensagem, limite 240, aplica rate limit).
  - `GET /api/recados` lista recados ordenados por `createdAt desc`.
  - `DELETE /api/recados/[id]` remove recado — exige sessão admin (`getCurrentAdminSession`).
  - Página do convite (`InvitationSite`, client) carrega recados via `GET` no mount; alternativamente `page.tsx` (server) busca os recados iniciais e passa por props para evitar flash. **Decisão**: carregar via `GET` no client no mount (mantém `InvitationSite` como client component sem refatorar `page.tsx`), com estado de loading/erro.
- **Rationale**: Segue o padrão já usado para o RSVP (client component + `fetch` para `/api/rsvp`). Mantém mudanças localizadas.
- **Constraint Next 16**: Route handler de listagem precisa ser **dinâmico** (sem cache) para refletir recados novos. Em rota dinâmica `[id]`, `params` é `Promise` — `await params`. Consultar `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`, `.../03-api-reference/03-file-conventions/route.md` e `dynamic-routes.md` antes de implementar.
- **Alternativas consideradas**: Server Actions — rejeitado por consistência com o padrão de API atual do projeto e para manter testes de rota no mesmo estilo.

## D4 — Rate limiting por dispositivo

- **Decisão**: Limite simples por dispositivo no `POST /api/recados`: combinação de (a) identificador de cliente derivado do IP (`x-forwarded-for` / IP da requisição) e (b) janela de tempo. Implementar em `src/lib/recados/rate-limit.ts` com store em memória (Map) por processo. **Parâmetros**: máx. **5 recados por 10 minutos** por dispositivo (default ajustável por env).
- **Rationale**: Escala do projeto é pequena; um limitador em memória é suficiente e sem dependência nova. Cumpre FR-014/SC-006. Validação básica (campos obrigatórios, 240 chars, anti-duplo-clique no client) cobre o resto.
- **Limitação aceita**: store em memória não é compartilhado entre instâncias/reinícios. Para este convite (instância única) é adequado; documentado como tradeoff. Se no futuro houver múltiplas instâncias, migrar para limite baseado em banco (contar recados por janela) ou cache externo.
- **Alternativas consideradas**: (a) Rate limit por banco (contar `createdAt` recentes do mesmo IP) — mais robusto porém exige guardar IP (dado pessoal) e mais queries; mantido como evolução futura. (b) Honeypot anti-bot — não escolhido pelo usuário.

## D5 — Moderação no painel admin existente

- **Decisão**: Adicionar seção/`RecadosManager` no `dashboard/page.tsx` (já protegido por `getCurrentAdminSession`), listando recados com botão remover que chama `DELETE /api/recados/[id]`.
- **Rationale**: Reaproveita login/sessão e layout do dashboard (FR-013). Sem nova área nem novo fluxo de auth.
- **Alternativas consideradas**: Página separada de moderação — rejeitado por duplicar guard/layout sem ganho.

## D6 — Estratégia de testes

- **Decisão**: Testes Vitest para: `recados/schema` (validação e limite 240), `recados/service` (CRUD com Prisma mockado), `recados/rate-limit` (bloqueio após N), `api/recados/route` e `api/recados/[id]/route` (mock do service + checagem de auth no DELETE), e ajuste dos testes de `rsvp/schema`/`rsvp/service` para adultos sem idade. Validação final: `npm test` + `npm run build` + verificação visual.
- **Rationale**: Espelha o padrão existente ([route.test.ts](../../src/app/api/rsvp/route.test.ts)) e o princípio 6 da constituição (TDD/validação).

**Output**: Nenhum NEEDS CLARIFICATION pendente. Pronto para Phase 1.
