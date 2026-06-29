# Implementation Plan: Redesign de UI/UX das páginas da Dashboard

**Branch**: `011-dashboard-ui-redesign` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/011-dashboard-ui-redesign/spec.md`

## Summary

Realinhar a camada de apresentação das quatro páginas do painel (Visão geral, Cadastro manual, Lista de confirmações, Mural de recados) à linguagem visual do site público do convite. O problema central: os formulários do painel ([DashboardRsvpManager](../../src/components/dashboard/DashboardRsvpManager.tsx) e [DashboardFilters](../../src/components/dashboard/DashboardFilters.tsx)) usam campos brancos com borda dura (`border border-[#f1c4d0] bg-white px-4 py-3`, `focus:ring-4 focus:ring-pink-100`), enquanto o formulário público usa campos preenchidos suaves (`rounded-xl bg-[#ffe9f0] h-11`, `focus:ring-2 focus:ring-[#f3d3dd]`) e rótulos `text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]`.

Abordagem: extrair primitivos de UI compartilhados (campo, rótulo, botões, cartão de seção, cabeçalho, estado vazio) que encapsulem os tokens já validados no convite, e aplicá-los em todos os componentes do painel **sem alterar comportamento funcional ou contratos de dados**. Trabalho puramente presentacional, guiado pelos testes Vitest existentes (que asseguram que a funcionalidade não regride) e validação visual real.

## Technical Context

**Language/Version**: TypeScript 5 / React 19.2.4 / Next.js 16.2.7 (App Router)

**Primary Dependencies**: Next.js, React, Tailwind CSS v4 (`@import "tailwindcss"` em `globals.css`), lucide-react (ícones), framer-motion (já no projeto; opcional no painel)

**Storage**: N/A — feature presentacional; reutiliza dados de RSVP/recados/stats já carregados pelos Server Components

**Testing**: Vitest + @testing-library/react (`npm run test`). Testes existentes: `DashboardRsvpManager.test.tsx`, `RsvpTable.test.tsx`, `Sidebar.test.tsx`, `DashboardFilters.test.tsx`, `PresenceStats.test.tsx`

**Target Platform**: Web mobile-first responsivo; tema claro forçado (`color-scheme: only light`)

**Project Type**: Web application (single Next.js app, estrutura `src/`)

**Performance Goals**: Sem novas requisições de rede; sem layout shift; nenhuma dependência nova adicionada

**Constraints**: Não alterar comportamento funcional (FR-009); preservar acessibilidade — labels associados, foco visível, navegação por teclado, contraste (FR-010, Princípio 3); responsivo de 360px a 1280px+ sem rolagem horizontal (FR-008, SC-004); manter os textos pt-BR; não introduzir modo escuro

**Scale/Scope**: ~7 componentes do painel + 4 páginas + `globals.css`. Novos primitivos de UI compartilhados em `src/components/ui/`. Nenhuma mudança de modelo de dados, rota ou API.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Impacto | Status |
|-----------|---------|--------|
| 1. Valor para convidados primeiro | Painel é uso interno da administradora; redesenho melhora clareza e usabilidade em qualquer dispositivo | ✅ Pass |
| 2. Privacidade e segurança | Nenhum dado de RSVP exposto em código; somente apresentação; dados reais não usados em testes/prints | ✅ Pass |
| 3. Acessibilidade | FR-010 exige preservar labels, foco visível, teclado e contraste; foco passa de `ring-4` para `ring-2` mantendo visibilidade; mensagens não dependem só de cor (FR-006) | ✅ Pass |
| 4. Performance e SEO | Sem novas requisições/dependências; responsivo mantido (FR-008); painel é `noindex` por ser autenticado | ✅ Pass |
| 5. Design emocional sem excesso | Reusa paleta blush/rosê e cartões suaves já validados; reduz poluição visual ao unificar o padrão | ✅ Pass |
| 6. TDD/validação | Testes Vitest existentes travam o comportamento; novos primitivos com testes; build + validação visual real obrigatórios | ✅ Pass |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/011-dashboard-ui-redesign/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output (presentational model / design tokens)
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── ui-primitives.md # UI contract for shared dashboard primitives
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
src/app/globals.css                       # EDIT: tokens/utilitários compartilhados (campo, foco) se necessário

src/components/ui/                          # NEW: primitivos de UI compartilhados (camada de apresentação)
├── FormField.tsx                           # NEW: label + input/select padronizados (tokens do convite)
├── FormField.test.tsx                      # NEW
├── Button.tsx                              # NEW: variantes primary/secondary/ghost/danger + estado loading
├── Button.test.tsx                         # NEW
├── SectionCard.tsx                         # NEW: cartão de conteúdo padrão (cantos/sombra/respiro)
├── SectionHeader.tsx                       # NEW: rótulo + título + descrição (hierarquia única)
└── EmptyState.tsx                          # NEW: estado vazio amigável padronizado

src/components/dashboard/
├── DashboardRsvpManager.tsx                # EDIT: usar FormField/Button/SectionCard/SectionHeader
├── DashboardFilters.tsx                    # EDIT: usar FormField/Button/SectionCard
├── RsvpTable.tsx                           # EDIT: padronizar cartão, legibilidade e distinção de status
├── RecadosManager.tsx                      # EDIT: usar SectionCard/SectionHeader/EmptyState/Button
├── PresenceStats.tsx                       # EDIT: alinhar cartões de estatística ao padrão
└── Sidebar.tsx                             # EDIT (leve): alinhar estado ativo/tipografia ao padrão

src/app/dashboard/
├── layout.tsx                              # EDIT (opcional): fundo/respiro do shell
├── page.tsx                                # EDIT (leve): usar SectionHeader/SectionCard
├── cadastro-manual/page.tsx                # sem mudança (delega ao manager)
├── confirmacoes/page.tsx                   # sem mudança (delega aos componentes)
└── mural/page.tsx                          # sem mudança (delega ao manager)
```

**Structure Decision**: Single Next.js app (`src/`). Introduz-se uma pasta `src/components/ui/` para primitivos de apresentação reutilizáveis — hoje inexistente — concentrando os tokens do design system do convite num único lugar, evitando duplicação de classes Tailwind e garantindo consistência (FR-001..FR-007). Os componentes do painel passam a consumir esses primitivos; páginas (Server Components) permanecem praticamente intactas. Nenhuma camada de dados/serviço é tocada.

## Complexity Tracking

> Nenhuma violação da constituição. Seção não aplicável.
