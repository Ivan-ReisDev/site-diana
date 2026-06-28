# Contrato de UI/Comportamento: BackgroundMusic

**Feature**: 003-background-music | **Date**: 2026-06-28

Contrato do componente cliente que toca a música de fundo e expõe o controle ligar/desligar.

## Componente: `<BackgroundMusic />`

**Local**: `src/components/invitation/BackgroundMusic.tsx`
**Montagem**: dentro de `InvitationSite` (rota pública `/`). NÃO montar no `RootLayout`, painel ou login.

### Props

Nenhuma obrigatória. Opcionais (com defaults), para testabilidade:

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `src` | string | `"/musica-convite.mp3"` | Caminho do áudio em `public/`. |
| `volume` | number | `0.3` | Volume de fundo (0–1). |

### Estrutura renderizada (contrato observável)

- Um elemento `<audio>` com: `loop`, `preload="none"`, `src` = prop, e `volume` aplicado via ref. Não visível (sem `controls` nativos).
- Um `<button>` de controle flutuante, fixo na viewport (ex.: canto inferior direito), com:
  - `aria-label` = `"Ligar música"` quando desligado, `"Desligar música"` quando tocando.
  - `aria-pressed` refletindo o estado (`true` = tocando).
  - Ícone `Volume2` (tocando) ou `VolumeX` (desligado), de `lucide-react`.
  - Alvo de toque ≥ 44×44px; focável por teclado; acionável por Enter/Espaço e clique/toque.

### Comportamento (contrato funcional)

| ID | Dado | Quando | Então |
|----|------|--------|-------|
| C1 | Página carregada, sem interação | montagem | `<audio>` NÃO é reproduzido; nenhuma Promise de `play()` é disparada. |
| C2 | Preferência ≠ `"off"`, música nunca iniciada | primeiro gesto global (`pointerdown`/`click`/`touchstart`/`keydown`/`scroll`) | `play()` é chamado uma vez; `isPlaying = true`; ícone vira `Volume2`. |
| C3 | Preferência = `"off"` | primeiro gesto | NÃO toca; permanece silencioso; ícone `VolumeX`. |
| C4 | Música tocando | usuário aciona o controle | `pause()`; `isPlaying = false`; grava `sessionStorage.bgMusic = "off"`; ícone `VolumeX`. |
| C5 | Música desligada pelo controle | usuário aciona o controle | `play()`; `isPlaying = true`; grava `sessionStorage.bgMusic = "on"`; ícone `Volume2`. |
| C6 | Usuário desligou manualmente | novos gestos na página | NÃO religa automaticamente (escolha manual prevalece). |
| C7 | Música tocando | música chega ao fim | reinicia automaticamente (`loop`). |
| C8 | Música já iniciada | múltiplos gestos | não cria novas reproduções nem reinicia. |
| C9 | `sessionStorage` indisponível / `play()` rejeitado | qualquer | falha silenciosa; página não quebra; sem erro visível ao usuário. |

## Hook: `useBackgroundMusic(audioRef, { volume })`

**Local**: `src/hooks/useBackgroundMusic.ts`

Encapsula a lógica testável independentemente da renderização.

### Retorno

| Campo | Tipo | Descrição |
|-------|------|-----------|
| `isPlaying` | boolean | Estado atual de reprodução. |
| `toggle` | `() => void` | Liga/desliga e persiste a preferência (C4/C5). |

### Invariantes verificáveis (alvos de teste unitário)

- Não chama `play()` antes de um gesto (C1).
- Lê a preferência do `sessionStorage` e respeita `"off"` no primeiro gesto (C3, C6).
- `toggle()` alterna `isPlaying` e grava a preferência correspondente (C4/C5).
- Registra os listeners de gesto com `{ once: true }` e não dispara `play()` mais de uma vez por início (C8).
- Tudo encapsulado em try/catch para storage/`play()` (C9).
