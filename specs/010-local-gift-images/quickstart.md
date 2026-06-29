# Quickstart: Local Gift Suggestion Images

## What changes

- `public/galeria/brinquedos/briquedos sensoriais.jpeg` → renamed to `brinquedos-sensoriais.jpeg`.
- `src/components/invitation/GiftSuggestions.tsx` — `giftItems` trimmed to 8 entries (ids 1–8) with `imagem` pointing to local `/galeria/brinquedos/…` paths; `giftSuggestions` trimmed to ids 1–8 (idea text unchanged).
- `src/components/invitation/GiftSuggestions.test.tsx` — assert 8 categories and local image srcs.

## Image → category map

| `imagem` | id | nome |
|----------|----|------|
| `/galeria/brinquedos/brinquedos.jpeg` | 1 | Brinquedos interativos |
| `/galeria/brinquedos/ursinho.jpeg` | 2 | Bichinhos de pelúcia |
| `/galeria/brinquedos/livros.jpeg` | 3 | Livrinhos infantis |
| `/galeria/brinquedos/instrumentos-musicais.jpeg` | 4 | Brinquedos musicais |
| `/galeria/brinquedos/brinquedos-educativos.jpeg` | 5 | Brinquedos educativos |
| `/galeria/brinquedos/vestidinhos-roupas.jpeg` | 6 | Roupinhas e Vestidinhos |
| `/galeria/brinquedos/brinquedos-sensoriais.jpeg` | 7 | Brinquedos sensoriais |
| `/galeria/brinquedos/sapatinhos.jpeg` | 8 | Sapatinhos e Sandálias |

Drop ids 9, 10, 11 from both `giftItems` and `giftSuggestions`.

## Verify

```bash
# 1. Rename the asset (space + typo)
git mv "public/galeria/brinquedos/briquedos sensoriais.jpeg" \
       "public/galeria/brinquedos/brinquedos-sensoriais.jpeg"

# 2. Unit tests for the section
npx vitest run src/components/invitation/GiftSuggestions.test.tsx

# 3. Full build
npm run build
```

## Visual check (constitution #6)

- Run the dev server, scroll to "Sugestões de Presente".
- Confirm 8 cards, each with the correct host photo, on mobile and desktop.
- Confirm no broken images and no external (pexels) requests in the network tab.
