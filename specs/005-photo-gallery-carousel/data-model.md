# Phase 1 Data Model: Galeria de Fotos em Carrossel

Funcionalidade client-side e efêmera — **sem entidades persistidas** (sem banco, sem storage do navegador). O "modelo" descreve os dados estáticos das fotos e o estado de UI em memória.

## Dado estático: Foto da galeria (`GalleryPhoto`)

| Campo | Tipo | Descrição | Obrigatório |
|-------|------|-----------|-------------|
| `src` | `string` | Caminho da imagem em `public/galeria/` (ex.: `/galeria/diana-1.jpg`) | sim |
| `alt` | `string` | Texto alternativo/descritivo da foto (acessibilidade) | sim |

- **Conjunto da galeria** (`galleryPhotos: GalleryPhoto[]`): coleção **ordenada**; a ordem define a sequência do carrossel.
- Regras: o array pode ter de 1 a N fotos; com 1 foto, autoplay e miniaturas são desativados.

## Estado de UI: hook `usePhotoCarousel`

| Campo | Tipo | Descrição | Inicial |
|-------|------|-----------|---------|
| `activeIndex` | `number` | Índice da foto em destaque | `0` |
| `isAutoPlaying` | `boolean` | Se o avanço automático está ativo | `true` (ou `false` se 1 foto / reduced-motion) |

### Handlers

| Função | Efeito |
|--------|--------|
| `select(index)` | Define `activeIndex = index` e **reseta** o timer de autoplay |
| `next()` | Avança para `(activeIndex + 1) % total` (usado pelo autoplay e por navegação opcional) |
| `prev()` | Volta para `(activeIndex - 1 + total) % total` (navegação opcional) |

### Regras / invariantes

- `activeIndex` sempre em `[0, total-1]`; avanço é circular (laço).
- Autoplay só roda quando `total > 1` e `prefers-reduced-motion` está desativado.
- Ao chamar `select`/`next`/`prev` manualmente, o intervalo de autoplay reinicia (não avança logo em seguida) — atende FR-006.
- Intervalo de autoplay padrão: 5s (configurável via opção do hook; faixa aceitável 3–7s — SC-002).

### Transições (autoplay)

| De | Evento | Para |
|----|--------|------|
| `activeIndex = i` | timer dispara (autoplay) | `activeIndex = (i+1) % total` |
| `activeIndex = i` | `select(j)` | `activeIndex = j` + timer reiniciado |
| qualquer | `prefers-reduced-motion` ativo | autoplay desligado; troca apenas manual e sem animação intensa |

## Estado por-foto (em exibição)

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `loadStatus` | `"loading" \| "loaded" \| "error"` | Situação de carregamento da imagem em destaque; `error` → placeholder e o autoplay segue |

## Conteúdo estático (apresentação, não entidade)

- **Fotos**: arquivos em `public/galeria/` (nomes web-safe).
- **Textos alternativos**: descrições curtas por foto (ex.: "Diana sorrindo no jardim").
