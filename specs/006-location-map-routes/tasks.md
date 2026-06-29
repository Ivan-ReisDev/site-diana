---
description: "Task list for Mapa de Localização com Rotas"
---

# Tasks: Mapa de Localização com Rotas

**Input**: Design documents from `/specs/006-location-map-routes/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/location-map.contract.md, quickstart.md

**Tests**: INCLUÍDOS — exigidos pelo Princípio 6 da constituição (TDD/validação) e pelo Constitution Check do plano.

**Organization**: Tarefas agrupadas por user story. Observação: as três stories compartilham o componente `src/components/invitation/LocationMap.tsx`, então a paralelização entre stories é limitada (mesmo arquivo); a entrega é incremental dentro do mesmo componente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Pode rodar em paralelo (arquivo diferente, sem dependência pendente)
- **[Story]**: User story (US1, US2, US3)
- Caminhos de arquivo exatos incluídos

## Path Conventions

- Projeto único Next.js App Router em `src/` (conforme plan.md)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Preparação e leitura de convenções desta versão do Next.js

- [X] T001 Consultar `node_modules/next/dist/docs/01-app/` para confirmar convenções de Client/Server Components e uso de `<iframe>`/assets nesta versão (Next 16.2.7 / React 19.2.4, App Router + Turbopack), conforme AGENTS.md
- [X] T002 [P] Criar arquivo de testes vazio `src/components/invitation/LocationMap.test.tsx` (imports do Vitest + @testing-library/react, seguindo o padrão de `PhotoGalleryCarousel.test.tsx`)

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Dados do local e scaffold do componente — base compartilhada por TODAS as stories

**⚠️ CRITICAL**: Nenhuma user story começa antes desta fase

- [X] T003 Adicionar o objeto `venue` (`{ name, address, coords? }`) em `src/app/InvitationSite.tsx`, reutilizando o local já em `eventDetails` ("Casa de Festas Turma da Kali" / "Est. Padre Roser, 765 - Vila da Penha, Rio de Janeiro") — fonte única para mapa e rota (FR-009)
- [X] T004 Criar scaffold de `src/components/invitation/LocationMap.tsx` como componente cliente que recebe `venue: { name; address; coords? }` e computa `const target = encodeURIComponent(venue.coords ?? venue.address)` (sem renderizar mapa/botão ainda)

**Checkpoint**: `venue` e o componente base existem — as user stories podem começar

---

## Phase 3: User Story 1 - Visualizar o local do evento no mapa (Priority: P1) 🎯 MVP

**Goal**: Exibir a seção de localização com o mapa do Google Maps incorporado (pino no local) e o endereço por extenso sempre legível.

**Independent Test**: Abrir o convite, rolar até a seção `#local` e confirmar que o mapa aparece centralizado no local com o endereço em texto, mesmo se o mapa não carregar.

### Tests for User Story 1 ⚠️ (escrever primeiro e garantir que FALHAM)

- [X] T005 [P] [US1] Em `src/components/invitation/LocationMap.test.tsx`, teste C1: renderiza `venue.name` e `venue.address` como texto legível no DOM
- [X] T006 [P] [US1] Em `src/components/invitation/LocationMap.test.tsx`, teste C2/C3: existe `<iframe>` com `title` não vazio (ex.: `Mapa: <name>`), `src` exatamente `https://maps.google.com/maps?q=${target}&output=embed` e `loading="lazy"`

### Implementation for User Story 1

- [X] T007 [US1] Em `src/components/invitation/LocationMap.tsx`, renderizar o `<iframe>` do mapa (title descritivo, `src` de embed, `loading="lazy"`) emoldurado com cantos arredondados na paleta atual + `venue.name`/`venue.address` em texto legível — até T005/T006 passarem
- [X] T008 [US1] Em `src/app/InvitationSite.tsx`, inserir `<motion.section id="local">` após a seção `#evento` (com o divisor da coroa, padrão `whileInView`) montando `<LocationMap venue={venue} />`
- [X] T009 [US1] Ajustar responsividade da seção (320px–1920px): o `<iframe>` ocupa largura total sem estourar, com proporção/altura confortável em mobile e desktop (FR-008, SC-004)

**Checkpoint**: A seção de localização aparece com mapa + endereço, testável de forma independente (MVP).

---

## Phase 4: User Story 2 - Traçar rota a partir da localização atual (Priority: P1)

**Goal**: Botão "Como chegar" que abre o Google Maps com o destino preenchido e a localização atual do convidado como origem automática (sem o site pedir geolocalização).

**Independent Test**: Tocar em "Como chegar" e confirmar que abre o Google Maps com o destino = local do evento; em dispositivo com localização ativa, a rota parte da posição atual.

### Tests for User Story 2 ⚠️ (escrever primeiro e garantir que FALHAM)

- [X] T010 [P] [US2] Em `src/components/invitation/LocationMap.test.tsx`, teste C4/C5: existe link "Como chegar" (`<a>`) com `href` exatamente `https://www.google.com/maps/dir/?api=1&destination=${target}` e que **não** contém `origin`
- [X] T011 [P] [US2] Em `src/components/invitation/LocationMap.test.tsx`, teste C6: o link tem `target="_blank"` e `rel` contendo `noopener` e `noreferrer`
- [X] T012 [P] [US2] Em `src/components/invitation/LocationMap.test.tsx`, teste C7/C8: `src` do mapa e `href` da rota derivam do mesmo `target`; e o componente **não** chama `navigator.geolocation` (spy não invocado)

### Implementation for User Story 2

- [X] T013 [US2] Em `src/components/invitation/LocationMap.tsx`, renderizar o link/botão "Como chegar" (`<a target="_blank" rel="noopener noreferrer" href=...>` com ícone `lucide-react`, ex. `Navigation`/`MapPin`, alvo ≥ 44px), usando `directionsHref` derivado de `target` sem `origin` — até T010–T012 passarem

**Checkpoint**: Mapa (US1) e rota (US2) funcionam de forma independente.

---

## Phase 5: User Story 3 - Escolher o aplicativo de navegação (Priority: P3)

**Goal**: Garantir que a rota abra num app de navegação compatível com o dispositivo (app Google Maps se instalado, senão versão web), via URL universal.

**Independent Test**: Em dispositivos diferentes (Android/iOS/desktop), tocar em "Como chegar" e confirmar que abre uma navegação válida em cada um.

### Tests for User Story 3 ⚠️

- [X] T014 [P] [US3] Em `src/components/invitation/LocationMap.test.tsx`, teste: o `href` da rota usa o formato universal `https://www.google.com/maps/dir/?api=1...` (compatível cross-platform, com fallback web)

### Implementation for User Story 3

- [X] T015 [US3] Validação manual cross-device (Android com app, iOS, desktop sem app): confirmar que "Como chegar" abre app Google Maps quando instalado e a versão web quando não — sem alteração de código se T013 já usa a URL universal (registrar resultado no checklist do quickstart)

**Checkpoint**: Todas as user stories funcionam de forma independente.

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Acessibilidade, build, validação real

- [X] T016 [P] [US1] Verificar acessibilidade (A1–A3): `title` do iframe não vazio, botão focável por teclado com rótulo claro, alvo de toque ≥ 44px
- [X] T017 Rodar a suíte completa e o build: `npx vitest run` e `npm run build` (sem regressões)
- [X] T018 Executar a validação manual do `specs/006-location-map-routes/quickstart.md` (desktop + mobile real): endereço sempre legível (SC-001), rota em ≤ 2 toques (SC-002), origem = posição atual (SC-003), responsivo (SC-004), mapa visível ~3s (SC-005), e fluxo de permissão negada (FR-006)

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: sem dependências
- **Foundational (Phase 2)**: depende do Setup — BLOQUEIA todas as stories
- **User Stories (Phase 3+)**: dependem da Foundational
  - US1 e US2 tocam o mesmo arquivo (`LocationMap.tsx`) → executar US1 antes de US2 (sequencial) para evitar conflito; US2 adiciona o botão ao componente já criado
  - US3 depende de US2 (reaproveita o link universal)
- **Polish (Phase 6)**: depende das stories desejadas concluídas

### User Story Dependencies

- **US1 (P1)**: começa após Foundational — entrega o MVP (seção + mapa + endereço)
- **US2 (P1)**: após Foundational; na prática após US1 por compartilhar `LocationMap.tsx`
- **US3 (P3)**: após US2 (o link universal já entrega o comportamento)

### Within Each User Story

- Testes escritos e FALHANDO antes da implementação
- Componente base (Foundational) antes do conteúdo de cada story
- Story completa antes de passar para a próxima prioridade

### Parallel Opportunities

- T001 e T002 (Setup) podem ser paralelos
- Dentro de cada story, os testes marcados [P] (mesmo arquivo, mas escritos juntos antes da implementação) podem ser preparados em conjunto
- Atenção: US1 e US2 NÃO devem ser paralelizadas entre si — ambas editam `LocationMap.tsx`

---

## Parallel Example: User Story 1

```bash
# Escrever os testes de US1 juntos (mesmo arquivo de teste), antes de implementar:
Task: "C1 — render de name/address em LocationMap.test.tsx"
Task: "C2/C3 — iframe title/src/lazy em LocationMap.test.tsx"
# Depois implementar T007/T008/T009 até passarem.
```

---

## Implementation Strategy

### MVP First (User Story 1)

1. Phase 1: Setup (docs + arquivo de teste)
2. Phase 2: Foundational (`venue` + scaffold do componente)
3. Phase 3: US1 (mapa + endereço + seção montada)
4. **PARAR e VALIDAR**: a seção de localização aparece e é testável isoladamente
5. Demo se pronto

### Incremental Delivery

1. Setup + Foundational → base pronta
2. US1 → testar → demo (MVP: mostra onde é o evento)
3. US2 → testar → demo (botão de rota da posição atual)
4. US3 → validação cross-device → demo (compatibilidade de apps)

---

## Notes

- [P] = arquivos diferentes, sem dependência; US1/US2 compartilham `LocationMap.tsx` (não paralelizar entre si)
- Verificar que os testes falham antes de implementar (Princípio 6)
- O site **não** chama `navigator.geolocation` — a origem é resolvida pelo app de mapas (FR-005, Privacidade)
- Commit após cada task ou grupo lógico
- Validação visual real é obrigatória (Princípio 6)
