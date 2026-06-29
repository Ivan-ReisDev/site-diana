# Data Model — Dashboard em páginas separadas

**Feature**: 009-dashboard-separate-pages | **Date**: 2026-06-29

## Resumo

**Nenhuma entidade de dados nova.** Esta feature é uma reorganização de navegação/apresentação. As fontes de dados e regras de negócio existentes são reaproveitadas sem alteração de schema.

## Dados consumidos por rota (reuso)

| Rota | Fonte de dados (existente) | Componente | Observações |
|------|----------------------------|------------|-------------|
| `/dashboard` (Visão geral) | `getDashboardData({ status:'all', q:'' })` → `stats` | `PresenceStats` | Usa apenas os totais (`stats`); cabeçalho estático |
| `/dashboard/cadastro-manual` | `getDashboardData(...)` → `rows` (estado inicial) | `DashboardRsvpManager` | Recebe `initialRows`; lógica de criação/atualização inalterada |
| `/dashboard/confirmacoes` | `getDashboardData({ status, q })` → `rows` | `DashboardFilters` + `RsvpTable` | Lê `searchParams` `status`/`q`; filtro/busca preservados |
| `/dashboard/mural` | `listRecados()` | `RecadosManager` | Mapeia `createdAt` para ISO string como hoje |

## Entidades referenciadas (já existentes — sem mudança)

- **Grupo de presença / RSVP**: confirmações com adultos e crianças, totais (`stats`) e filtro por status. Definido em [src/lib/rsvp/service.ts](../../src/lib/rsvp/service.ts).
- **Recado**: mensagens do mural. Definido em [src/lib/recados/service.ts](../../src/lib/recados/service.ts).
- **Sessão de admin**: usada para proteção de rota via `getCurrentAdminSession`.

## Estado/Transições

Sem máquina de estado nova. O "estado" relevante é a **rota atual** (qual seção está visível), derivada da URL pelo App Router e refletida no menu via `usePathname()`.
