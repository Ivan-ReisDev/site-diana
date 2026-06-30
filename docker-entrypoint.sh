#!/bin/sh
# Entrypoint do container: aplica as migrations pendentes e sobe o Next.
# `migrate deploy` é idempotente — só roda o que ainda não foi aplicado e nunca
# faz reset/gera migrations novas (seguro para produção).
set -e

echo "→ Aplicando migrations do banco (prisma migrate deploy)..."
node node_modules/prisma/build/index.js migrate deploy

echo "→ Aplicando seed do administrador..."
node prisma/seed-admin.mjs

echo "→ Iniciando servidor Next (server.js)..."
exec node server.js
