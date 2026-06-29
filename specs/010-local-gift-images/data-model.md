# Phase 1 Data Model: Local Gift Suggestion Images

This feature has no database or API entities. The "data" is the static, in-component arrays that drive the gift section. Shapes are unchanged; only values change.

## Entity: GiftItem

The visual identity of a gift category.

| Field | Type | Notes / Validation |
|-------|------|--------------------|
| `id` | number | Unique within `giftItems`; values 1–8 after this change |
| `nome` | string | Category title shown as the card heading and used as image `alt` |
| `imagem` | string | Root-relative public path `/galeria/brinquedos/<file>.jpeg`; non-empty for all 8 retained items |

**Validation rules**
- Exactly 8 items after this change (was 11).
- Every `imagem` resolves to an existing file in `public/galeria/brinquedos/`.
- Every `imagem` is a local path (must not start with `http`).

## Entity: GiftSuggestion

The textual gift ideas for a category.

| Field | Type | Notes / Validation |
|-------|------|--------------------|
| `giftId` | number | Must match an existing `GiftItem.id` |
| `ideias` | string[] | ≥ 1 idea per category; preserved verbatim for retained ids 1–8 |

**Validation rules**
- Exactly 8 suggestions, each `giftId` ∈ {1..8} and matching a `GiftItem`.
- No monetary text, "onde comprar", or links (existing tests C4/C5 still enforce this).

## Relationship

`GiftSuggestion.giftId` → `GiftItem.id` (one-to-one). The component renders one card per `GiftSuggestion`, looking up its `GiftItem` for title + image.

## State transitions

None — static presentational data.
