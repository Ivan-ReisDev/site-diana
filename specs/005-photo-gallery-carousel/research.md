# Phase 0 Research: Galeria de Fotos em Carrossel

Todas as áreas técnicas estão resolvidas; nenhum NEEDS CLARIFICATION remanescente (Q1/Q2 já respondidas na clarificação).

## Decisão 1 — Biblioteca de transição/carrossel

- **Decision**: Usar `framer-motion` (já no projeto) com `AnimatePresence` para crossfade da foto em destaque; sem biblioteca de carrossel externa.
- **Rationale**: Já é dependência do projeto e usada nas features 003/004; a galeria é simples (1 destaque + miniaturas), não exige libs como Swiper/Embla. Menos peso, controle total e suporte nativo a `prefers-reduced-motion` via `useReducedMotion()`.
- **Alternatives considered**: Embla/Swiper (dependência nova e overkill para o caso); CSS scroll-snap puro (bom para miniaturas, mas a transição do destaque fica mais limitada).

## Decisão 2 — Autoplay com prioridade à interação manual

- **Decision**: Hook `usePhotoCarousel` mantém `index` ativo e um timer de autoplay (padrão 5s). Ao selecionar uma miniatura (ou navegar), o timer é **resetado** e a foto escolhida entra em destaque imediatamente; o autoplay continua a partir dela.
- **Rationale**: Atende FR-003 (avanço automático) e FR-006 (seleção manual respeitada) sem "brigar". Reset do timer evita avanço logo após o clique.
- **Alternatives considered**: Pausar autoplay permanentemente após primeira interação (pode parecer "travado"); ignorar interação durante autoplay (frustrante). O reset é o equilíbrio.

## Decisão 3 — Entrega e formato das fotos

- **Decision**: Fotos estáticas em `public/galeria/` com nomes web-safe (`diana-1.jpg`, ...), declaradas num array `galleryPhotos: { src, alt }[]` no componente/módulo. `<img>` nativo com `loading="lazy"` (exceto a primeira, que pode ser `eager`).
- **Rationale**: Clarificação Q1 (estático na pasta `public`). Segue o padrão do projeto (que já usa `<img>` para `public/` e imagens externas). Carregamento sob demanda preserva performance (constituição §4).
- **Alternatives considered**: `next/image` (otimização automática, mas o projeto padronizou `<img>`; introduzir `next/image` só aqui geraria inconsistência e necessidade de config de domínios/sizes); upload/admin (rejeitado na clarificação).

## Decisão 4 — Acomodação de proporções (retrato/paisagem)

- **Decision**: Container da foto em destaque com proporção fixa (ex.: `aspect-[4/5]` ou `aspect-square`) e `object-cover` para preencher sem distorcer; miniaturas quadradas com `object-cover`.
- **Rationale**: Garante layout estável independentemente da proporção original (FR-012, edge case de proporções). `object-cover` evita distorção (corta levemente em vez de esticar).
- **Alternatives considered**: `object-contain` (mantém tudo visível, mas gera faixas/altura variável, instável no grid); altura automática (layout "pula" entre fotos).

## Decisão 5 — Layout responsivo

- **Decision**: Desktop/tablet: foto em destaque grande + coluna/linha de miniaturas ao lado. Mobile: foto em destaque acima + **faixa horizontal de miniaturas rolável** (`overflow-x-auto`, scroll-snap) abaixo.
- **Rationale**: Atende FR-007/FR-008/SC-004 e a Assumption do mobile (destaque acima, miniaturas em faixa). Rolagem horizontal garante acesso a todas as fotos sem caber todas (FR-008).
- **Alternatives considered**: Empilhar tudo verticalmente (ocupa muito espaço); esconder miniaturas no mobile e só usar autoplay (perde controle manual).

## Decisão 6 — Casos de borda (1 foto / falha de carregamento)

- **Decision**: Com 1 foto: exibe só o destaque, sem autoplay e sem faixa de miniaturas. Em falha de carregamento (`onError`): mostra um placeholder suave (fundo rosa + ícone) e o autoplay segue para a próxima.
- **Rationale**: FR-009 — não quebrar layout em casos degenerados.
- **Alternatives considered**: Esconder a seção se faltar foto (pior que um placeholder elegante).

## Decisão 7 — Remoção da timeline

- **Decision**: Remover o `const timeline` (declaração) e a coluna direita que faz `timeline.map`; substituir pela galeria. Manter a coluna esquerda e os chips ("11 de outubro", "13 horas", "Confirmar até 20/09") que já resumem o essencial.
- **Rationale**: Clarificação Q2 (remover de vez). Data/horário essenciais permanecem na seção "Informações" e nos chips do lado esquerdo.
- **Alternatives considered**: Realocar a timeline (rejeitado na clarificação).

## Resumo de prontidão

- Stack confirmada (Next.js 16 App Router, React 19, framer-motion 12, Tailwind v4, Vitest).
- Ponto de integração confirmado: `src/app/InvitationSite.tsx`, coluna direita do grid da seção "Nossa História" (atual `timeline.map`, ~linhas 819–831) e o `const timeline` (~linha 399).
- Nenhuma nova dependência. Nenhum dado persistido. Nenhum NEEDS CLARIFICATION remanescente.
