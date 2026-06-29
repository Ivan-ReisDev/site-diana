# Contract: Mudança no RSVP (idade só de criança)

Afeta o contrato do `POST /api/rsvp` e a forma persistida dos participantes.

## `POST /api/rsvp` — payload depois da mudança

**Request (válido)** — adultos SEM idade, crianças COM idade
```json
{
  "name": "João Reis",
  "phone": "(21) 99999-0000",
  "attendance": "sim",
  "adults": [ { "name": "João Reis" }, { "name": "Ana Reis" } ],
  "children": [ { "name": "Lia Reis", "age": 7 } ]
}
```

**Response 200**
```json
{
  "ok": true,
  "rsvp": {
    "name": "João Reis",
    "attendance": "sim",
    "adults": 2,
    "children": 1,
    "adultsList": [ { "name": "João Reis" }, { "name": "Ana Reis" } ],
    "childrenList": [ { "name": "Lia Reis", "age": 7 } ]
  },
  "message": "Presença registrada com carinho."
}
```

**Response 400** — criança sem idade, adulto sem nome, ou demais validações
```json
{ "ok": false, "message": "Informe a idade de cada criança." }
```

## Regras

- `adults[]`: cada item exige apenas `name` (não vazio). Campo `age` enviado é ignorado (não persistido).
- `children[]`: cada item exige `name` (não vazio) e `age` (0–120). Sem `age` → 400.
- `adults` deve ter ao menos 1 item.

## Compatibilidade

- Confirmações antigas com `age` em adultos continuam sendo lidas; a idade do adulto não é exibida (painel e cartão de confirmação) — FR-005.
- UI: a coluna/cartão do painel mostra adultos sem idade e crianças com idade.

## Impacto no frontend (`InvitationSite.tsx`)

- Seção "Adultos": remover o `<label>Idade</label>` + input de idade; manter só nome.
- Estado `GuestForm` dos adultos não precisa mais de `age` (ou ignora ao enviar).
- Texto auxiliar "Informe o nome completo e a idade de cada adulto." → "Informe o nome completo de cada adulto."
- Validação local: deixar de exigir idade de adulto; manter exigência de idade de criança.
- Cartão de confirmação (`Adultos`/`childrenNamesLabel`): adultos exibidos sem idade.
