# syntax=docker/dockerfile:1

# ───────────────────────────────────────────────────────────────
# 1) Dependências — instala TUDO (inclui devDeps, necessárias no build)
# ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS deps
# libc6-compat: compatibilidade glibc p/ binários (ex.: SWC) em Alpine/musl
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci

# ───────────────────────────────────────────────────────────────
# 2) Build — gera o Prisma Client e compila o Next em modo standalone
# ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
# DATABASE_URL só para o BUILD (este estágio). Tem um fallback fake porque o
# build não acessa o banco (as rotas que usam Prisma são dinâmicas).
# Se o Coolify passar DATABASE_URL como build-arg, ele é usado aqui; senão, o fallback.
# IMPORTANTE: este valor NÃO vai para a imagem final — o runtime usa a env do Coolify.
ARG DATABASE_URL="postgresql://build:build@localhost:5432/build"
ENV DATABASE_URL=$DATABASE_URL
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# ───────────────────────────────────────────────────────────────
# 2.5) Migrator — closure isolado do CLI do Prisma p/ rodar `migrate deploy`
#      no start. Instalado à parte (não o node_modules de 1GB do build) e com
#      TODAS as deps transitivas (effect, c12, etc.) resolvidas pelo npm —
#      sem cherry-pick frágil. Engine baixado já é o musl (estágio Alpine).
# ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS migrator
RUN apk add --no-cache libc6-compat openssl
WORKDIR /opt/prisma
RUN npm init -y >/dev/null 2>&1 && npm install --omit=dev prisma@7.8.0 dotenv@17.4.2

# ───────────────────────────────────────────────────────────────
# 3) Runner — imagem final mínima que roda o app
#    (sem DATABASE_URL embutido: usa a env injetada pelo Coolify em runtime)
# ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
# openssl: exigido pelo schema-engine do Prisma (libssl) ao rodar `migrate deploy` no Alpine.
RUN apk add --no-cache openssl

# Closure do CLI do Prisma (instalado no estágio migrator). Copiado PRIMEIRO para
# que a saída standalone do Next sobreponha seus módulos traçados por cima.
COPY --from=migrator /opt/prisma/node_modules ./node_modules

# saída standalone do Next (server.js + node_modules mínimo)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma Client gerado + adapters que o Next não traça sozinho (driver adapter, sem engine nativo).
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/bcryptjs ./node_modules/bcryptjs
COPY --from=builder /app/node_modules/pg ./node_modules/pg
COPY --from=builder /app/node_modules/pg-connection-string ./node_modules/pg-connection-string
COPY --from=builder /app/node_modules/pg-int8 ./node_modules/pg-int8
COPY --from=builder /app/node_modules/pg-pool ./node_modules/pg-pool
COPY --from=builder /app/node_modules/pg-protocol ./node_modules/pg-protocol
COPY --from=builder /app/node_modules/pg-types ./node_modules/pg-types
COPY --from=builder /app/node_modules/pgpass ./node_modules/pgpass
COPY --from=builder /app/node_modules/postgres-array ./node_modules/postgres-array
COPY --from=builder /app/node_modules/postgres-bytea ./node_modules/postgres-bytea
COPY --from=builder /app/node_modules/postgres-date ./node_modules/postgres-date
COPY --from=builder /app/node_modules/postgres-interval ./node_modules/postgres-interval
COPY --from=builder /app/node_modules/split2 ./node_modules/split2
COPY --from=builder /app/node_modules/xtend ./node_modules/xtend
COPY --from=builder /app/node_modules/@prisma/adapter-pg ./node_modules/@prisma/adapter-pg
COPY --from=builder /app/node_modules/@prisma/client-runtime-utils ./node_modules/@prisma/client-runtime-utils
COPY --from=builder /app/node_modules/@prisma/debug ./node_modules/@prisma/debug
COPY --from=builder /app/node_modules/@prisma/driver-adapter-utils ./node_modules/@prisma/driver-adapter-utils

# schema + migrations + config + entrypoint (usados pelo `migrate deploy` no start)
COPY --from=builder /app/prisma ./prisma
COPY prisma.config.ts ./prisma.config.ts
COPY docker-entrypoint.sh ./docker-entrypoint.sh
RUN chmod +x ./docker-entrypoint.sh

# usuário não-root já existente nas imagens oficiais do Node
USER node
EXPOSE 3000
ENTRYPOINT ["./docker-entrypoint.sh"]
