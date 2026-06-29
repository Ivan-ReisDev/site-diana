# Research: Novo Formato de Sugestões de Presente

**Feature**: 007-gift-suggestions-redesign | **Date**: 2026-06-29

Nenhum marcador `NEEDS CLARIFICATION` restou após a sessão de `/speckit-clarify` (2026-06-29). Este documento consolida as decisões técnicas que orientam o design.

## Decisão 1 — Extrair a seção para um componente isolado

- **Decision**: Mover a seção `#gifts` (hoje inline em `InvitationSite.tsx`) para um novo componente de apresentação `GiftSuggestions` em `src/components/invitation/`, exportando dados (`giftItems`, `giftSuggestions`) e tipos.
- **Rationale**: É o padrão já consolidado no projeto (`LocationMap`, `PhotoGalleryCarousel`, `BackgroundMusic`, `IntroOverlay`), reduz o tamanho do `InvitationSite.tsx` monolítico e torna a seção testável de forma isolada com Vitest (atende ao Princípio 6 — TDD/validação).
- **Alternatives considered**: Editar a seção inline no lugar — rejeitado por não permitir teste unitário isolado e por divergir do padrão dos features 005/006.

## Decisão 2 — Simplificar o modelo de dados (remover campos comerciais)

- **Decision**: `GiftItem` mantém `id`, `nome`, `imagem`; **remove** `preco`, `reservado`, `reservadoPor`. `GiftSuggestion` mantém `giftId`, `ideias`; **remove** `lojas`.
- **Rationale**: FR-002/FR-003 proíbem preço e lojas. `reservado`/`reservadoPor` não são usados nesta seção (a reserva de presentes não faz parte deste escopo), então removê-los do tipo evita dados mortos. Manter `imagem` atende ao layout escolhido (cards com imagem) e à decisão de que imagens não são "informação comercial".
- **Alternatives considered**: Manter os campos e apenas não renderizá-los — rejeitado porque deixa dados comerciais (preços em `R$`) no código-fonte, contrariando o espírito de "só sugestão" e mantendo strings de preço que poderiam vazar em buscas/prints.
- **Verificação**: Confirmar com `grep` que `reservado`/`reservadoPor` não são lidos em outro lugar antes de remover; se forem, restringir a remoção a `preco` e `lojas`. (Há um `DashboardRsvpManager` que cita "presente" — checar na implementação.)

## Decisão 3 — Manter cards com imagem e múltiplas ideias para os 12 presentes

- **Decision**: Grid de cards com imagem ilustrativa (`loading="lazy"`), badge "Sugestão", nome e lista de 2-3 ideias, para os 12 presentes existentes.
- **Rationale**: Decisões registradas na sessão de clarify (layout = cards com imagem; ideias = várias; quantidade = 12). Reaproveita o conteúdo já curado, apenas removendo os campos comerciais.
- **Alternatives considered**: Lista minimalista sem imagem / ícone temático / curadoria menor — rejeitados pelas respostas do usuário no clarify.

## Decisão 4 — Ajustar o texto introdutório

- **Decision**: Reescrever o subtítulo da seção para não mencionar "lojas onde você pode encontrá-los"; enfatizar que é apenas inspiração.
- **Rationale**: FR-004 e edge case explícito. O texto atual promete lojas que não existirão mais.
- **Alternatives considered**: Manter o texto — rejeitado por gerar expectativa contraditória.

## Decisão 5 — Identidade visual e fallback

- **Decision**: Reusar a paleta (`#b85f78`, `#df7894`, `#d7ad55`/dourado, `#fff5f8`), fontes (`font-script`, `font-serif`), cantos arredondados, sombras e animação `whileInView` já usados nas seções existentes. Fallback de imagem ausente: bloco com ícone (`Sparkles`) sobre fundo `#fff5f8`, como já existe hoje.
- **Rationale**: FR-005/FR-007, SC-003. Garante coesão visual sem inventar novo estilo.
- **Alternatives considered**: Novo estilo visual próprio da seção — rejeitado por quebrar consistência (Princípio 5).

## Stack confirmado

- TypeScript 5 + React 19.2.4 + Next.js 16.2.7 (App Router).
- `framer-motion` 12, `lucide-react` — já no projeto. **Sem novas dependências.**
- Testes: Vitest 4 + @testing-library/react + jsdom (configurados; scripts `npm test` → `vitest run`).
