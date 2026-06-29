# Implementation Plan: Novo Formato de Sugestões de Presente

**Branch**: `007-gift-suggestions-redesign` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/007-gift-suggestions-redesign/spec.md`

## Summary

Reformatar a seção **"Sugestões de Presente"** (`#gifts`) do convite para que seja **só inspiração**: remover **preço** e o bloco **"Onde comprar"** (lojas/links), mantendo **cards com imagem ilustrativa**, **nome** e **várias ideias** (2-3) por presente, para os **12 presentes** já existentes — tudo alinhado à identidade visual do sistema.

Abordagem técnica: extrair a seção, hoje inline em [src/app/InvitationSite.tsx](../../src/app/InvitationSite.tsx), para um componente de apresentação `GiftSuggestions` (sem estado) em `src/components/invitation/`, seguindo o mesmo padrão de `LocationMap` e `PhotoGalleryCarousel`. O tipo de dado é simplificado: `GiftItem` perde o campo `preco` (e os campos `reservado`/`reservadoPor`, não usados nesta seção); `GiftSuggestion` perde o campo `lojas`. A seção renderiza um grid de cards com imagem (`loading="lazy"`), badge "Sugestão", nome e lista de ideias — sem nenhuma referência monetária ou de loja. O texto introdutório é ajustado para não prometer "lojas onde encontrá-los". Sem novas dependências.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.7 (App Router, Turbopack), `framer-motion` 12 (animação `whileInView` da seção, já no projeto), `lucide-react` (ícones `Lightbulb`/`Sparkles`, já no projeto). **Sem novas dependências.**

**Storage**: Nenhum. Os presentes/ideias são constantes estáticas no código. Sem estado de UI, sem persistência.

**Testing**: Vitest + @testing-library/react (já configurados); validação visual/manual real no navegador (desktop + mobile).

**Target Platform**: Navegadores modernos desktop e mobile — Chrome/Edge/Firefox, Safari iOS, Chrome Android.

**Project Type**: Web application (Next.js App Router existente, estrutura `src/`).

**Performance Goals**: Não atrasar o carregamento — imagens dos cards com `loading="lazy"`. Conteúdo textual (nome + ideias) renderiza imediatamente, independente das imagens.

**Constraints**: Zero referência a preço/valor (FR-002, SC-001); zero link/menção a lojas (FR-003, SC-002); 12 presentes mantidos sem dados comerciais (FR-008); várias ideias por presente (FR-001); responsivo 320px–1920px com legibilidade preservada (FR-006, SC-004); fallback visual coerente quando não há imagem (FR-007); identidade visual igual às demais seções (FR-005, SC-003).

**Scale/Scope**: 1 componente novo (`GiftSuggestions`) + extração dos dados (`giftItems`/`giftSuggestions`) com tipos simplificados; substituição da `<section id="gifts">` inline em `InvitationSite.tsx` pela montagem do componente. Sem hooks, sem rotas de API, sem migrações. A seção "Pix Descomplica" (`#pix`) permanece intocada.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Foca em inspirar quem quer presentear, sem pressão de valor ou loja; legível em qualquer dispositivo. | ✅ Pass |
| 2. Privacidade e segurança | Nenhum dado sensível envolvido; nenhuma chamada externa nova (remove links de marketplaces). | ✅ Pass |
| 3. Acessibilidade | Imagens com `alt`; texto real (nome + ideias) legível; contraste na paleta atual; sem dependência só de imagem (fallback com ícone). | ✅ Pass |
| 4. Performance e SEO | Imagens `loading="lazy"`; remoção de links externos reduz ruído; conteúdo textual ajuda legibilidade. | ✅ Pass |
| 5. Design emocional sem excesso | Cards mais limpos (sem preço/loja) reforçam visual delicado e coeso com o restante do convite. | ✅ Pass |
| 6. TDD/validação | Teste do componente (render dos 12 nomes, presença das ideias, **ausência** de preço/"R$" e de "Onde comprar"/links de loja) + build + validação visual real (desktop e mobile). | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/007-gift-suggestions-redesign/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/
│   └── gift-suggestions.contract.md   # Contrato de UI/comportamento da seção
├── checklists/
│   └── requirements.md  # Checklist de qualidade da spec (/speckit-specify)
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado por /speckit-plan)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── InvitationSite.tsx            # Remove a section #gifts inline + tipos/dados comerciais; monta <GiftSuggestions />
└── components/
    └── invitation/
        ├── GiftSuggestions.tsx       # NOVO — componente de apresentação da seção #gifts
        └── GiftSuggestions.test.tsx  # NOVO — testes Vitest do componente
```

**Structure Decision**: Web application com `src/` existente. Segue o padrão já estabelecido em `006-location-map-routes` e `005-photo-gallery-carousel`: a seção vira um componente de apresentação isolado em `src/components/invitation/`, com seus dados e tipos exportados, e `InvitationSite.tsx` apenas o monta dentro de uma `motion.section id="gifts"`. Isso reduz o tamanho do arquivo monolítico e torna a seção testável de forma independente.

## Complexity Tracking

> Sem violações de constituição. Nenhuma justificativa necessária.
