# Research: Música de fundo no convite

**Feature**: 003-background-music | **Date**: 2026-06-28

Nenhum marcador NEEDS CLARIFICATION ficou pendente na spec. Esta pesquisa consolida as decisões técnicas que sustentam o plano.

## Decisão 1 — Disparo da reprodução por primeiro gesto (autoplay)

- **Decision**: Não chamar `play()` no carregamento. Registrar listeners globais para `pointerdown`, `click`, `touchstart`, `keydown` e `scroll` com `{ once: true, passive: true }`; no primeiro evento, chamar `audio.play()`. Remover/ignorar listeners após o primeiro disparo.
- **Rationale**: Chrome, Safari (incl. iOS) e Firefox bloqueiam áudio audível sem um "user activation". Tentar tocar antes gera Promise rejeitada e ruído no console. Tocar a partir de qualquer gesto cobre desktop e mobile (touch) e atende ao pedido "disparar pelo movimento, clique ou algo do tipo".
- **Alternatives considered**:
  - *Autoplay mudo + unmute no gesto*: tocar mudo é permitido, mas unmute ainda exige gesto; adiciona complexidade sem ganho real.
  - *Botão "tocar música" obrigatório*: contraria o pedido de disparo automático no primeiro gesto.
  - *Web Audio API (AudioContext)*: exige `resume()` após gesto de qualquer forma e é excessivo para tocar um único arquivo; `<audio>` nativo é suficiente.

## Decisão 2 — Elemento de áudio: HTML5 `<audio>` nativo

- **Decision**: Usar um elemento `<audio loop>` referenciado por `ref`, com `preload="none"` e `volume = 0.3`.
- **Rationale**: Zero dependências novas; suporta `loop`, `volume`, `play()/pause()` diretamente; `preload="none"` evita baixar 7,7 MB no carregamento, protegendo o princípio de performance.
- **Alternatives considered**: bibliotecas como Howler.js (overkill, +bundle); Web Audio API (complexidade desnecessária).

## Decisão 3 — Persistência da preferência

- **Decision**: Guardar `bgMusic` = `"on" | "off"` em `sessionStorage`. Padrão (ausência de valor) = comportamento "ligado". Ao desligar manualmente, gravar `"off"`; nesse estado, ignorar o disparo automático.
- **Rationale**: A spec pede lembrar a escolha durante a visita (incl. reload). `sessionStorage` cobre a visita atual sem persistir indefinidamente (menos intrusivo que `localStorage` para áudio). Leitura/escrita protegidas por try/catch para ambientes sem storage.
- **Alternatives considered**: `localStorage` (persiste entre visitas — pode surpreender o usuário ao voltar dias depois; fora do escopo declarado); estado só em memória (perde a escolha no reload, falha na US3).

## Decisão 4 — Volume agradável

- **Decision**: `volume = 0.3` como padrão de fundo.
- **Rationale**: Nível baixo o suficiente para ambientação sem competir com a navegação; ajustável por percepção na validação visual/sonora.
- **Alternatives considered**: fade-in suave de 0 → 0.3 (melhoria opcional; pode ser adicionada sem alterar o contrato).

## Decisão 5 — Controle de UI acessível

- **Decision**: Botão flutuante fixo (canto inferior, ex.: `bottom-right`) com ícones `Volume2` (tocando) / `VolumeX` (desligado) de `lucide-react`, `aria-label` dinâmico ("Desligar música" / "Ligar música"), `aria-pressed`, focável por teclado, alvo de toque ≥ 44px, estilizado com a paleta existente (rosa/dourado, classes utilitárias do projeto).
- **Rationale**: Atende ao princípio de acessibilidade e ao FR-006/FR-007/FR-009; flutuante não interfere no layout existente.
- **Alternatives considered**: controle dentro do nav (compete por espaço no mobile); player `<audio controls>` nativo (visual destoante do tema).

## Decisão 6 — Escopo: apenas a página pública

- **Decision**: Montar `<BackgroundMusic />` somente em `InvitationSite` (rota `/`). Não montar no layout raiz (que envolve painel/login) nem nas rotas `dashboard`/`login`.
- **Rationale**: FR-010 — áreas administrativas não devem tocar áudio. Montar na página, não no `RootLayout`, garante isolamento natural.
- **Alternatives considered**: montar no `RootLayout` com checagem de rota (mais frágil; vaza para painel/login).

## Decisão 7 — Arquivo de áudio web-safe

- **Decision**: Copiar/renomear `public/A Dream Is a Wish Your Heart Makes.mp3.mpeg` para `public/musica-convite.mp3` e referenciar `/musica-convite.mp3`.
- **Rationale**: Nome com espaços e dupla extensão (`.mp3.mpeg`) é frágil em URLs e cache; o conteúdo já é MPEG layer III (MP3) válido. Nome limpo evita problemas de encoding de URL.
- **Alternatives considered**: manter o nome e codificar a URL (`%20` etc.) — funciona, porém frágil e feio; otimizar/recomprimir o arquivo (fora do escopo; pode ser tarefa futura de performance).
