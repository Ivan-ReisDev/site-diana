# Phase 1 — Data Model: Excluir e editar confirmações

Nenhuma mudança de schema. As operações usam o modelo `Rsvp` existente ([prisma/schema.prisma](../../prisma/schema.prisma)).

## Entidade: Rsvp (existente)

| Campo | Tipo | Editável nesta feature? | Observação |
|-------|------|--------------------------|------------|
| `id` | String (cuid) | não (identificador) | Alvo das operações DELETE/PATCH |
| `name` | String | **sim** | Obrigatório (`min(1)`) |
| `groupName` | String? | não | Não capturado em nenhum fluxo; preservado |
| `phone` | String | **sim** | Formato mascarado `(21) 99999-9999` |
| `phoneNormalized` | String @unique | derivado | Recalculado de `phone` via `normalizePhone`; unicidade impede duplicar (FR-012) |
| `attendance` | Attendance (YES/NO) | **sim** | Mapeado de `'sim'`/`'nao'` |
| `adults` | Int | derivado | `= adults.length` |
| `children` | Int | derivado | `= children.length` |
| `participants` | Json | **sim** | `{ adults: [{name}], children: [{name, age}] }` |
| `message` | String? | não | Não capturado; preservado (ver research D3) |
| `createdAt` | DateTime | não | |
| `updatedAt` | DateTime | automático | `@updatedAt` — muda a cada edição |

## Regras de validação (reusadas de `rsvpInputSchema`)

- `name`: string, `trim`, `min(1)`.
- `phone`: `phoneSchema` (formato de telefone BR).
- `attendance`: `'sim' | 'nao'` (default `'sim'`).
- `adults`: array de `{ name: min(1) }`, **`min(1)`** (pelo menos um adulto).
- `children`: array de `{ name: min(1), age: int 0..120 }`, opcional (default `[]`).

Estas mesmas regras já governam o cadastro manual e o RSVP público → consistência garantida (FR-008).

## Transições de estado das operações

### deleteRsvp(id)
```
existe(id) ──DELETE──▶ removido (retorna true)  → lista atualizada, estatísticas recalculadas
não existe ──DELETE──▶ noop     (retorna false) → 404 "não encontrado"
```

### updateRsvp(id, input)
```
input inválido ─────────────▶ ZodError            → 400 (não salva)
id inexistente ─────────────▶ Prisma P2025        → 404 "não encontrado"
phone colide c/ outro id ───▶ Prisma P2002        → 409 "telefone já cadastrado"
válido e sem conflito ──────▶ registro atualizado → 200 + RsvpSummary; updatedAt renovado
```

## Estatísticas derivadas (existente: `calculatePresenceStats`)

Não é entidade persistida — recomputada a partir das linhas atuais após cada operação (via `getDashboardData` no reload do Server Component). Excluir/editar altera automaticamente:
- grupos confirmados/recusados (se `attendance` mudou ou registro saiu);
- adultos/crianças/total confirmados (se contagens mudaram).

Cobre FR-004 e FR-011.
