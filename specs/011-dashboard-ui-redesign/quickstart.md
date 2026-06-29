# Quickstart: Redesign de UI/UX da Dashboard

## Pré-requisitos

- Node + dependências instaladas (`npm install`)
- Branch: `011-dashboard-ui-redesign`

## Comandos

```bash
npm run dev      # rodar o app localmente
npm run test     # vitest run — rede de regressão do painel
npm run build    # validação de build (exigida pela constituição)
```

## Referência de design (a "fonte da verdade")

- Formulário público: [src/app/InvitationSite.tsx](../../src/app/InvitationSite.tsx) (~linhas 611–745)
- Classes utilitárias: [src/app/globals.css](../../src/app/globals.css) (`.royal-button`, `.soft-button`, `.simple-card`, `.simple-panel`)
- Tokens de campo: `bg-[#ffe9f0] rounded-xl h-11`, foco `focus:ring-2 focus:ring-[#f3d3dd]`, rótulo `text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]`

## Ordem sugerida de implementação

1. Criar primitivos em `src/components/ui/` (`FormField`, `Button`, `SectionHeader`, `SectionCard`, `EmptyState`) com testes para `FormField` e `Button`.
2. Migrar [DashboardRsvpManager](../../src/components/dashboard/DashboardRsvpManager.tsx) (formulário citado como "horrível") → rodar `npm run test`.
3. Migrar [DashboardFilters](../../src/components/dashboard/DashboardFilters.tsx) → testes.
4. Migrar [RecadosManager](../../src/components/dashboard/RecadosManager.tsx), [RsvpTable](../../src/components/dashboard/RsvpTable.tsx), [PresenceStats](../../src/components/dashboard/PresenceStats.tsx).
5. Ajustes leves em [Sidebar](../../src/components/dashboard/Sidebar.tsx), [layout](../../src/app/dashboard/layout.tsx) e [page](../../src/app/dashboard/page.tsx).
6. Validar visualmente em 360px / 768px / 1280px e rodar `npm run build`.

## Critérios de pronto (resumo)

- Campos do painel idênticos ao padrão do convite (SC-001).
- Nenhuma página destoante entre si (SC-002).
- Sem rolagem horizontal em 360/768/1280px (SC-004).
- Foco visível em 100% dos campos por teclado (SC-005).
- Suíte Vitest verde + build ok; nenhuma funcionalidade quebrada (SC-006, FR-009).
