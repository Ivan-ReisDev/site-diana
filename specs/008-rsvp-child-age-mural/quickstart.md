# Quickstart — Feature 008

## Pré-requisitos

- `DATABASE_URL` configurada (PostgreSQL).
- Dependências instaladas (`npm install`).

## Migração de banco (novo model Recado)

```bash
# após adicionar o model Recado em prisma/schema.prisma
npm run db:migrate    # prisma migrate dev — cria a migration do Recado
npm run db:generate   # regenera o client
```

## Desenvolvimento

```bash
npm run dev           # http://localhost:3000
```

- Página do convite: `/` — seção "Mural" (`#mural`) e seção de confirmação de presença.
- Painel admin: `/dashboard` (requer login em `/login`) — seção de moderação de recados.

## Validação manual (aceitação)

### RSVP — idade só de criança
1. Abrir `/`, ir à confirmação de presença.
2. Conferir que **adultos não têm campo de idade**; **crianças têm**.
3. Adicionar criança sem idade → envio bloqueado com mensagem.
4. Preencher corretamente e enviar → confirmação registrada; checar `/dashboard` (adultos sem idade, crianças com idade).

### Mural de Recados
1. Enviar um recado (nome + mensagem) → aparece na hora com confirmação.
2. **Recarregar a página** → recado continua visível.
3. Abrir em outro navegador/aba anônima → recado visível.
4. Enviar com nome ou mensagem vazios → bloqueado.
5. Enviar > 5 recados em poucos minutos → bloqueio por rate limit (429).
6. Em `/dashboard`, remover um recado → some do mural público.

## Testes e build

```bash
npm test              # vitest — schema, service, rotas, rate-limit
npm run build         # build de produção (validação obrigatória)
```

## Arquivos-chave a tocar

- `prisma/schema.prisma` (+ migration)
- `src/lib/recados/{schema,service,rate-limit}.ts` (+ testes)
- `src/app/api/recados/route.ts`, `src/app/api/recados/[id]/route.ts` (+ testes)
- `src/lib/rsvp/{schema,service}.ts` (adulto sem idade) + testes
- `src/app/api/rsvp/route.ts` (mensagens de validação)
- `src/app/InvitationSite.tsx` (remover idade de adulto; mural via API)
- `src/components/dashboard/RecadosManager.tsx` + `src/app/dashboard/page.tsx`

> ⚠️ Antes de escrever route handlers, ler os docs do Next 16 em
> `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`
> e `.../03-api-reference/03-file-conventions/{route,dynamic-routes}.md`.
