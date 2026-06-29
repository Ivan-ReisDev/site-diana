# Phase 0 Research: Local Gift Suggestion Images

No `NEEDS CLARIFICATION` markers remained in the spec. The only open decision (11→8 categories) was confirmed by the host. The items below record the technical decisions driving implementation.

## Decision 1 — Reference images as local public assets

- **Decision**: Reference each image as a root-relative path under `/galeria/brinquedos/` (e.g., `/galeria/brinquedos/ursinho.jpeg`), set on `giftItems[].imagem`.
- **Rationale**: `PhotoGalleryCarousel` already references gallery images this way (`/galeria/diana-1.jpg`). Files in `public/` are served from the site root by Next.js. This satisfies FR-006 (locally served) and SC-004 (no external requests).
- **Alternatives considered**: Importing images as modules / `next/image` — rejected: the component intentionally uses a plain `<img loading="lazy">` with a fallback path, and the test asserts that exact behavior (C6/C7). Keeping `<img>` is the smallest correct change.

## Decision 2 — Normalize the sensory-toys filename

- **Decision**: Rename `public/galeria/brinquedos/briquedos sensoriais.jpeg` → `brinquedos-sensoriais.jpeg` (remove the space and fix the typo), then reference the normalized name.
- **Rationale**: A filename with a space requires URL-encoding (`%20`) and is error-prone; the typo ("briquedos") is undesirable in a URL. Normalizing resolves the spec edge case reliably and matches the hyphenated convention of the other files.
- **Alternatives considered**: Keep the name and URL-encode the space — rejected as fragile and inconsistent.

## Decision 3 — Image → category mapping (8 retained)

| Image file | Retained category (id) | Title kept |
|------------|------------------------|------------|
| `brinquedos.jpeg` | 1 | Brinquedos interativos |
| `ursinho.jpeg` | 2 | Bichinhos de pelúcia |
| `livros.jpeg` | 3 | Livrinhos infantis |
| `instrumentos-musicais.jpeg` | 4 | Brinquedos musicais |
| `brinquedos-educativos.jpeg` | 5 | Brinquedos educativos |
| `vestidinhos-roupas.jpeg` | 6 | Roupinhas e Vestidinhos |
| `brinquedos-sensoriais.jpeg` | 7 | Brinquedos sensoriais |
| `sapatinhos.jpeg` | 8 | Sapatinhos e Sandálias |

- **Removed categories (no provided image)**: 9 "Brinquedos de encaixe ou montar", 10 "Brinquedos de puxar ou empurrar", 11 "Instrumentos musicais infantis" (redundant second musical category — the single musical category 4 is kept).
- **Rationale**: Each retained pairing is topically correct (FR-003); removed categories have no matching asset (FR-004). The gift-idea text for ids 1–8 is preserved verbatim (FR-005).

## Decision 4 — Keep the fallback path

- **Decision**: Leave the existing "no image → Sparkles fallback" branch in place even though all 8 retained items will have an image.
- **Rationale**: Test C7 dynamically pushes an image-less item to verify graceful degradation (edge case: image fails to load). Removing the branch would break that contract and the accessibility guarantee.
