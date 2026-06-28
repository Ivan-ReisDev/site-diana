# UI Contract: PhotoGalleryCarousel

Contrato de interface e comportamento do carrossel de fotos. Sem API de rede — é o contrato de UI consumido por `InvitationSite`.

## Componente: `PhotoGalleryCarousel`

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `photos` | `GalleryPhoto[]` | — (obrigatório) | Conjunto ordenado de fotos (`{ src, alt }`) |
| `interval` | `number` | `5000` | Intervalo do autoplay em ms (faixa 3000–7000) |

### Hook: `usePhotoCarousel`

```ts
interface UsePhotoCarouselResult {
  activeIndex: number;
  isAutoPlaying: boolean;
  select: (index: number) => void;   // seleção manual; reseta o timer
  next: () => void;                   // avança circular
  prev: () => void;                   // volta circular
}

function usePhotoCarousel(total: number, opts?: { interval?: number }): UsePhotoCarouselResult
```

## Comportamentos garantidos (mapeados aos Requisitos Funcionais)

| ID | Comportamento | Requisito |
|----|---------------|-----------|
| C1 | Renderiza uma **foto em destaque (grande)** e um conjunto de **miniaturas** das demais. | FR-002 |
| C2 | A foto em destaque **avança automaticamente** em laço, com transição suave. | FR-003 |
| C3 | Clicar/tocar numa miniatura traz a foto para o destaque imediatamente (< 1s). | FR-004, SC-003 |
| C4 | A miniatura da foto em destaque é **indicada visualmente** (estado ativo, `aria-current`). | FR-005 |
| C5 | Seleção manual **reseta** o autoplay (não é sobreposta logo em seguida). | FR-006 |
| C6 | Layout responsivo: desktop = destaque + miniaturas lado a lado; mobile = destaque acima + faixa rolável. | FR-007 |
| C7 | Todas as fotos ficam acessíveis mesmo quando as miniaturas não cabem (faixa rolável / navegação). | FR-008 |
| C8 | Com 1 foto: sem autoplay e sem miniaturas; em `onError`: placeholder e autoplay segue. | FR-009 |
| C9 | Com `prefers-reduced-motion`: autoplay desligado e transições simplificadas. | FR-010 |
| C10 | Fotos sem distorção (proporção fixa + `object-cover`). | FR-012 |
| C11 | Estética de princesa e card sem borda no padrão atual do site. | FR-011 |

## Contrato de integração (host `InvitationSite`)

| ID | Comportamento | Requisito |
|----|---------------|-----------|
| H1 | A coluna direita da seção "Nossa História" (atual `timeline.map`) é substituída por `<PhotoGalleryCarousel photos={galleryPhotos} />`. | FR-001, FR-002 |
| H2 | O `const timeline` e seu uso são removidos; a coluna esquerda (título/texto/chips) é mantida. | FR-001 |

## Casos de teste (Vitest + Testing Library)

### Hook `usePhotoCarousel`
1. `activeIndex` inicia em 0.
2. `select(2)` define `activeIndex = 2`.
3. `next()` avança circularmente (último → 0).
4. `prev()` volta circularmente (0 → último).
5. Autoplay avança o índice após o intervalo (timers falsos); `select` reseta o timer.
6. Com `total === 1`, não há autoplay.

### Componente `PhotoGalleryCarousel`
7. Renderiza a foto em destaque e N miniaturas para N fotos.
8. Clicar numa miniatura muda a foto em destaque e marca a miniatura como ativa (`aria-current`).
9. `onError` da imagem em destaque exibe o placeholder (não quebra) .
10. Com 1 foto, não renderiza miniaturas.
11. Miniaturas são botões acessíveis (role/`aria-label`), navegáveis por teclado.
