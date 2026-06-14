# Contracts: RSVP e autenticação

## POST /api/rsvp

Registra ou atualiza RSVP público.

### Request

```json
{
  "name": "Família Reis",
  "phone": "(21) 99999-0000",
  "attendance": "sim",
  "adults": 2,
  "children": 1,
  "message": "Estamos animados!"
}
```

### Success 200/201

```json
{
  "ok": true,
  "rsvp": {
    "name": "Família Reis",
    "attendance": "sim",
    "adults": 2,
    "children": 1
  },
  "message": "Presença registrada com carinho."
}
```

### Validation 400

```json
{
  "ok": false,
  "message": "Preencha nome e telefone para confirmar presença."
}
```

## POST /api/auth/login

Autentica administrador.

### Request

```json
{
  "email": "admin@example.com",
  "password": "senha-segura"
}
```

### Success 200

Define cookie HttpOnly de sessão.

```json
{
  "ok": true,
  "redirectTo": "/dashboard"
}
```

### Unauthorized 401

```json
{
  "ok": false,
  "message": "Credenciais inválidas."
}
```

## POST /api/auth/logout

Invalida sessão atual e limpa cookie.

### Success 200

```json
{
  "ok": true,
  "redirectTo": "/login"
}
```

## GET /dashboard

Página privada renderizada no servidor.

Regras:
- Sem sessão válida: redireciona para `/login`.
- Com sessão válida: renderiza métricas e lista de RSVPs.

## Query params planejados da dashboard

- `status=all|yes|no`
- `q=<nome-ou-telefone>`
