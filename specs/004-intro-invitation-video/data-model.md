# Phase 1 Data Model: Tela de Abertura com Convocação Real e Vídeo

A funcionalidade é client-side e efêmera — **não há entidades persistidas** (sem banco, sem `localStorage`/`sessionStorage`). O "modelo" aqui descreve o estado de UI em memória e suas transições.

## Estado: Máquina de etapas da abertura (`useIntroSequence`)

| Campo | Tipo | Descrição | Inicial |
|-------|------|-----------|---------|
| `stage` | `"invite" \| "video" \| "final"` | Etapa atual da abertura | `"invite"` |
| `videoStatus` | `"idle" \| "loading" \| "playing" \| "ended" \| "error"` | Situação da reprodução do vídeo | `"idle"` |
| `soundOn` | `boolean` | Se o áudio do vídeo está ativo (controle/fallback de mute) | `true` |

### Regras de validação / invariantes

- `stage` só avança para frente: `invite → video → final`. Não há retorno.
- `videoStatus` só é relevante quando `stage === "video"`.
- Em `videoStatus === "error"`, a etapa final ainda deve ser alcançável (botão de avançar visível) — garante FR-011.
- O botão "Confirmar Presença" só aparece em `stage === "final"`.

### Transições

| De | Evento | Para | Efeito |
|----|--------|------|--------|
| `stage=invite` | `start()` (clique no botão de princesa) | `stage=video`, `videoStatus=loading` | Inicia transição animada; tenta `video.play()` com som dentro do gesto |
| `stage=video` | vídeo carregou e tocou | `videoStatus=playing` | — |
| `stage=video` | `skip()` (botão pular) | `stage=final`, `videoStatus=ended` | Interrompe o vídeo |
| `stage=video` | vídeo terminou (`onEnded`) | `stage=final`, `videoStatus=ended` | — |
| `stage=video` | falha ao carregar/tocar (`onError`) | `videoStatus=error` | Exibe avançar; permite ir a `final` |
| `stage=video` | `toggleSound()` | (mesma etapa) | Alterna `soundOn` / `video.muted` |
| `stage=final` | `complete()` (clique em "Confirmar Presença") | — | Chama `onComplete()` → host seta `introDone=true` |

## Estado do host (`InvitationSite`)

| Campo | Tipo | Descrição | Inicial |
|-------|------|-----------|---------|
| `introDone` | `boolean` | Se a abertura foi concluída e a home está liberada | `false` |

### Regras

- Enquanto `introDone === false`: `<IntroOverlay />` é renderizado; `<BackgroundMusic />` **não** é montado; scroll do `body` travado.
- Quando `introDone === true`: overlay desmontado (com animação de saída via `AnimatePresence`); `<BackgroundMusic />` montado; scroll liberado.

## Conteúdo estático (não é entidade, é configuração de apresentação)

- **Mensagem da Convocação Real** (texto fixo): "Mamãe e Papai têm a honra de convidar você para celebrar o 1º aniversário da nossa Princesa."
- **Fonte do vídeo**: `/convite-video.mp4` (prop `src` com default).
- **Rótulos de botão**: início ("Convocação Real" / chamada de princesa), "Pular", "Confirmar Presença", e toggle de som.
