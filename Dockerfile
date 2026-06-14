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
# 3) Runner — imagem final mínima que roda o app
#    (sem DATABASE_URL embutido: usa a env injetada pelo Coolify em runtime)
# ───────────────────────────────────────────────────────────────
FROM node:22-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

# saída standalone do Next (server.js + node_modules mínimo)
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Prisma Client gerado + adapters que o Next não traça sozinho (driver adapter, sem engine nativo).
# @prisma/client, pg e postgres-array já entram via tracing do standalone.
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma/adapter-pg ./node_modules/@prisma/adapter-pg
COPY --from=builder /app/node_modules/@prisma/driver-adapter-utils ./node_modules/@prisma/driver-adapter-utils

# usuário não-root já existente nas imagens oficiais do Node
USER node
EXPOSE 3000
CMD ["node", "server.js"]
