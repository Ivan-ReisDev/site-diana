# Quickstart: Galeria de Fotos em Carrossel

Guia rápido para implementar e validar a feature `005-photo-gallery-carousel`.

## Pré-requisitos

- Dependências já instaladas (`framer-motion`, `lucide-react` já presentes — sem novas deps).
- Fotos da Diana disponíveis para colocar em `public/galeria/`.

## Passos de implementação

1. **Colocar as fotos (estático)** em `public/galeria/` com nomes web-safe:
   ```bash
   mkdir -p public/galeria
   # copiar as fotos, ex.: public/galeria/diana-1.jpg, diana-2.jpg, ...
   ```

2. **Criar o hook** — `src/hooks/usePhotoCarousel.ts`
   - Estado `activeIndex` + `isAutoPlaying`; handlers `select`/`next`/`prev`.
   - Autoplay com timer (padrão 5s); `select` reseta o timer; sem autoplay se `total === 1` ou `prefers-reduced-motion`.
   - Ver transições em `data-model.md` e assinatura em `contracts/photo-gallery.contract.md`.

3. **Criar o componente** — `src/components/invitation/PhotoGalleryCarousel.tsx` (`"use client"`)
   - Define/recebe `galleryPhotos: { src, alt }[]`.
   - Foto em destaque: container com proporção fixa (`aspect-[4/5]`/`aspect-square`) + `<img object-cover>`; transição via `framer-motion` `AnimatePresence` (crossfade), respeitando `useReducedMotion()`.
   - Miniaturas: botões com `<img object-cover>`, estado ativo (`aria-current`), `aria-label`; alvo ≥ 44px. Desktop ao lado; mobile em faixa `overflow-x-auto` com scroll-snap.
   - `onError` da foto em destaque → placeholder rosa; `loading="lazy"` (primeira pode ser `eager`).
   - Usar a skill **frontend-design** para o acabamento visual (estética de princesa, card sem borda no padrão atual).

4. **Integrar em** `src/app/InvitationSite.tsx`
   - Remover o `const timeline` (~linha 399) e a coluna direita `timeline.map` (~linhas 819–831).
   - No lugar da coluna direita, montar `<PhotoGalleryCarousel photos={galleryPhotos} />`.
   - Manter a coluna esquerda (eyebrow + título + texto + chips).

## Validação

```bash
npm test            # Vitest: usePhotoCarousel + PhotoGalleryCarousel
npm run build       # build de produção (validação obrigatória — constituição §6)
npm run dev         # validação visual real
```

### Checklist de validação visual (desktop + mobile)

- [ ] A antiga timeline (13h/14h/15h/Até 20/09) não aparece mais.
- [ ] Foto grande em destaque + miniaturas visíveis no lado direito (desktop).
- [ ] A foto em destaque avança sozinha em laço, com transição suave.
- [ ] Clicar numa miniatura troca a foto em destaque (< 1s) e marca a miniatura ativa.
- [ ] Após clicar, o autoplay não "pula" imediatamente (timer reiniciado).
- [ ] Mobile: foto em destaque acima + faixa de miniaturas rolável; todas acessíveis.
- [ ] Foto que falha ao carregar mostra placeholder e o carrossel segue.
- [ ] Com "reduzir movimento" ativo, não há autoplay e a transição é simples.
- [ ] Fotos sem distorção (retrato/paisagem acomodados).
- [ ] Legível e navegável de 320px a 1920px, retrato e paisagem.

## Referências

- Plano: [plan.md](./plan.md)
- Pesquisa/decisões: [research.md](./research.md)
- Estado/transições: [data-model.md](./data-model.md)
- Contrato de UI: [contracts/photo-gallery.contract.md](./contracts/photo-gallery.contract.md)
- Padrão de referência: `src/components/invitation/IntroOverlay.tsx` e `src/hooks/useIntroSequence.ts` (feature 004)
