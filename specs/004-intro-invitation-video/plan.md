# Implementation Plan: Tela de Abertura com Convocação Real e Vídeo

**Branch**: `004-intro-invitation-video` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/004-intro-invitation-video/spec.md`

## Summary

Adicionar uma experiência de abertura que sobrepõe toda a página do convite assim que o site é aberto, em três etapas: (1) **Convocação Real** — overlay em tela cheia com a mensagem do convite e um botão de princesa; (2) **Vídeo** — ao tocar no botão, uma transição animada leva a um fundo preto com o vídeo do convite centralizado, com opção de pular e de ativar som; (3) **Confirmação** — ao terminar (ou pular) o vídeo, surgem a mensagem final e o botão "Confirmar Presença", que encerra a abertura e revela a home. A abertura aparece **a cada visita** (sem persistência) e a **música de fundo (feature 003) permanece em silêncio durante toda a abertura, iniciando só na home**.

Abordagem técnica: um componente cliente `IntroOverlay` (com máquina de estados de etapa `invite → video → final`) montado no topo de `InvitationSite`, usando `framer-motion` (já no projeto) para as transições e `AnimatePresence` para entrada/saída, respeitando `useReducedMotion()`. O vídeo usa o elemento HTML5 `<video>` nativo, iniciado com som dentro do gesto de clique (driblando a política de autoplay). A coordenação com a música é feita **gating do render** de `<BackgroundMusic />`: ele só é montado quando a abertura termina, então seus listeners de "primeiro gesto" passam a valer apenas na home. O scroll do `body` é travado enquanto o overlay está ativo. O vídeo é servido de `public/` com nome web-safe.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.7 (App Router, Turbopack), `framer-motion` 12 (animações/transições, já no projeto), `lucide-react` (ícones já no projeto). Sem novas dependências — usa o elemento `<video>` nativo.

**Storage**: Nenhum. A abertura é efêmera e aparece a cada visita (sem `localStorage`/`sessionStorage`). Estado de etapa vive apenas em memória (React state).

**Testing**: Vitest + @testing-library/react (já configurados); validação visual/manual real no navegador (desktop + mobile).

**Target Platform**: Navegadores modernos desktop e mobile — Chrome/Edge/Firefox, Safari iOS, Chrome Android.

**Project Type**: Web application (Next.js App Router existente, estrutura `src/`).

**Performance Goals**: Não bloquear o carregamento inicial — o vídeo usa `preload="metadata"`/`none` e só carrega ao entrar na etapa de vídeo; transição animada fluida (~60 fps) e início do vídeo em ≤3s após o clique (SC-002); revelar a home em <1 min de jornada total (SC-003).

**Constraints**: Overlay deve cobrir 100% da viewport e travar o scroll/foco do conteúdo de fundo (FR-001/FR-004); reprodução de vídeo iniciada dentro do gesto de clique para permitir som, com fallback visível de "ativar som" (FR-007); botão de pular sempre disponível (FR-008); caminho garantido até a home mesmo se o vídeo falhar (FR-011); respeitar `prefers-reduced-motion` (FR-013); alvos de toque ≥ 44px e contraste/labels acessíveis (constituição §3); música de fundo silenciada durante a abertura (FR-014).

**Scale/Scope**: 1 componente novo (`IntroOverlay`) + 1 hook de etapa (`useIntroSequence`); integração em 1 página (`InvitationSite`); 1 ajuste de gating em `<BackgroundMusic />`; 1 arquivo de vídeo servido de `public/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Abertura encantadora em qualquer dispositivo; botão de pular e caminho garantido à home evitam frustração. | ✅ Pass |
| 2. Privacidade e segurança | Nenhum dado sensível; nada persistido; sem RSVP nesta etapa. | ✅ Pass |
| 3. Acessibilidade | Botões com `aria-label`, foco gerenciado/trap no overlay, `prefers-reduced-motion` respeitado, alvos ≥44px, controle de som e de pular sempre visíveis; legendas/áudio nunca forçados sem alternativa. | ✅ Pass |
| 4. Performance e SEO | Vídeo carregado sob demanda (não no load); overlay client-side não afeta metadados/SSR da home. | ✅ Pass |
| 5. Design emocional sem excesso | Visual de princesa alinhado à paleta rosa/dourada; transições suaves sem poluição. | ✅ Pass |
| 6. TDD/validação | Testes unitários para a máquina de etapas (`useIntroSequence`) e o componente (render/skip/onComplete/fallback de vídeo) + build + validação visual real (desktop e mobile). | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/004-intro-invitation-video/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/
│   └── intro-overlay.contract.md   # Contrato de UI/comportamento do overlay
├── checklists/
│   └── requirements.md  # Checklist de qualidade da spec
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
public/
└── convite-video.mp4                 # Vídeo renomeado a partir do arquivo atual (nome web-safe)

src/
├── app/
│   ├── InvitationSite.tsx            # Monta <IntroOverlay /> e faz gating de <BackgroundMusic />
│   └── globals.css                   # (se necessário) ajustes de overlay/scroll-lock
├── components/
│   └── invitation/
│       ├── IntroOverlay.tsx          # Componente cliente: etapas invite → video → final
│       └── IntroOverlay.test.tsx     # Testes do componente (render/skip/onComplete/fallback)
└── hooks/
    ├── useIntroSequence.ts           # Hook: máquina de estados das etapas + handlers
    └── useIntroSequence.test.ts      # Testes da lógica de etapas
```

**Structure Decision**: Projeto único (Next.js App Router em `src/`). A funcionalidade é puramente client-side e se integra à página pública existente (`src/app/InvitationSite.tsx`), espelhando o padrão da feature 003: componente isolado em `src/components/invitation/` + hook em `src/hooks/` para manter a lógica testável e separada da página. O vídeo é servido estaticamente de `public/` com nome web-safe (`convite-video.mp4`), como fez a 003 com o áudio.

## Complexity Tracking

> Sem violações de constituição. Nada a justificar.
