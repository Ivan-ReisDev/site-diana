# Phase 1 Data Model: Redesign de UI/UX da Dashboard

Esta feature **não introduz nem altera entidades de dados**. O modelo abaixo descreve os **artefatos de apresentação** (design tokens e props dos primitivos de UI), que são o "modelo" relevante para um trabalho puramente visual.

## Design Tokens (fonte: convite)

| Token | Valor | Uso |
|-------|-------|-----|
| `--field-bg` | `#ffe9f0` | fundo de campos de entrada |
| `--field-text` | `#5b4a48` | texto digitado |
| `--field-placeholder` | `#cf93a7` | placeholder |
| `--field-focus-ring` | `#f3d3dd` | anel de foco (`ring-2`) |
| `--label` | `#d36f8a` | rótulo uppercase |
| `--card-shadow` | `0 10px 30px rgba(201,111,135,.06)` | sombra de cartão |
| `--btn-primary` | `#db6f90` (`.royal-button`) | ação primária |
| `--btn-soft-text` | `#b85f78` | botão suave (adicionar) |
| `--btn-danger-text` | `#c86f87` | ação destrutiva |

Tokens já existem em `globals.css` (`--baby-pink`, `--warm-rose`, classes `.royal-button`, `.soft-button`, `.simple-card`, `.simple-panel`). Reaproveitar; criar utilitário de campo apenas se reduzir duplicação.

## Primitivos de UI (props)

### FormField
- `label: string` — texto do rótulo (associado via `htmlFor`/`id`)
- `id: string`
- `as?: 'input' | 'select'` (default `input`)
- `type?: string` — para input (text/number/tel)
- `value`, `onChange`, `placeholder`, `min`, `disabled`
- `children?` — `<option>`s quando `as='select'`
- **Regra**: rótulo sempre associado ao controle; foco `ring-2 ring-[#f3d3dd]`; campo `bg-[#ffe9f0] rounded-xl h-11`.

### Button
- `variant: 'primary' | 'secondary' | 'ghost' | 'danger'`
- `loading?: boolean` — mostra estado "processando" e desabilita
- `icon?: ReactNode`
- demais props nativas de `<button>`
- **Regra**: estados normal/hover/disabled/loading consistentes (FR-003); foco visível.

### SectionCard
- `children`
- `className?`
- **Regra**: `rounded-[1.5rem]/[2rem] bg-white p-5 sm:p-6 shadow-[var(--card-shadow)]` padrão (FR-005).

### SectionHeader
- `eyebrow: string` — rótulo de contexto uppercase
- `title: string`
- `description?: string`
- **Regra**: hierarquia única em todas as páginas (FR-004).

### EmptyState
- `message: string`
- `icon?`
- **Regra**: visual amigável padronizado (FR-007).

## Entidades de domínio (inalteradas — referência)

Reutilizadas apenas para renderização; **sem mudança de schema**:

- **Grupo de RSVP**: `id`, `name`, `phone`, `attendance`, `adults[]`, `children[]` (com `age`).
- **Recado**: `id`, `nome`, `mensagem`, `createdAt`.
- **Estatísticas de presença**: totais derivados dos grupos.

## Estados de UI (transições visuais, não de dados)

- Campo: `idle → focus (ring-2) → preenchido`.
- Botão: `normal → hover → active → disabled/loading`.
- Formulário: `editando → enviando (loading) → sucesso (mensagem) | erro (mensagem com role=alert)`.
- Lista/Tabela: `com itens | vazio (EmptyState)`.
