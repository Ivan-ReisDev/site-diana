# Phase 0 — Research: Excluir e editar confirmações

Decisões técnicas para resolver os pontos abertos antes do design. Todas baseadas no código existente do projeto (não há incógnitas de tecnologia — stack já definida).

## D1 — Endpoint por `id` para excluir e editar

**Decision**: Criar `src/app/api/rsvp/[id]/route.ts` com handlers `DELETE` e `PATCH`, ambos protegidos por `getCurrentAdminSession()`.

**Rationale**: Já existe o padrão exato em [recados/[id]/route.ts](../../src/app/api/recados/\[id\]/route.ts): verifica sessão → 401 se ausente; extrai `id` de `ctx.params` (Promise); retorna 404 quando o registro não existe. A rota `POST /api/rsvp` atual é upsert por telefone e não serve para operar sobre um registro específico por `id` (nem para excluir). Reusar o padrão mantém consistência e cobre FR-003, FR-005, FR-010, FR-013.

**Alternatives considered**:
- *Server Actions*: o painel já padroniza mutação por `fetch` + `router.refresh()` ([DashboardRsvpManager](../../src/components/dashboard/DashboardRsvpManager.tsx)); manter Route Handlers evita misturar dois estilos.
- *Estender `POST /api/rsvp`*: sobrecarregaria a rota de upsert público com operações administrativas por id — pior separação de responsabilidades e de autorização.

## D2 — Atualização por `id` vs. upsert por telefone (conflito de unicidade)

**Decision**: `updateRsvp(id, input)` faz `db.rsvp.update({ where: { id }, data: {...} })` incluindo o novo `phoneNormalized`. Tratar erros do Prisma: `P2025` (registro não encontrado) → 404; `P2002` (violação de unique em `phoneNormalized`) → 409 com mensagem de conflito. Validar `input` com `rsvpInputSchema` antes.

**Rationale**: O modelo `Rsvp` tem `phoneNormalized @unique`. Editar por `id` (e não por telefone) é necessário porque o telefone pode ser justamente o campo corrigido. Se o novo telefone colidir com outro registro, o banco rejeita com `P2002`, satisfazendo FR-012 (não sobrescrever/duplicar). `upsertRsvp` por telefone **não** serve para edição: se o admin corrige o telefone, um upsert criaria/atualizaria o registro errado. Reutilizar `rsvpInputSchema` garante FR-008 (mesma validação do cadastro).

**Alternatives considered**:
- *Checar conflito manualmente antes do update* (findFirst por phoneNormalized ≠ id): possível, mas duplicaria a garantia que o índice único já dá; ainda assim o handler deve tratar `P2002` para corrida. Optou-se por confiar no índice + tratar `P2002` (mais simples e correto sob concorrência).

## D3 — Campo `message`/`groupName` na edição (reconciliação com FR-007)

**Decision**: O formulário de edição cobre exatamente os campos capturados hoje: **nome, telefone, presença, adultos, crianças (com idade)**. `message` e `groupName` **não** são editáveis; `updateRsvp` não os toca (preserva o valor atual).

**Rationale**: FR-007 cita "recado/mensagem", mas a análise do código mostra que **nenhum** fluxo captura `message` ou `groupName`: `rsvpInputSchema` não os inclui e `buildRsvpMutation` fixa `message: null` e `groupName: null` tanto no cadastro manual quanto no RSVP público. `RsvpSummary` (serialização exposta à lista) sequer inclui `message`. Adicionar edição de `message` seria introduzir um campo novo em toda a cadeia (form público, schema, serialização) — fora do escopo e contra a Assumption "mesmo conjunto de campos do cadastro manual". A intenção central do usuário ("corrigir o que o convidado preencheu errado") é plenamente atendida pelos campos que o convidado realmente preenche.

**Impact on spec**: FR-007 deve ser lido como "os campos que o convidado efetivamente preenche" (nome, telefone, presença, adultos, crianças). Registrado como divergência conhecida; nenhuma coluna nova é adicionada.

**Alternatives considered**:
- *Incluir `message` no schema e formulários*: rejeitado — expande escopo para o formulário público e migração de comportamento, sem pedido explícito e sem dado existente.

## D4 — Exclusão permanente com confirmação (sem undo)

**Decision**: `deleteRsvp(id)` faz hard delete e retorna boolean (encontrado/removido), espelhando `deleteRecado`. A UI exige confirmação explícita via diálogo antes de chamar `DELETE`.

**Rationale**: Consistente com o padrão de `recados` (Assumption da spec). FR-002 exige confirmação explícita; um diálogo acessível cobre isso e SC-003 (nenhuma exclusão em clique único). Sem soft delete/lixeira — não há requisito e o modelo não tem coluna para isso.

**Alternatives considered**:
- *`window.confirm`*: funcional e simples, mas o Princípio 3 (acessibilidade) e o 5 (design) favorecem um `ConfirmDialog` estilizado com foco gerenciável e paleta do painel. Optou-se por um componente `ConfirmDialog` reutilizável.

## D5 — Atualização da lista após a ação (client islands)

**Decision**: `RsvpTable` continua Server Component; as ações ficam em componentes client por linha (`RsvpRowActions`) que, após sucesso, chamam `router.refresh()` para revalidar os dados do servidor (lista + estatísticas).

**Rationale**: Padrão já usado em `DashboardRsvpManager` (fetch → `router.refresh()`). Garante FR-004/FR-011 (recalcular estatísticas) e FR-016 (preservar filtros/busca, pois a URL com `status`/`q` é mantida na revalidação) e SC-004 (sem reload manual).

**Alternatives considered**:
- *Estado otimista local*: mais complexo e arriscado para estatísticas derivadas; `router.refresh()` recomputa tudo do servidor de forma simples e correta.

## Resumo

Nenhum `NEEDS CLARIFICATION` pendente. Todas as decisões reutilizam padrões existentes (recados/[id], rsvpInputSchema, FormField/Button, fetch+router.refresh). Nenhuma dependência ou migração de banco nova.
