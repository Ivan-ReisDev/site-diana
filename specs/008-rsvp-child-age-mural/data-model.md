# Phase 1 — Data Model

## Entidade: Recado (nova)

Mensagem deixada por um visitante no Mural de Recados, persistida no PostgreSQL.

### Prisma model

```prisma
model Recado {
  id        String   @id @default(cuid())
  nome      String
  mensagem  String
  createdAt DateTime @default(now())

  @@index([createdAt])
}
```

### Campos

| Campo | Tipo | Regras | Origem (FR) |
|-------|------|--------|-------------|
| `id` | String (cuid) | PK gerada | — |
| `nome` | String | obrigatório, `trim`, não vazio | FR-008 |
| `mensagem` | String | obrigatório, `trim`, não vazio, **máx. 240 caracteres** | FR-008, FR-009 |
| `createdAt` | DateTime | default `now()`; usado para ordenação | FR-010 |

### Validação (Zod — `src/lib/recados/schema.ts`)

```text
recadoInputSchema = {
  nome:     string.trim().min(1, "Informe seu nome.")
  mensagem: string.trim().min(1, "Escreva uma mensagem.").max(240, "Máximo de 240 caracteres.")
}
```

### Ordenação / consultas

- Listagem pública e admin: `orderBy: { createdAt: 'desc' }` (mais recentes primeiro — FR-010).

### Ciclo de vida

- **Criar**: visitante envia → validação → rate limit por dispositivo (FR-014) → persiste → aparece imediatamente (FR-015).
- **Listar**: qualquer visitante (público).
- **Remover**: somente admin autenticado (FR-013) via `DELETE /api/recados/[id]`.
- Sem estado de aprovação (publicação instantânea, decisão de clarificação).

---

## Entidade: RSVP / Participantes (alteração)

Sem mudança de schema no banco (`participants` é `Json`). Muda a **forma** dos adultos persistidos e validados.

### Antes → Depois

| Item | Antes | Depois |
|------|-------|--------|
| Adulto | `{ name, age }` | `{ name }` (sem idade) |
| Criança | `{ name, age }` | `{ name, age }` (inalterado) |

### Validação (Zod — `src/lib/rsvp/schema.ts`)

```text
rsvpAdultSchema = { name: string.trim().min(1, "Informe o nome completo.") }
rsvpChildSchema = { name: string.trim().min(1, "..."), age: coerce.number.int().min(0).max(120) }

rsvpInputSchema = {
  name, phone, attendance,
  adults:   array(rsvpAdultSchema).min(1),
  children: array(rsvpChildSchema).default([]),
}
```

### Compatibilidade com dados antigos

- `participantsSchema` no service usa `safeParse`; adultos antigos com campo `age` têm o campo ignorado na serialização (não exibido). Nenhuma migração de dados obrigatória (FR-005).
- Contadores `adults`/`children` no model `Rsvp` permanecem baseados no tamanho das listas.

### Persistência (`buildRsvpMutation`)

- `participants: { adults: [{name}], children: [{name, age}] }`.
- `adults: parsed.adults.length`, `children: parsed.children.length` (inalterado).
