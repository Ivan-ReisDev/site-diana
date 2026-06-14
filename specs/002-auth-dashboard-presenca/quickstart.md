# Quickstart planejado

> Este quickstart será executado na fase de implementação. Não contém credenciais reais.

## 1. Configurar ambiente

```bash
cp .env.example .env
# editar ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, SESSION_SECRET
```

## 2. Subir PostgreSQL

```bash
docker compose up -d db
```

## 3. Rodar Prisma

```bash
npx prisma migrate dev
npx prisma db seed
```

## 4. Rodar app

```bash
npm run dev
```

## 5. Fluxo de validação

1. Abrir `http://localhost:3000`.
2. Enviar uma confirmação de presença.
3. Abrir `http://localhost:3000/dashboard` e confirmar redirect para login.
4. Entrar com admin configurado no `.env`.
5. Confirmar que RSVP aparece na dashboard e totais batem.
6. Testar filtro por confirmados/não irão e busca por nome/telefone.
7. Fazer logout e confirmar bloqueio da dashboard.
