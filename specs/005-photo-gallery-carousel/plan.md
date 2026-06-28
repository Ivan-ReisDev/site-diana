# Implementation Plan: Galeria de Fotos em Carrossel na seção "Nossa História"

**Branch**: `005-photo-gallery-carousel` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/005-photo-gallery-carousel/spec.md`

## Summary

Substituir o lado direito da seção "Nossa História" (a linha do tempo 13h/14h/15h/Até 20/09) por uma **galeria de fotos da Diana em carrossel**: uma foto grande em destaque + miniaturas ao lado, com **avanço automático** em laço e **seleção manual** pelas miniaturas (a interação do convidado tem prioridade sobre o avanço automático). Responsivo (desktop: destaque + miniaturas lado a lado; mobile: destaque acima + faixa de miniaturas rolável), respeitando `prefers-reduced-motion`. As fotos são um **conjunto estático na pasta `public`** (sem upload/admin).

Abordagem técnica: um componente cliente `PhotoGalleryCarousel` montado no lugar da coluna direita em `InvitationSite`, com um hook `usePhotoCarousel` controlando o índice ativo, o autoplay (timer) e a pausa/reset ao selecionar manualmente. Transição da foto em destaque via `framer-motion` (`AnimatePresence` + `motion`, crossfade), respeitando `useReducedMotion()`. As fotos são declaradas num array estático (`galleryPhotos`) referenciando arquivos em `public/galeria/`. Remove-se o `const timeline` e seu uso.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.7 (App Router, Turbopack), `framer-motion` 12 (transições, já no projeto), `lucide-react` (ícones, já no projeto). Sem novas dependências — `<img>` nativo (padrão já usado no projeto para imagens de `public/` e externas).

**Storage**: Nenhum. Estado do carrossel (índice ativo, autoplay on/off) vive apenas em memória (React state). Fotos servidas estaticamente de `public/`.

**Testing**: Vitest + @testing-library/react (já configurados); validação visual/manual real no navegador (desktop + mobile).

**Target Platform**: Navegadores modernos desktop e mobile — Chrome/Edge/Firefox, Safari iOS, Chrome Android.

**Project Type**: Web application (Next.js App Router existente, estrutura `src/`).

**Performance Goals**: Não atrapalhar o carregamento da seção — a primeira foto aparece rápido; demais fotos carregam sob demanda (`loading="lazy"`). Transição fluida (~60 fps). Troca ao clicar na miniatura < 1s (SC-003).

**Constraints**: Avanço automático em intervalo confortável (~3–7s, padrão 5s) com pausa/reset na interação manual (FR-003/FR-006); responsivo de 320px a 1920px, retrato e paisagem (FR-007/SC-004); fotos sem distorção, acomodando retrato/paisagem (FR-012); tratar 1 foto e falha de carregamento sem quebrar (FR-009); respeitar `prefers-reduced-motion` (FR-010); manter estética de princesa e padrão de cards sem borda já adotado (FR-011); todas as fotos acessíveis mesmo sem caber as miniaturas (FR-008).

**Scale/Scope**: 1 componente novo (`PhotoGalleryCarousel`) + 1 hook (`usePhotoCarousel`); 1 array estático de fotos; alteração em 1 seção de `InvitationSite` (remover timeline, montar galeria) + remoção do `const timeline`; fotos em `public/galeria/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Vitrine afetiva das fotos da aniversariante, clara e navegável em qualquer dispositivo. | ✅ Pass |
| 2. Privacidade e segurança | Fotos são públicas no convite por escolha da família; nenhum dado sensível/PII de RSVP envolvido. | ✅ Pass |
| 3. Acessibilidade | Miniaturas como botões com `aria-label`/estado ativo (`aria-current`), navegável por teclado, `alt` descritivo, `prefers-reduced-motion` respeitado, alvos de toque ≥ 44px. | ✅ Pass |
| 4. Performance e SEO | Fotos sob demanda (`loading="lazy"`), primeira foto rápida; não impacta metadados. | ✅ Pass |
| 5. Design emocional sem excesso | Carrossel suave, paleta rosa/dourada, cards sem borda no padrão atual; sem poluição. | ✅ Pass |
| 6. TDD/validação | Testes unitários do hook (índice/autoplay/pausa) e do componente (render/seleção/fallback) + build + validação visual real (desktop e mobile). | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/005-photo-gallery-carousel/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/
│   └── photo-gallery.contract.md   # Contrato de UI/comportamento do carrossel
├── checklists/
│   └── requirements.md  # Checklist de qualidade da spec
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
public/
└── galeria/
    ├── diana-1.jpg                  # Conjunto estático de fotos da Diana (nomes web-safe)
    ├── diana-2.jpg
    └── ...

src/
├── app/
│   └── InvitationSite.tsx           # Remove o const timeline e a coluna direita;
│                                    # monta <PhotoGalleryCarousel /> no lugar
├── components/
│   └── invitation/
│       ├── PhotoGalleryCarousel.tsx        # Componente cliente: destaque + miniaturas + transição
│       └── PhotoGalleryCarousel.test.tsx   # Testes do componente
└── hooks/
    ├── usePhotoCarousel.ts          # Hook: índice ativo, autoplay, pausa/reset na seleção
    └── usePhotoCarousel.test.ts     # Testes da lógica do carrossel
```

**Structure Decision**: Projeto único (Next.js App Router em `src/`). Funcionalidade puramente client-side, integrada à página pública existente (`src/app/InvitationSite.tsx`), espelhando o padrão das features 003/004: componente isolado em `src/components/invitation/` + hook em `src/hooks/` para manter a lógica testável e separada da página. As fotos são servidas estaticamente de `public/galeria/` (clarificação Q1). O ponto de integração é a coluna direita do grid `lg:grid-cols-[.9fr_1.1fr]` (atual `timeline.map`); a coluna esquerda (eyebrow + título + texto + chips) é mantida.

## Complexity Tracking

> Sem violações de constituição. Nada a justificar.
