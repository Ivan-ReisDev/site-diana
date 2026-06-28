# Phase 0 Research: Tela de Abertura com Convocação Real e Vídeo

Todas as áreas técnicas estão resolvidas; nenhum item permanece como NEEDS CLARIFICATION. As decisões abaixo consolidam a investigação sobre o código existente e as melhores práticas para a abertura.

## Decisão 1 — Biblioteca de animação para a transição

- **Decision**: Usar `framer-motion` (já presente, v12) com `AnimatePresence` para montar/desmontar etapas e `motion` para fade/scale; respeitar `useReducedMotion()`.
- **Rationale**: A dependência já está no projeto e é usada em `InvitationSite.tsx`; evita nova dependência (alinha com a 003) e oferece controle declarativo de entrada/saída e suporte nativo a `prefers-reduced-motion`.
- **Alternatives considered**: CSS keyframes puros (já existem alguns em `globals.css`) — mais verboso para orquestrar transições entre etapas e saída condicional; bibliotecas novas (GSAP) — dependência desnecessária.

## Decisão 2 — Reprodução do vídeo com som (política de autoplay)

- **Decision**: Iniciar `video.play()` **dentro do handler de clique** do botão de princesa, com o vídeo já com som; manter um botão visível de "ativar som"/mute como fallback caso o navegador rejeite o áudio.
- **Rationale**: Navegadores permitem áudio quando `play()` ocorre em resposta direta a um gesto do usuário. Como o vídeo só inicia após o clique, o som tende a funcionar; o fallback cobre exceções (ex.: Safari iOS em baixo consumo de energia).
- **Alternatives considered**: Autoplay mudo + unmute depois — perde o impacto sonoro do convite; exigir segundo clique para tocar — fricção desnecessária.

## Decisão 3 — Coordenação com a música de fundo (feature 003)

- **Decision**: Fazer **gating do render** de `<BackgroundMusic />` em `InvitationSite`: só montá-lo quando a abertura terminar (`introDone === true`). Assim os listeners de "primeiro gesto" do `useBackgroundMusic` passam a valer somente na home.
- **Rationale**: O hook `useBackgroundMusic` inicia a música no primeiro gesto global. Sem gating, o clique no botão de princesa dispararia a música por baixo do vídeo, conflitando com o áudio (viola FR-014). Não montar o componente é a forma mais simples e robusta de garantir silêncio durante a abertura, sem alterar a lógica testada da 003.
- **Alternatives considered**: Pausar/`mute` o `<audio>` imperativamente durante o vídeo — exige acoplar referências entre componentes e é mais frágil; passar uma prop `enabled` ao hook — viável, mas o gating do render é mais simples e já garante o comportamento desejado.

## Decisão 4 — Bloqueio do conteúdo de fundo

- **Decision**: Overlay `fixed inset-0 z-[100]` com fundo opaco; travar o scroll aplicando `overflow: hidden` no `document.body` enquanto o overlay está montado (via `useEffect` com cleanup) e gerenciar foco (focus trap simples / `autoFocus` no botão principal).
- **Rationale**: Garante FR-001/FR-004 (cobertura total e conteúdo inacessível) e atende acessibilidade (foco não vaza para a home por baixo).
- **Alternatives considered**: Apenas z-index alto sem scroll-lock — o conteúdo de fundo ainda rolaria por trás em mobile; renderizar a home só depois — quebraria SSR/SEO da home.

## Decisão 5 — Frequência da abertura (sem persistência)

- **Decision**: Estado inicial sempre `introDone = false` em memória; nenhuma escrita em `localStorage`/`sessionStorage`.
- **Rationale**: Clarificação Q1 definiu "a cada visita". Sem persistência mantém o código simples e evita estado server/client divergente (sem risco de hydration mismatch, pois o valor inicial é fixo).
- **Alternatives considered**: Persistir "já visto" — explicitamente rejeitado pela clarificação.

## Decisão 6 — Entrega do arquivo de vídeo

- **Decision**: Disponibilizar o vídeo em `public/convite-video.mp4` (nome web-safe), copiado a partir de `public/WhatsApp Video 2026-06-28 at 16.16.17.mp4`; `preload="none"` (ou `metadata`) e carregar ao entrar na etapa de vídeo.
- **Rationale**: Espaços e a estrutura do nome atual atrapalham URLs; a 003 já adotou esse padrão (`musica-convite.mp3`). Carregar sob demanda preserva o load inicial (constituição §4 e Performance Goals).
- **Alternatives considered**: Referenciar o nome atual com `encodeURI` — funciona, mas frágil e inconsistente com o padrão do projeto.

## Decisão 7 — Etapa final e destino do "Confirmar Presença"

- **Decision**: Ao fim/skip do vídeo, exibir a mensagem da Convocação Real + botão "Confirmar Presença"; ao clicar, chamar `onComplete()` que seta `introDone = true` e **revela a home** (sem navegar a outra rota). O RSVP continua acessível pela navegação da home (feature 002).
- **Rationale**: Clarificação Q2 (opção B). Mantém a home como destino e não acopla a abertura ao fluxo de RSVP.
- **Alternatives considered**: Levar direto ao RSVP / rolar até a seção — rejeitado na clarificação.

## Resumo de prontidão

- Stack confirmada (Next.js 16 App Router, React 19, framer-motion 12, Tailwind v4, Vitest).
- Pontos de integração confirmados: `src/app/InvitationSite.tsx` (montagem do overlay e gating da música, ver linha do `<BackgroundMusic />`).
- Nenhuma nova dependência. Nenhum dado persistido. Nenhum NEEDS CLARIFICATION remanescente.
