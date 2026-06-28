---
description: "Task list for Música de fundo no convite"
---

# Tasks: Música de fundo no convite

**Input**: Design documents from `/specs/003-background-music/`

**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: INCLUÍDOS — a constituição do projeto (princípio 6, TDD/validação) exige testes; o plano define testes unitários para o hook e o componente.

**Organization**: Tarefas agrupadas por user story. Observação: US1, US2 e US3 compartilham os arquivos `useBackgroundMusic.ts` e `BackgroundMusic.tsx`, então, apesar de serem testáveis de forma independente, devem ser implementadas em sequência (P1 → P1 → P3), não em paralelo entre stories.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivos diferentes, sem dependências)
- **[Story]**: A qual user story a tarefa pertence (US1, US2, US3)
- Caminhos de arquivo exatos incluídos nas descrições

## Path Conventions

Projeto único (Next.js App Router em `src/`). Áudio servido de `public/`.

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparar o ativo de áudio e a estrutura de pastas.

- [x] T001 Copiar o áudio para um nome web-safe: criar `public/musica-convite.mp3` a partir de `public/A Dream Is a Wish Your Heart Makes.mp3.mpeg` (conteúdo já é MP3 válido)
- [x] T002 [P] Garantir a existência das pastas `src/components/invitation/` e `src/hooks/`

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Infraestrutura compartilhada por todas as stories — o elemento de áudio e o esqueleto do componente/hook montados na página pública.

**⚠️ CRITICAL**: Nenhuma user story pode começar antes desta fase.

- [x] T003 Criar o esqueleto do hook em `src/hooks/useBackgroundMusic.ts` (assina `(audioRef, { volume = 0.3 })`, retorna `{ isPlaying, toggle }` como stub, sem lógica de reprodução)
- [x] T004 Criar `src/components/invitation/BackgroundMusic.tsx` (componente cliente `"use client"`) com elemento oculto `<audio loop preload="none" src="/musica-convite.mp3">` referenciado por `ref`, volume aplicado via ref, consumindo `useBackgroundMusic`
- [x] T005 Montar `<BackgroundMusic />` em `src/app/InvitationSite.tsx` (somente a página pública; NÃO no `RootLayout`, painel ou login)

**Checkpoint**: Áudio presente na página `/`, sem lógica de disparo ainda; build passa.

---

## Phase 3: User Story 1 - Música começa ao interagir (Priority: P1) 🎯 MVP

**Goal**: A música dispara no primeiro gesto do usuário (rolar/clicar/tocar/tecla), em volume baixo e em loop, sem nunca esbarrar no bloqueio de autoplay.

**Independent Test**: Abrir `/`, não interagir (silêncio, sem erro no console); fazer um gesto → música começa em ≤1s em volume baixo; gestos adicionais não reiniciam.

### Tests for User Story 1 ⚠️ (escrever primeiro, devem FALHAR)

- [x] T006 [P] [US1] Testes unitários em `src/hooks/useBackgroundMusic.test.ts`: não chama `play()` antes do gesto (C1); chama `play()` no primeiro gesto (C2); não re-dispara em gestos subsequentes (C8)

### Implementation for User Story 1

- [ ] T007 [US1] Em `src/hooks/useBackgroundMusic.ts`: registrar listeners globais `pointerdown`/`click`/`touchstart`/`keydown`/`scroll` com `{ once: true, passive: true }`; no primeiro gesto, aplicar `volume = 0.3`, garantir `loop` e chamar `play()` uma única vez (`hasStarted`)
- [ ] T008 [US1] Em `src/hooks/useBackgroundMusic.ts`: tratar rejeição da Promise de `play()` com try/catch (falha silenciosa, sem erro visível — C9); limpar listeners no unmount

**Checkpoint**: US1 funcional e testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Convidado controla a música (Priority: P1)

**Goal**: Controle flutuante visível e acessível para ligar/desligar a música a qualquer momento; a escolha manual prevalece sobre o disparo automático.

**Independent Test**: Com a música tocando, localizar e acionar o controle → para imediatamente; acionar de novo → retoma; após desligar, novos gestos não religam.

### Tests for User Story 2 ⚠️ (escrever primeiro, devem FALHAR)

- [x] T009 [P] [US2] Testes em `src/components/invitation/BackgroundMusic.test.tsx`: botão renderiza com `aria-label` dinâmico e `aria-pressed`; clicar pausa (`isPlaying=false`) e retoma; ícone alterna `Volume2`/`VolumeX`
- [x] T010 [P] [US2] Testes em `src/hooks/useBackgroundMusic.test.ts`: `toggle()` alterna `isPlaying` e chama `play()`/`pause()` no áudio (C4/C5)

### Implementation for User Story 2

- [ ] T011 [US2] Em `src/hooks/useBackgroundMusic.ts`: implementar `toggle()` (play/pause + atualizar `isPlaying`)
- [ ] T012 [US2] Em `src/components/invitation/BackgroundMusic.tsx`: implementar o botão flutuante fixo (canto inferior) com ícones `Volume2`/`VolumeX` (lucide-react), `aria-label` dinâmico, `aria-pressed`, focável por teclado, alvo de toque ≥ 44px
- [ ] T013 [US2] Em `src/hooks/useBackgroundMusic.ts`: garantir que, após desligar manualmente, novos gestos NÃO religam automaticamente (C6)

**Checkpoint**: US1 + US2 funcionam de forma independente.

---

## Phase 5: User Story 3 - Preferência lembrada na navegação (Priority: P3)

**Goal**: Lembrar a escolha de áudio do usuário durante a visita (incl. reload), respeitando "desligado".

**Independent Test**: Desligar a música, recarregar a página, fazer um gesto → permanece desligada. Sem alteração prévia → toca normalmente no primeiro gesto.

### Tests for User Story 3 ⚠️ (escrever primeiro, devem FALHAR)

- [x] T014 [P] [US3] Testes em `src/hooks/useBackgroundMusic.test.ts`: lê `sessionStorage` `bgMusic`; valor `"off"` impede `play()` no primeiro gesto (C3); `toggle()` grava `"on"`/`"off"`; ausência da chave = padrão "on"

### Implementation for User Story 3

- [ ] T015 [US3] Em `src/hooks/useBackgroundMusic.ts`: ler/gravar `sessionStorage.bgMusic` (try/catch); padrão "on"; respeitar "off" no disparo por gesto; `toggle()` persiste o novo estado

**Checkpoint**: Todas as user stories funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Acabamento visual, validação e limpeza.

- [ ] T016 [P] Estilizar o controle flutuante alinhado à paleta rosa/dourada em `src/components/invitation/BackgroundMusic.tsx` (e `src/app/globals.css` se necessário)
- [x] T017 Rodar `npm test` e `npm run build` — todos verdes
- [x] T018 Validação manual conforme `specs/003-background-music/quickstart.md`: desktop + mobile (iOS/Android), confirmar disparo por toque, volume agradável, e que `/dashboard` e `/login` ficam em silêncio (FR-010)
- [x] T019 [P] Remover o arquivo de áudio antigo `public/A Dream Is a Wish Your Heart Makes.mp3.mpeg` se não houver mais referências

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sem dependências — pode iniciar imediatamente.
- **Foundational (Phase 2)**: Depende do Setup — BLOQUEIA todas as user stories.
- **User Stories (Phase 3–5)**: Dependem da Fase 2. Como compartilham `useBackgroundMusic.ts`/`BackgroundMusic.tsx`, devem ser feitas em sequência de prioridade (US1 → US2 → US3).
- **Polish (Phase 6)**: Depende das stories desejadas estarem completas.

### User Story Dependencies

- **US1 (P1)**: Inicia após a Fase 2. Sem dependência de outras stories.
- **US2 (P1)**: Inicia após a Fase 2. Reaproveita `isPlaying`/`audioRef` da base; independentemente testável.
- **US3 (P3)**: Inicia após a Fase 2. Camada de persistência sobre o disparo da US1; independentemente testável.

### Within Each User Story

- Testes escritos e FALHANDO antes da implementação (TDD).
- Hook (lógica) antes do componente (UI) quando aplicável.
- Story completa antes de passar à próxima prioridade.

### Parallel Opportunities

- T002 (Setup) é [P].
- Dentro de cada story, os arquivos de teste em arquivos distintos são [P] (ex.: T009 vs T010).
- Entre stories NÃO há paralelismo: arquivos compartilhados (`useBackgroundMusic.ts`, `BackgroundMusic.tsx`).
- T016 e T019 (Polish) são [P] entre si.

---

## Parallel Example: User Story 2

```bash
# Testes da US2 em arquivos diferentes podem rodar juntos:
Task: "T009 BackgroundMusic.test.tsx — controle/acessibilidade/alternância"
Task: "T010 useBackgroundMusic.test.ts — toggle() alterna play/pause"
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Fase 1: Setup (áudio + pastas)
2. Fase 2: Foundational (áudio montado na página)
3. Fase 3: US1 (disparo por gesto)
4. **PARAR e VALIDAR**: música dispara no gesto, em loop, sem erro de autoplay
5. Demonstrável como MVP

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → validar → MVP (música toca)
3. US2 → validar → controle ligar/desligar
4. US3 → validar → preferência lembrada
5. Polish → estilo, build, validação manual desktop/mobile

---

## Notes

- [P] = arquivos diferentes, sem dependências.
- [Story] mapeia a tarefa à user story para rastreabilidade.
- Verificar que os testes falham antes de implementar (TDD).
- Commit após cada tarefa ou grupo lógico.
- Atenção: US1/US2/US3 editam os mesmos arquivos do hook/componente — implementar em sequência para evitar conflitos.
