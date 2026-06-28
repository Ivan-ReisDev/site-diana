---
description: "Task list for Tela de Abertura com Convocação Real e Vídeo"
---

# Tasks: Tela de Abertura com Convocação Real e Vídeo

**Input**: Design documents from `/specs/004-intro-invitation-video/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/intro-overlay.contract.md, quickstart.md

**Tests**: INCLUÍDOS — a constituição do projeto (§6 TDD/validação) e o Constitution Check do plano exigem testes unitários. Os testes usam Vitest + @testing-library/react (já configurados).

**Organization**: Tarefas agrupadas por user story (US1 → US2 → US3), em ordem de prioridade.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: User story à qual a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos nas descrições

## Path Conventions

- Projeto único Next.js App Router em `src/`; assets estáticos em `public/`. Caminhos relativos à raiz do repositório.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Disponibilizar o asset de vídeo e criar os esqueletos de arquivo.

- [X] T001 Copiar o vídeo para nome web-safe: `cp "public/WhatsApp Video 2026-06-28 at 16.16.17.mp4" public/convite-video.mp4`
- [X] T002 [P] Criar esqueleto do hook em `src/hooks/useIntroSequence.ts` (`"use client"`, tipos `Stage`/`VideoStatus` e assinatura `UseIntroSequenceResult` conforme `contracts/intro-overlay.contract.md`)
- [X] T003 [P] Criar esqueleto do componente em `src/components/invitation/IntroOverlay.tsx` (`"use client"`, props `onComplete`/`videoSrc`/`inviteMessage` com defaults)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Máquina de estados e a fiação de integração que TODAS as stories usam (overlay, scroll-lock, gating da música).

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [X] T004 Implementar a máquina de estados em `src/hooks/useIntroSequence.ts` (`stage` invite→video→final, `videoStatus`, `soundOn`, handlers `start`/`skip`/`onVideoEnded`/`onVideoError`/`toggleSound`) conforme transições em `data-model.md`
- [X] T005 [P] Testes unitários do hook em `src/hooks/useIntroSequence.test.ts` (transições invite→video→final, skip, onVideoEnded, onVideoError mantém caminho a final, toggleSound)
- [X] T006 Integrar o overlay em `src/app/InvitationSite.tsx`: adicionar `const [introDone, setIntroDone] = useState(false)` e renderizar `<IntroOverlay onComplete={() => setIntroDone(true)} />` enquanto `!introDone` (envolto em `AnimatePresence`)
- [X] T007 Implementar scroll-lock no `IntroOverlay.tsx`: `useEffect` que aplica `document.body.style.overflow = "hidden"` enquanto montado e restaura no cleanup (FR-004)
- [X] T008 Aplicar gating da música em `src/app/InvitationSite.tsx`: trocar `<BackgroundMusic />` por `{introDone && <BackgroundMusic />}` (FR-014)

**Checkpoint**: Hook testado e fiação pronta — o trabalho das stages pode começar.

---

## Phase 3: User Story 1 - Receber a Convocação Real ao abrir o convite (Priority: P1) 🎯 MVP

**Goal**: Ao abrir o site, um overlay em tela cheia cobre tudo e exibe a mensagem da Convocação Real com um botão de princesa.

**Independent Test**: Abrir o site e confirmar que o overlay cobre 100% da tela (home inacessível), com a mensagem e o botão visíveis e responsivos.

### Tests for User Story 1

- [X] T009 [P] [US1] Teste de componente em `src/components/invitation/IntroOverlay.test.tsx`: etapa `invite` renderiza a mensagem da Convocação Real e o botão de início

### Implementation for User Story 1

- [X] T010 [US1] Implementar a etapa `invite` em `src/components/invitation/IntroOverlay.tsx`: container `fixed inset-0 z-[100]` com fundo opaco/floral, mensagem e botão de princesa de destaque (usar a skill **frontend-design** para o visual; alvo de toque ≥ 44px) (FR-001, FR-002, FR-003)
- [X] T011 [US1] Ligar o botão de início ao `start()` do hook, disparando a troca para a etapa de vídeo (FR-005)

**Checkpoint**: Overlay de abertura funcional e testável — MVP entregue.

---

## Phase 4: User Story 2 - Assistir ao vídeo do convite (Priority: P2)

**Goal**: Tocar no botão abre uma transição animada para um fundo preto com o vídeo centralizado, iniciando com som, com opção de pular e de silenciar.

**Independent Test**: A partir do overlay, clicar no botão e confirmar transição → fundo preto → vídeo centralizado iniciando; "Pular" e toggle de som funcionam; vídeo que falha ainda permite avançar.

### Tests for User Story 2

- [X] T012 [P] [US2] Testes de componente em `src/components/invitation/IntroOverlay.test.tsx`: clicar em iniciar mostra a etapa de vídeo com `<video>` e botão "Pular"; `onError` mantém um caminho de avançar; `toggleSound` alterna `soundOn`

### Implementation for User Story 2

- [X] T013 [US2] Implementar a etapa `video` em `src/components/invitation/IntroOverlay.tsx`: fundo `bg-black`, `<video>` centralizado, `preload="none"`, `src={videoSrc}` (FR-006)
- [X] T014 [US2] Iniciar `video.play()` com som dentro do gesto de `start()` e tratar `onEnded`/`onError` (avança/permite avançar a `final`) (FR-007, FR-011)
- [X] T015 [US2] Adicionar o botão "Pular" (sempre visível) ligado a `skip()` e o controle de som ligado a `toggleSound()` (FR-008, FR-007)
- [X] T016 [US2] Adicionar transição animada `invite → video` com `framer-motion` (`AnimatePresence`/`motion`) em `IntroOverlay.tsx` (FR-005)

**Checkpoint**: Vídeo reproduz em fundo preto, pulável e com som controlável; música permanece silenciada (validar gating do T008).

---

## Phase 5: User Story 3 - Confirmar presença e entrar na home (Priority: P3)

**Goal**: Ao fim/skip do vídeo, surgem a mensagem final e o botão "Confirmar Presença", que encerra a abertura e revela a home (com a música iniciando na home).

**Independent Test**: Aguardar o vídeo terminar (ou pular) e confirmar que aparecem a mensagem final e "Confirmar Presença"; clicá-lo revela a home e a música passa a poder tocar.

### Tests for User Story 3

- [X] T017 [P] [US3] Teste de componente em `src/components/invitation/IntroOverlay.test.tsx`: `onEnded`/skip mostra a etapa `final` com a mensagem e o botão "Confirmar Presença"; clicar chama `onComplete`

### Implementation for User Story 3

- [X] T018 [US3] Implementar a etapa `final` em `src/components/invitation/IntroOverlay.tsx`: mensagem da Convocação Real + botão "Confirmar Presença" (FR-009)
- [X] T019 [US3] Ligar "Confirmar Presença" ao `onComplete()` e validar em `src/app/InvitationSite.tsx` que `introDone=true` desmonta o overlay (com saída via `AnimatePresence`) e monta `<BackgroundMusic />` (FR-010, FR-014)

**Checkpoint**: Jornada completa (abertura → vídeo → confirmar → home) funcional.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Acessibilidade, responsividade, reduced-motion e validação final.

- [X] T020 [P] Respeitar `prefers-reduced-motion` via `useReducedMotion()` do framer-motion em `src/components/invitation/IntroOverlay.tsx` (simplificar transições) (FR-013)
- [X] T021 Passagem de acessibilidade/responsividade em `src/components/invitation/IntroOverlay.tsx`: `aria-label` nos botões, foco inicial no botão principal e foco contido no overlay, alvos ≥ 44px, legibilidade de 320px a 1920px em retrato e paisagem (FR-012, constituição §3)
- [X] T022 Rodar `npm test` e `npm run build` e corrigir falhas (constituição §6)
- [X] T023 Validação visual real (desktop + mobile) seguindo o checklist de `specs/004-intro-invitation-video/quickstart.md`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências — pode começar imediatamente.
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories.
- **User Stories (Phase 3–5)**: dependem da Foundational. As três stages compartilham o arquivo `IntroOverlay.tsx`, então, neste código, recomenda-se ordem sequencial P1 → P2 → P3 (mesmo arquivo).
- **Polish (Phase 6)**: depende das stories desejadas concluídas.

### User Story Dependencies

- **US1 (P1)**: começa após a Foundational. Entrega o MVP (overlay + convite).
- **US2 (P2)**: estende `IntroOverlay.tsx` com a etapa de vídeo; logicamente sobre a US1.
- **US3 (P3)**: estende `IntroOverlay.tsx` com a etapa final; sobre a US2.

### Within Each User Story

- Teste do componente escrito antes da implementação da stage (deve falhar primeiro).
- Hook (Foundational) antes das stages.
- Implementação de UI antes da fiação de integração no host.

### Parallel Opportunities

- Setup: T002 e T003 em paralelo (arquivos diferentes).
- Foundational: T005 (teste do hook) em paralelo com a integração do host (T006/T008), pois são arquivos distintos.
- Testes de cada story ([P]) podem ser escritos cedo; a implementação das stages é sequencial por compartilhar `IntroOverlay.tsx`.
- Polish: T020 antes do fim; T022/T023 ao final.

---

## Parallel Example: Setup + Foundational

```bash
# Setup — arquivos diferentes, em paralelo:
Task: "Criar esqueleto do hook em src/hooks/useIntroSequence.ts"          # T002
Task: "Criar esqueleto do componente em src/components/invitation/IntroOverlay.tsx"  # T003

# Foundational — teste do hook em paralelo com integração do host:
Task: "Testes unitários do hook em src/hooks/useIntroSequence.test.ts"    # T005
Task: "Gating da música em src/app/InvitationSite.tsx"                    # T008
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup.
2. Phase 2: Foundational (hook + integração + scroll-lock + gating).
3. Phase 3: US1 — overlay de Convocação Real com botão.
4. **PARAR e VALIDAR**: overlay cobre a tela e exibe convite/botão.

### Incremental Delivery

1. Setup + Foundational → fundação pronta.
2. US1 → valida → MVP (convite encantador).
3. US2 → valida → vídeo em fundo preto, pulável, com som controlado.
4. US3 → valida → confirmar presença revela a home e a música.
5. Polish → acessibilidade/responsividade/reduced-motion + build + validação visual.

---

## Notes

- [P] = arquivos diferentes, sem dependências.
- As três stages vivem em `IntroOverlay.tsx`; evitar conflitos editando-as em sequência.
- Verificar que os testes falham antes de implementar.
- Commit após cada task ou grupo lógico.
- Sem novas dependências; sem dados persistidos; abertura aparece a cada visita.
