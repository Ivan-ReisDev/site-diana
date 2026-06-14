# Plano técnico: Autenticação e dashboard de presença

## Technical Context

- Projeto atual: Next.js App Router, TypeScript, Tailwind CSS 4, React 19, Vitest.
- Persistência proposta: PostgreSQL.
- ORM proposto: Prisma.
- Autenticação proposta: credenciais administrativas com senha hash + sessão via cookie HttpOnly persistida no banco.
- Validação: Zod nos payloads de login e RSVP.
- Testes: Vitest para validações/helpers; testes de componentes para estados principais; validação manual/browser após build.

## Constitution Check

- **Valor para convidados primeiro**: RSVP público continua simples e sem conta.
- **Privacidade e segurança**: dashboard privada, senha com hash, cookie HttpOnly, sem dados em páginas públicas.
- **Acessibilidade**: login, formulário e dashboard com labels, foco e mensagens claras.
- **Performance e SEO**: dashboard server-rendered e consultas simples com índices.
- **Design emocional sem excesso**: convite mantém identidade atual; dashboard deve ser clara e discreta.
- **TDD/validação**: cada comportamento novo começa por teste; build e validação real obrigatórios.

## Arquitetura proposta

### Banco e Prisma

- Criar `prisma/schema.prisma` com modelos `AdminUser`, `AdminSession`, `Rsvp`.
- Criar `src/lib/db/prisma.ts` com singleton de Prisma Client.
- Criar migrations Prisma e script de seed para admin inicial.
- Adicionar Docker Compose com PostgreSQL local.

### Domínio RSVP

- Extrair validação para `src/lib/rsvp/schema.ts`.
- Criar normalização de telefone em `src/lib/rsvp/phone.ts`.
- Criar serviço `src/lib/rsvp/service.ts` para upsert e métricas.
- Criar endpoint `src/app/api/rsvp/route.ts`.
- Ajustar `src/app/InvitationSite.tsx` para submeter via API e exibir estados de carregamento/erro/sucesso.

### Autenticação

- Criar validação em `src/lib/auth/schema.ts`.
- Criar hash/verify de senha em `src/lib/auth/password.ts`.
- Criar sessão em `src/lib/auth/session.ts` usando cookies do Next no servidor.
- Criar `src/app/login/page.tsx` e endpoint/action de login.
- Criar endpoint/action de logout.
- Proteger dashboard por verificação server-side da sessão.

### Dashboard

- Criar `src/app/dashboard/page.tsx` como Server Component.
- Criar componentes em `src/components/dashboard/` para cards, filtros e lista.
- Suportar query params `status` e `q`.
- Exibir métricas e RSVPs sem vazar senha/token.

## Dependências planejadas

Produção:
- `@prisma/client`
- `zod`
- `bcryptjs`

Dev:
- `prisma`

## Variáveis de ambiente planejadas

- `DATABASE_URL="postgresql://site_diana:site_diana@localhost:5432/site_diana?schema=public"`
- `ADMIN_EMAIL="..."`
- `ADMIN_PASSWORD="..."`
- `ADMIN_NAME="..."`
- `SESSION_SECRET="..."`

## Arquivos prováveis

Criar:
- `docker-compose.yml`
- `.env.example`
- `prisma/schema.prisma`
- `prisma/seed.ts`
- `src/lib/db/prisma.ts`
- `src/lib/rsvp/schema.ts`
- `src/lib/rsvp/phone.ts`
- `src/lib/rsvp/service.ts`
- `src/lib/auth/schema.ts`
- `src/lib/auth/password.ts`
- `src/lib/auth/session.ts`
- `src/app/api/rsvp/route.ts`
- `src/app/api/auth/login/route.ts`
- `src/app/api/auth/logout/route.ts`
- `src/app/login/page.tsx`
- `src/app/dashboard/page.tsx`
- `src/components/dashboard/PresenceStats.tsx`
- `src/components/dashboard/RsvpTable.tsx`
- `src/components/dashboard/DashboardFilters.tsx`

Modificar:
- `package.json`
- `src/app/InvitationSite.tsx`
- `src/app/page.test.tsx`
- `README.md`

## Validação planejada

- `npm test`
- `npm run lint`
- `npm run build`
- `docker compose up -d db`
- `npx prisma migrate dev`
- `npx prisma db seed`
- Teste manual/browser:
  1. abrir convite;
  2. enviar RSVP;
  3. acessar `/dashboard` sem sessão e confirmar redirect;
  4. login com admin;
  5. verificar RSVP e métricas;
  6. testar filtro/busca;
  7. logout e bloqueio da dashboard.

## Riscos e mitigação

- **Next.js 16 tem mudanças de API**: consultar docs locais em `node_modules/next/dist/docs/` antes de mexer em rotas, cookies e server components.
- **Banco local indisponível**: usar Docker Compose e healthcheck.
- **Vazamento de dados pessoais**: evitar prints públicos da dashboard com telefones; mascarar se for compartilhar.
- **Duplicidade por telefone formatado diferente**: normalizar para dígitos antes de upsert.
- **Senha fraca em produção**: seed deve exigir env explícita e não commitar credenciais reais.
