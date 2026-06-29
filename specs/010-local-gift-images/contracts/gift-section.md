# UI Contract: Gift Suggestions Section

The "external interface" of this feature is the rendered section and the component's exported data, exercised by `GiftSuggestions.test.tsx`. This contract lists the guarantees the implementation must meet.

## Rendered output contract

- The section renders the heading **"Sugestões de Presente"**.
- Exactly **8 gift cards** are rendered (one per `GiftSuggestion`).
- Each card shows:
  - an `<h3>` with the category `nome`,
  - an `<img>` with `alt` equal to the category `nome` and `loading="lazy"`,
  - a list with ≥ 1 idea matching that category's `ideias`.
- Every rendered image `src` points to `/galeria/brinquedos/…` (local). **No `src` contains `pexels.com` or any `http(s)://` external host.**
- No monetary text (`R$`, "preço", "sugestão de valor"), no "onde comprar", and no `<a>` links in the section.
- Intro text communicates inspiration/ideia and does not mention lojas / onde encontrar / comprar.

## Data contract (exported from `GiftSuggestions.tsx`)

- `giftItems.length === 8` and `giftSuggestions.length === 8`.
- For every `giftItems[i].imagem`: non-empty, starts with `/galeria/brinquedos/`, does not start with `http`.
- Each `giftSuggestions[i].giftId` matches a `giftItems` entry.

## Fallback contract (graceful degradation)

- If an item's `imagem` is empty, the card renders the Sparkles fallback and **no** `<img>` with that item's `alt` (preserves test C7 and the "broken image" edge case).

## Test changes required

- Update C2: assert length **8** (was 11) and that all 8 nomes render.
- Add assertion: every rendered gift image `src` starts with `/galeria/brinquedos/` and none match `pexels`/`http`.
- Keep C1, C3, C4, C5, C6, C7, C8 semantics intact.
