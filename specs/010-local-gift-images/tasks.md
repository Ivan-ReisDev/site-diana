# Tasks: Local Gift Suggestion Images

**Feature**: Local Gift Suggestion Images | **Branch**: `010-local-gift-images`
**Input**: Design documents in `/specs/010-local-gift-images/`
**Prerequisites**: [plan.md](./plan.md), [spec.md](./spec.md), [research.md](./research.md), [data-model.md](./data-model.md), [contracts/gift-section.md](./contracts/gift-section.md)

**Tests**: Included — the project constitution (#6 TDD/validação) requires test + build validation, and a test (`GiftSuggestions.test.tsx`) already exists and will break without updates.

## Conventions

- All paths are repository-relative from `/home/deeivan/Área de trabalho/Developer/Empresa/site-diana/`.
- `[P]` = can run in parallel (different file, no dependency on an incomplete task).

---

## Phase 1: Setup

- [X] T001 Normalize the sensory-toys asset filename: `git mv "public/galeria/brinquedos/briquedos sensoriais.jpeg" "public/galeria/brinquedos/brinquedos-sensoriais.jpeg"` (removes the space + typo so the path resolves reliably)
- [X] T002 Verify all 8 expected files exist in `public/galeria/brinquedos/` (`brinquedos.jpeg`, `ursinho.jpeg`, `livros.jpeg`, `instrumentos-musicais.jpeg`, `brinquedos-educativos.jpeg`, `vestidinhos-roupas.jpeg`, `brinquedos-sensoriais.jpeg`, `sapatinhos.jpeg`)

---

## Phase 2: Foundational (blocking prerequisite for both stories)

**Purpose**: Repoint and trim the data arrays that drive every gift card. Both user stories read from these arrays, so this must complete first.

- [X] T003 In `src/components/invitation/GiftSuggestions.tsx`, set `giftItems[].imagem` for ids 1–8 to local paths per the map in [research.md](./research.md) (e.g. id1 → `/galeria/brinquedos/brinquedos.jpeg`, id2 → `/galeria/brinquedos/ursinho.jpeg`, … id7 → `/galeria/brinquedos/brinquedos-sensoriais.jpeg`, id8 → `/galeria/brinquedos/sapatinhos.jpeg`), removing all `images.pexels.com` URLs
- [X] T004 In `src/components/invitation/GiftSuggestions.tsx`, delete `giftItems` entries for ids 9, 10, 11 so exactly 8 items remain (keep `nome` values for ids 1–8 unchanged)
- [X] T005 In `src/components/invitation/GiftSuggestions.tsx`, delete `giftSuggestions` entries for `giftId` 9, 10, 11 so exactly 8 suggestions remain (idea text for ids 1–8 preserved verbatim)

**Checkpoint**: Component compiles; 8 cards reference only local images.

---

## Phase 3: User Story 1 — Guests see the host's own gift photos (Priority: P1) 🎯 MVP

**Goal**: Every visible gift card shows a host-provided local image; no previous external stock image appears.

**Independent Test**: Open the invitation page, scroll to "Sugestões de Presente", confirm every card shows a host photo and none load from pexels/external hosts.

- [X] T006 [US1] In `src/components/invitation/GiftSuggestions.test.tsx`, update C2 to assert `giftItems`/`giftSuggestions` have length **8** (was 11) and that all 8 nomes render as level-3 headings
- [X] T007 [P] [US1] In `src/components/invitation/GiftSuggestions.test.tsx`, add an assertion that every rendered gift image `src` starts with `/galeria/brinquedos/` and that no `src` matches `pexels` or `http` (enforces FR-002/FR-006/SC-004)
- [X] T008 [US1] Run `npx vitest run src/components/invitation/GiftSuggestions.test.tsx` and confirm C1–C8 plus the new assertions pass

**Checkpoint**: US1 is independently testable and delivers the MVP (personal local photos, no external images).

---

## Phase 4: User Story 2 — Each suggestion stays meaningful and consistent (Priority: P2)

**Goal**: The number of categories shown equals the number of provided images (8), each pairing topically correct, no card without an image, no leftover orphan category.

**Independent Test**: Review the section and confirm category count == 8 and each title matches its image subject.

- [X] T009 [US2] In `src/components/invitation/GiftSuggestions.tsx`, confirm no orphan data remains: every `giftSuggestions[].giftId` resolves to an existing `giftItems` entry and no removed category (9/10/11) is referenced anywhere in the file
- [X] T010 [P] [US2] In `src/components/invitation/GiftSuggestions.test.tsx`, verify the fallback path (C7) still holds — an item with empty `imagem` renders no broken `<img>` — keeping graceful degradation for a failed image load (edge case in spec)
- [X] T011 [US2] Visually confirm each of the 8 cards pairs the correct host photo with its title (id4 uses the single musical category `instrumentos-musicais.jpeg`); adjust a `nome`/idea wording only if an image↔title mismatch is found

**Checkpoint**: Section is coherent — 8 correct pairings, no orphan categories, fallback intact.

---

## Phase 5: Polish & Validation

- [X] T012 Run `npm run build` and confirm a clean production build (constitution #4/#6)
- [X] T013 Manual visual check on mobile and desktop: 8 cards render, no broken images, no layout shift, and the Network tab shows no request to `pexels.com` (SC-001, SC-004, SC-005)
- [X] T014 [P] Confirm no remaining reference to `pexels` exists in `src/` (`grep -rn pexels src/`) — should return nothing

---

## Dependencies & Execution Order

- **Phase 1 (Setup)** → **Phase 2 (Foundational)** → **Phase 3 (US1)** → **Phase 4 (US2)** → **Phase 5 (Polish)**.
- US1 (P1) is the MVP and can ship on its own once Phases 1–3 complete.
- US2 (P2) refines consistency and depends on the same component but adds no new data dependency beyond Phase 2.
- T007 and T010 are `[P]` (independent assertions in the test file relative to their phase peers); T014 is `[P]` (read-only grep). Within `GiftSuggestions.tsx`, T003–T005 and T009 touch the same file and must be sequential.

## Parallel Execution Examples

- After T003–T005: T007 (new src assertion) can be authored in parallel with T006's length update if split carefully, but since both edit the same test file, prefer sequential to avoid conflicts.
- In Phase 5: T014 (grep) can run in parallel with T012/T013.

## Implementation Strategy

1. **MVP (US1)**: Phases 1 → 2 → 3. Delivers the core ask — local host photos replacing all external images.
2. **Increment (US2)**: Phase 4 ensures the trimmed set is coherent (8 correct pairings, fallback intact).
3. **Harden**: Phase 5 build + visual + external-reference sweep.

## Task Count Summary

- Setup: 2 (T001–T002)
- Foundational: 3 (T003–T005)
- US1 (P1): 3 (T006–T008)
- US2 (P2): 3 (T009–T011)
- Polish: 3 (T012–T014)
- **Total: 14 tasks**
