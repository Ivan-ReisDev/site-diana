# Tasks: Autenticação e dashboard de presença

## Phase 1: Setup e banco

- [ ] T001 Criar branch de feature `feat/auth-dashboard-presenca` antes de implementar.
- [ ] T002 Instalar dependências `@prisma/client zod bcryptjs` e dev dependency `prisma`.
- [ ] T003 Criar `.env.example` com `DATABASE_URL`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`, `ADMIN_NAME`, `SESSION_SECRET`.
- [ ] T004 Criar `docker-compose.yml` com PostgreSQL 16 e healthcheck.
- [ ] T005 Criar `prisma/schema.prisma` com `AdminUser`, `AdminSession`, `Rsvp`.
- [ ] T006 Criar `prisma/seed.ts` para admin inicial via env.
- [ ] T007 Rodar `npx prisma migrate dev --name init_auth_dashboard` e verificar client gerado.

## Phase 2: Validação e domínio RSVP — TDD

- [ ] T008 Criar teste para normalização de telefone em `src/lib/rsvp/phone.test.ts`.
- [ ] T009 Implementar `src/lib/rsvp/phone.ts` até teste passar.
- [ ] T010 Criar teste de schema RSVP válido/inválido em `src/lib/rsvp/schema.test.ts`.
- [ ] T011 Implementar `src/lib/rsvp/schema.ts` com Zod até teste passar.
- [ ] T012 Criar teste de cálculo de métricas em `src/lib/rsvp/service.test.ts`.
- [ ] T013 Implementar funções puras de métricas em `src/lib/rsvp/service.ts`.

## Phase 3: API RSVP — TDD/integrado

- [ ] T014 Criar `src/lib/db/prisma.ts` com singleton do Prisma.
- [ ] T015 Criar teste/contrato para `POST /api/rsvp` validar payload obrigatório.
- [ ] T016 Implementar `src/app/api/rsvp/route.ts` com validação e resposta 400.
- [ ] T017 Criar teste/contrato para upsert por telefone normalizado.
- [ ] T018 Implementar persistência/upsert de RSVP.
- [ ] T019 Atualizar `src/app/InvitationSite.tsx` para enviar RSVP via `fetch('/api/rsvp')` com loading, sucesso e erro.
- [ ] T020 Atualizar teste de UI para mockar `fetch` e validar envio/feedback.

## Phase 4: Autenticação — TDD

- [ ] T021 Criar teste para hash/verify de senha em `src/lib/auth/password.test.ts`.
- [ ] T022 Implementar `src/lib/auth/password.ts` com `bcryptjs`.
- [ ] T023 Criar teste para schema de login em `src/lib/auth/schema.test.ts`.
- [ ] T024 Implementar `src/lib/auth/schema.ts`.
- [ ] T025 Criar teste para criação/expiração de sessão em `src/lib/auth/session.test.ts` onde viável.
- [ ] T026 Implementar `src/lib/auth/session.ts` com token opaco, hash no banco e cookie HttpOnly.
- [ ] T027 Criar `src/app/api/auth/login/route.ts`.
- [ ] T028 Criar `src/app/api/auth/logout/route.ts`.

## Phase 5: Login e dashboard

- [ ] T029 Criar `src/app/login/page.tsx` com formulário acessível e feedback de erro.
- [ ] T030 Criar teste de renderização do login.
- [ ] T031 Criar `src/app/dashboard/page.tsx` protegida por sessão server-side.
- [ ] T032 Criar `src/components/dashboard/PresenceStats.tsx`.
- [ ] T033 Criar `src/components/dashboard/DashboardFilters.tsx` com query params `status` e `q`.
- [ ] T034 Criar `src/components/dashboard/RsvpTable.tsx` responsiva.
- [ ] T035 Criar teste de componentes para cards/lista com dados fake.
- [ ] T036 Garantir redirecionamento de `/dashboard` para `/login` sem sessão.

## Phase 6: Integração, documentação e validação

- [ ] T037 Atualizar `README.md` com setup de banco, env, migrations, seed e dashboard.
- [ ] T038 Rodar `npm test`.
- [ ] T039 Rodar `npm run lint`.
- [ ] T040 Rodar `npm run build`.
- [ ] T041 Subir banco com `docker compose up -d db` e rodar migrations/seed.
- [ ] T042 Validar fluxo real no browser: RSVP público → login → dashboard → filtros → logout.
- [ ] T043 Capturar evidências visuais mobile/desktop, evitando expor telefones reais.

## Ordem de implementação recomendada

Seguir fases na ordem. Não implementar dashboard antes de autenticação e persistência RSVP. Em cada task de código: escrever teste primeiro, rodar falhando, implementar mínimo, rodar passando e só então refatorar.
