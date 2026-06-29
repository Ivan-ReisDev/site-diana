# Implementation Plan: Local Gift Suggestion Images

**Branch**: `010-local-gift-images` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/010-local-gift-images/spec.md`

## Summary

Replace the 11 external (Pexels) gift-suggestion images in the invitation's "Sugestões de Presente" section with the 8 host-provided photos in `public/galeria/brinquedos/`, served locally. Reduce the section from 11 categories to the 8 that have a matching local image (confirmed by the host), keeping each retained category's title and gift-idea text. The work is a focused edit to a single presentational component plus its test, with one asset normalization (rename the sensory-toys file that has a space + typo).

## Technical Context

**Language/Version**: TypeScript 5 / React 19.2.4 / Next.js 16.2.7 (App Router)

**Primary Dependencies**: Next.js, React, framer-motion 12, lucide-react (already used by the component)

**Storage**: N/A — images are static files under `public/galeria/brinquedos/`

**Testing**: Vitest + @testing-library/react (existing `GiftSuggestions.test.tsx`)

**Target Platform**: Web (mobile-first responsive); served by Next.js `output: "standalone"`

**Project Type**: Web application (single Next.js app, `src/` structure)

**Performance Goals**: No new network requests for gift images (local assets); no layout shift; lazy-loaded images

**Constraints**: Images referenced via root-relative public paths (`/galeria/brinquedos/...`), consistent with `PhotoGalleryCarousel`; plain `<img loading="lazy">` already used by this component (no `next/image` migration needed)

**Scale/Scope**: 1 component file, 1 test file, 8 static images, 1 asset rename. ~8 gift cards rendered.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Impact | Status |
|-----------|--------|--------|
| 1. Valor para convidados primeiro | Personal photos improve the gift section; responsive layout unchanged | ✅ Pass |
| 2. Privacidade e segurança | Images are non-sensitive gift photos; no RSVP/personal data touched | ✅ Pass |
| 3. Acessibilidade | Each image keeps meaningful `alt` (FR-007); fallback for missing image preserved | ✅ Pass |
| 4. Performance e SEO | Local assets remove external requests (SC-004); lazy loading kept; fixed aspect ratio avoids CLS | ✅ Pass |
| 5. Design emocional sem excesso | Same card layout/styling; only image source and category count change | ✅ Pass |
| 6. TDD/validação | Test updated to assert 8 local-image categories with implementation; build + visual check required | ✅ Pass |

No violations. Complexity Tracking not required.

## Project Structure

### Documentation (this feature)

```text
specs/010-local-gift-images/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/
│   └── gift-section.md  # UI/data contract for the section
├── checklists/
│   └── requirements.md  # Spec quality checklist (from /speckit-specify)
└── tasks.md             # Phase 2 output (/speckit-tasks — NOT created here)
```

### Source Code (repository root)

```text
public/galeria/brinquedos/          # Host-provided gift images (8 files)
├── brinquedos.jpeg
├── ursinho.jpeg
├── livros.jpeg
├── instrumentos-musicais.jpeg
├── brinquedos-educativos.jpeg
├── vestidinhos-roupas.jpeg
├── brinquedos-sensoriais.jpeg      # renamed from "briquedos sensoriais.jpeg" (space + typo)
└── sapatinhos.jpeg

src/components/invitation/
├── GiftSuggestions.tsx             # EDIT: giftItems[].imagem → local paths; trim to 8 categories
└── GiftSuggestions.test.tsx        # EDIT: assert 8 categories + local /galeria/brinquedos/ srcs
```

**Structure Decision**: Single Next.js web app. The change is isolated to the presentational `GiftSuggestions` component, its colocated test, and the static assets it references. No routing, API, or data-layer changes.

## Complexity Tracking

> No constitution violations — section intentionally empty.
