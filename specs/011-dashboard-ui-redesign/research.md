# Phase 0 Research: Redesign de UI/UX da Dashboard

Objetivo: extrair os tokens de design já validados no site público do convite e definir como aplicá-los ao painel sem regressão funcional. Não restaram marcadores NEEDS CLARIFICATION na Technical Context.

## Decisão 1 — Fonte do "padrão da aplicação"

**Decision**: O formulário público de RSVP em [InvitationSite.tsx](../../src/app/InvitationSite.tsx) é a referência canônica de estilo.

**Tokens extraídos** (linhas ~611–745):

| Elemento | Classe de referência (convite) |
|----------|--------------------------------|
| Cartão de formulário | `rounded-[2rem] bg-white/68 p-7 shadow-[0_10px_30px_rgba(201,111,135,.06)] sm:p-8` |
| Campo de texto/número | `w-full rounded-xl bg-[#ffe9f0] h-11 px-4 text-[15px] text-[#5b4a48] placeholder:text-[#cf93a7] placeholder:font-medium outline-none transition focus:ring-2 focus:ring-[#f3d3dd]` |
| Rótulo | `text-[11px] font-black uppercase tracking-[.22em] text-[#d36f8a]` |
| Sub-bloco (adultos/crianças) | `rounded-2xl bg-white/40 p-5`; item `rounded-xl bg-white/55 p-4` |
| Botão "Adicionar" | `inline-flex ... rounded-full bg-white/70 px-4 py-2.5 text-sm font-bold text-[#b85f78] hover:bg-[#fff3f7]` + ícone `Plus` |
| Botão "Remover" (item) | ícone-only `h-11 w-11 rounded-xl bg-white/70 text-[#c86f87] hover:bg-[#fff3f7] disabled:opacity-40` + ícone `Trash2` |
| Presença | grupo de `radio` com `accent-[#d8547a]` (não `<select>`) |

**Rationale**: São os estilos que a usuária reconhece como "o padrão"; reutilizá-los garante consistência percebida (SC-001, SC-002).

**Alternatives considered**: Criar um novo design system do zero — rejeitado: introduz mais inconsistência e retrabalho; o convite já define uma linguagem madura.

## Decisão 2 — Estratégia de aplicação: primitivos compartilhados vs. edição inline

**Decision**: Extrair primitivos em `src/components/ui/` (`FormField`, `Button`, `SectionCard`, `SectionHeader`, `EmptyState`) e consumi-los no painel.

**Rationale**: Hoje as classes são duplicadas em cada campo; centralizá-las evita divergência futura e cumpre FR-001..FR-007 de forma testável. A pasta `src/components/ui/` ainda não existe — é o lugar idiomático para primitivos.

**Alternatives considered**: Substituir classes inline em cada componente sem extrair primitivos — rejeitado: replica o problema de duplicação que originou a inconsistência. Usar uma lib externa (shadcn/Radix) — rejeitado: adiciona dependências e peso desnecessários para um painel pequeno (Princípios 4 e 5).

## Decisão 3 — Campo "Presença" no cadastro manual

**Decision**: Manter `<select>` no cadastro manual, mas estilizá-lo com os tokens de campo. O convite usa `radio`, mas o painel tem apenas duas opções num formulário denso; um `<select>` estilizado preserva o comportamento atual (FR-009) e a compactação. O filtro de status na lista de confirmações também permanece `<select>`.

**Rationale**: Trocar `<select>` por `radio` mudaria o comportamento e os testes; o foco da feature é visual. Estilizar o `<select>` já o alinha ao padrão.

**Alternatives considered**: Converter para radios como no convite — rejeitado por alterar comportamento/markup e exigir mudança de testes sem ganho de valor proporcional.

## Decisão 4 — Acessibilidade do estado de foco

**Decision**: Padronizar foco em `focus:ring-2 focus:ring-[#f3d3dd]` (token do convite), substituindo `focus:ring-4 focus:ring-pink-100` do painel. Garantir que todo controle interativo (inclusive botões e itens de navegação) tenha foco visível por teclado.

**Rationale**: Mantém visibilidade do foco (Princípio 3, FR-002, SC-005) e unifica o padrão. Anel menor mas com cor consistente continua perceptível.

**Alternatives considered**: Remover anel em favor de borda — rejeitado: piora acessibilidade.

## Decisão 5 — Mensagens de erro/sucesso (não depender só de cor)

**Decision**: Manter mensagens com cor (`text-red-600` / `text-emerald-700`) acrescentando ícone/role apropriado para que sejam perceptíveis sem depender apenas de cor (FR-006) e anunciadas a leitores de tela (`role="alert"`/`aria-live`).

**Rationale**: Atende acessibilidade (Princípio 3) e o critério "perceptíveis sem depender apenas de cor".

**Alternatives considered**: Apenas cor — rejeitado por acessibilidade.

## Decisão 6 — Estratégia de validação (TDD/Princípio 6)

**Decision**: Apoiar-se nos testes Vitest existentes do painel como rede de regressão (asseguram comportamento), adicionar testes para os novos primitivos (`FormField`, `Button`) e validar visualmente com `npm run build` + inspeção real nas larguras 360/768/1280px.

**Rationale**: A feature é presentacional; o risco principal é quebrar comportamento existente. Os testes atuais cobrem submit, add/remove, filtros e navegação — devem continuar verdes sem alteração (ou com ajustes mínimos de seletor caso o markup mude de tag).

**Alternatives considered**: Escrever testes de snapshot visual — rejeitado: frágeis; validação visual manual é exigida pela constituição e é mais confiável aqui.

## Riscos e mitigações

- **Testes que dependem de markup/tag específico** podem quebrar ao trocar elementos por primitivos. Mitigação: preferir seletores por papel/label/acessibilidade; rodar `npm run test` a cada componente migrado.
- **Regressão de responsividade** em telas estreitas. Mitigação: validar 360/768/1280px (SC-004) antes de concluir.
- **Divergência de foco/contraste**. Mitigação: revisar contraste dos tokens reaproveitados (já em uso no convite).
