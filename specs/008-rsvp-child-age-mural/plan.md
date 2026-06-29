# Implementation Plan: Ajuste de idade no RSVP e Mural de Recados persistente

**Branch**: `008-rsvp-child-age-mural` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `specs/008-rsvp-child-age-mural/spec.md`

## Summary

Duas mudanças no convite:

1. **RSVP — idade só para crianças**: remover o campo de idade dos adultos no formulário público de confirmação de presença e na criação manual do painel; manter idade obrigatória apenas para crianças. Ajustar schema de validação, serviço de persistência e exibições (painel e cartão de confirmação), tratando confirmações antigas que ainda tenham idade de adultos sem quebrar.

2. **Mural de Recados persistente**: substituir o estado em memória por persistência no banco. Novo modelo Prisma `Recado`, endpoint REST (`GET`/`POST /api/recados`) para listar e criar, endpoint admin (`DELETE /api/recados/[id]`) protegido por sessão, rate limiting por dispositivo no envio, e seção de moderação no painel administrativo existente. Os recados aparecem instantaneamente (sem aprovação prévia) e a página passa a carregar os recados salvos.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2, Next.js 16.2.7 (App Router)

**Primary Dependencies**: Prisma 7.8 + `@prisma/adapter-pg`, Zod 4, framer-motion, lucide-react, bcryptjs (auth já existente)

**Storage**: PostgreSQL via Prisma (`getPrismaClient()` em [src/lib/db/prisma.ts](../../src/lib/db/prisma.ts))

**Testing**: Vitest (`npm test`) + Testing Library; padrão de teste de rota com `vi.mock` do service (ver [src/app/api/rsvp/route.test.ts](../../src/app/api/rsvp/route.test.ts))

**Target Platform**: Web responsivo (navegadores modernos, mobile-first)

**Project Type**: Aplicação web Next.js single-project (App Router em `src/app`, libs em `src/lib`, componentes em `src/components`)

**Performance Goals**: Mural não deve atrasar o carregamento da página do convite; listagem de recados em volume pequeno (dezenas a poucas centenas)

**Constraints**:
- ⚠️ **Next.js 16 difere do treino** (ver [AGENTS.md](../../AGENTS.md)): consultar `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md` e `.../03-api-reference/03-file-conventions/route.md` e `dynamic-routes.md` antes de escrever route handlers. Em particular: `params` de rota dinâmica é assíncrono (`Promise`), e o caching padrão de Route Handlers/`fetch` mudou — a listagem do mural precisa ser dinâmica (sem cache estático) para refletir recados novos.
- Acessibilidade: inputs com `label` (manter para idade de criança e campos do mural).
- Privacidade: deleção de recado restrita a admin autenticado; dados de RSVP continuam sensíveis.

**Scale/Scope**: Convite de aniversário de 1 ano — público familiar limitado; baixo volume de escrita.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Remover idade de adulto reduz atrito; mural persistente cumpre a promessa "aparece para sempre" | ✅ Pass |
| 2. Privacidade e segurança | Deleção de recado só por admin autenticado (sessão existente); rate limiting por dispositivo contra spam; sem dados reais em código | ✅ Pass |
| 3. Acessibilidade | Mantém `label` nos campos (idade de criança, nome/mensagem do mural); estados de erro/vazio com texto | ✅ Pass |
| 4. Performance e SEO | Listagem do mural leve; carregamento não bloqueia a página principal | ✅ Pass |
| 5. Design emocional sem excesso | Reutiliza o visual atual do mural e do formulário, sem novos elementos pesados | ✅ Pass |
| 6. TDD/validação | Testes Vitest para schema, service e rotas novas; `npm run build` + validação visual | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/008-rsvp-child-age-mural/
├── plan.md              # Este arquivo
├── research.md          # Phase 0 — decisões técnicas
├── data-model.md        # Phase 1 — modelo de dados
├── quickstart.md        # Phase 1 — como rodar/validar
├── contracts/           # Phase 1 — contratos de API
│   ├── recados-api.md
│   └── rsvp-schema-change.md
└── checklists/
    └── requirements.md  # Criado no /speckit-specify
```

### Source Code (repository root)

```text
prisma/
├── schema.prisma                     # + model Recado
└── migrations/<novo>/                # + migration do Recado

src/
├── app/
│   ├── page.tsx                      # (opcional) carregar recados iniciais via server
│   ├── InvitationSite.tsx           # remove idade do adulto; mural via API
│   ├── dashboard/page.tsx           # + seção de moderação de recados
│   └── api/
│       ├── rsvp/route.ts            # ajusta validação (sem idade de adulto)
│       └── recados/
│           ├── route.ts            # GET (listar) + POST (criar) [+ route.test.ts]
│           └── [id]/route.ts       # DELETE admin [+ route.test.ts]
├── components/
│   ├── invitation/
│   │   └── MuralRecados.tsx        # (extração opcional do mural para componente)
│   └── dashboard/
│       └── RecadosManager.tsx      # lista + remover recados (admin)
└── lib/
    ├── rsvp/
    │   ├── schema.ts               # rsvpAdultSchema (só nome) vs rsvpChildSchema (nome+idade)
    │   └── service.ts              # ajusta build/serialize p/ adultos sem idade
    └── recados/
        ├── schema.ts              # zod do recado (nome, mensagem<=240)
        ├── service.ts             # listRecados/createRecado/deleteRecado [+ tests]
        └── rate-limit.ts          # rate limiting por dispositivo [+ test]
```

**Structure Decision**: Single-project Next.js App Router já existente. As novas libs seguem o padrão de `src/lib/rsvp` (schema + service + testes), e os route handlers seguem o padrão de `src/app/api/rsvp`. A moderação reaproveita o dashboard e a sessão admin já existentes.

## Complexity Tracking

> Sem violações constitucionais — seção não aplicável.
