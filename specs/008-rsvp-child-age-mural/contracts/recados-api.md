# Contract: API do Mural de Recados

> ⚠️ Next.js 16 — consultar `node_modules/next/dist/docs/01-app/01-getting-started/15-route-handlers.md`,
> `.../03-api-reference/03-file-conventions/route.md` e `dynamic-routes.md` antes de implementar.
> Rota dinâmica `[id]`: `params` é `Promise` (`const { id } = await params`).
> Listagem deve ser dinâmica (sem cache estático) para refletir recados novos.

## `GET /api/recados`

Lista os recados publicados (público, sem autenticação). Ordenado por `createdAt desc`.

**Response 200**
```json
{
  "ok": true,
  "recados": [
    { "id": "ckxyz...", "nome": "Tia Ana", "mensagem": "Felicidades!", "createdAt": "2026-06-29T12:00:00.000Z" }
  ]
}
```

**Response 500** — falha ao carregar
```json
{ "ok": false, "message": "Não foi possível carregar os recados agora." }
```

## `POST /api/recados`

Cria um recado (público). Valida campos, limite de 240 caracteres e aplica rate limiting por dispositivo.

**Request**
```json
{ "nome": "Tia Ana", "mensagem": "Felicidades para a princesa!" }
```

**Response 200** — criado (aparece imediatamente)
```json
{
  "ok": true,
  "recado": { "id": "ckxyz...", "nome": "Tia Ana", "mensagem": "Felicidades para a princesa!", "createdAt": "2026-06-29T12:00:00.000Z" },
  "message": "Recado enviado com carinho."
}
```

**Response 400** — validação (nome/mensagem vazios ou mensagem > 240)
```json
{ "ok": false, "message": "Informe seu nome e uma mensagem (até 240 caracteres)." }
```

**Response 429** — rate limit por dispositivo excedido
```json
{ "ok": false, "message": "Você enviou muitos recados em pouco tempo. Tente novamente em alguns minutos." }
```

**Response 500** — falha ao salvar
```json
{ "ok": false, "message": "Não foi possível enviar seu recado agora." }
```

## `DELETE /api/recados/[id]`

Remove um recado. **Requer sessão admin** (`getCurrentAdminSession`).

**Response 200**
```json
{ "ok": true, "message": "Recado removido." }
```

**Response 401** — sem sessão admin
```json
{ "ok": false, "message": "Não autorizado." }
```

**Response 404** — recado inexistente
```json
{ "ok": false, "message": "Recado não encontrado." }
```

## Regras transversais

- `nome` e `mensagem` sofrem `trim`; vazios após trim → 400.
- `mensagem` máx. 240 caracteres → 400 se exceder.
- Rate limit (default): **5 recados / 10 min por dispositivo** (IP via `x-forwarded-for`/IP da requisição), ajustável por env.
- Cliente desabilita o botão durante o envio (anti-duplo-clique); preserva o texto digitado em caso de erro.
