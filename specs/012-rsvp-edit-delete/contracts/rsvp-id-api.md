# Contract — `/api/rsvp/[id]`

Endpoints administrativos para operar sobre uma confirmação específica por `id`. Ambos exigem sessão de administrador válida (`getCurrentAdminSession`). Espelham o padrão de [`/api/recados/[id]`](../../../src/app/api/recados/\[id\]/route.ts).

Autenticação: cookie de sessão do admin. Sem sessão → `401 { ok: false, message: "Não autorizado." }` (nenhuma alteração de dados).

---

## DELETE `/api/rsvp/[id]`

Remove permanentemente a confirmação.

**Request**: sem corpo. `id` no path.

**Responses**

| Status | Corpo | Quando |
|--------|-------|--------|
| 200 | `{ ok: true, message: "Confirmação removida." }` | Registro existia e foi removido |
| 401 | `{ ok: false, message: "Não autorizado." }` | Sem sessão válida |
| 404 | `{ ok: false, message: "Confirmação não encontrada." }` | `id` inexistente |

Satisfaz: FR-002 (confirmação é no cliente), FR-003, FR-005, FR-013.

---

## PATCH `/api/rsvp/[id]`

Atualiza os campos editáveis da confirmação. Valida com `rsvpInputSchema`.

**Request body** (JSON):
```json
{
  "name": "Maria Silva",
  "phone": "(21) 99999-9999",
  "attendance": "sim",
  "adults": [{ "name": "Maria Silva" }],
  "children": [{ "name": "João Silva", "age": 4 }]
}
```

Campos: `name` (obrigatório), `phone` (obrigatório, formato BR), `attendance` (`"sim"|"nao"`), `adults` (≥1), `children` (opcional). `message`/`groupName` **não** aceitos (preservados).

**Responses**

| Status | Corpo | Quando |
|--------|-------|--------|
| 200 | `{ ok: true, rsvp: RsvpSummary, message: "Confirmação atualizada." }` | Sucesso |
| 400 | `{ ok: false, message: <detalhe da validação> }` | Corpo inválido (ZodError) |
| 401 | `{ ok: false, message: "Não autorizado." }` | Sem sessão válida |
| 404 | `{ ok: false, message: "Confirmação não encontrada." }` | `id` inexistente (P2025) |
| 409 | `{ ok: false, message: "Já existe uma confirmação com esse telefone." }` | `phone` colide com outro registro (P2002) |

`RsvpSummary` (retorno): `{ id, name, phone, attendance: "sim"|"nao", adults, children, total, adultsList, childrenList, createdAt, updatedAt }` — igual ao já produzido por `serializeRsvp`.

Satisfaz: FR-006 (o form busca dados atuais da própria linha já carregada), FR-007 (campos capturados), FR-008/FR-009 (validação), FR-010, FR-012 (409), FR-013.

---

## Notas de implementação

- Reusar `rsvpInputSchema` (não redefinir validação).
- `phoneNormalized` recalculado de `phone` via `normalizePhone`; o índice `@unique` garante a detecção de conflito → capturar `Prisma.PrismaClientKnownRequestError` código `P2002`.
- `id` inexistente em `update` lança `P2025`; em `delete` pode-se checar o retorno (`deleteRsvp` retorna boolean, como `deleteRecado`).
- Mensagens em pt-BR, coerentes com o restante do painel.
