# UI Contract: IntroOverlay

Contrato de interface e comportamento do componente de abertura. Não há API de rede — este é o contrato de UI consumido por `InvitationSite`.

## Componente: `IntroOverlay`

### Props

| Prop | Tipo | Default | Descrição |
|------|------|---------|-----------|
| `onComplete` | `() => void` | — (obrigatório) | Chamado quando o convidado conclui a abertura (clique em "Confirmar Presença"). O host usa para revelar a home. |
| `videoSrc` | `string` | `"/convite-video.mp4"` | Caminho do vídeo do convite. |
| `inviteMessage` | `string` | mensagem padrão da Convocação Real | Texto exibido na etapa inicial e final. |

### Hook: `useIntroSequence`

```ts
interface UseIntroSequenceResult {
  stage: "invite" | "video" | "final";
  videoStatus: "idle" | "loading" | "playing" | "ended" | "error";
  soundOn: boolean;
  start: () => void;        // invite → video (chamado no clique; tenta tocar com som)
  skip: () => void;         // video → final
  onVideoEnded: () => void; // video → final
  onVideoError: () => void; // marca videoStatus="error"
  toggleSound: () => void;  // alterna soundOn
}
```

## Comportamentos garantidos (mapeados aos Requisitos Funcionais)

| ID | Comportamento | Requisito |
|----|---------------|-----------|
| C1 | Ao montar, cobre 100% da viewport com fundo opaco (`fixed inset-0 z-[100]`) e trava o scroll do `body`. | FR-001, FR-004 |
| C2 | Etapa `invite` exibe a mensagem da Convocação Real e um único botão de destaque (estilo princesa). | FR-002, FR-003 |
| C3 | Clique no botão dispara transição animada e muda para etapa `video`. | FR-005 |
| C4 | Etapa `video` mostra o vídeo centralizado sobre fundo totalmente preto, sem elementos do site ao redor. | FR-006 |
| C5 | O vídeo inicia a reprodução automaticamente (dentro do gesto) e oferece controle visível para ativar/silenciar som. | FR-007 |
| C6 | Botão "Pular" sempre visível durante o vídeo, levando à etapa `final`. | FR-008 |
| C7 | Ao terminar (`onEnded`) ou pular, exibe a mensagem final e o botão "Confirmar Presença". | FR-009 |
| C8 | Clique em "Confirmar Presença" chama `onComplete()`. | FR-010 |
| C9 | Se o vídeo falhar (`onError`/timeout), a etapa `final` permanece alcançável por um botão de avançar. | FR-011 |
| C10 | Layout legível e proporcional de 320px a 1920px, retrato e paisagem; alvos de toque ≥ 44px. | FR-012 |
| C11 | Com `prefers-reduced-motion`, as transições são simplificadas (sem grandes movimentos/scale). | FR-013 |

## Contrato de integração (host `InvitationSite`)

| ID | Comportamento | Requisito |
|----|---------------|-----------|
| H1 | `<IntroOverlay onComplete={() => setIntroDone(true)} />` é renderizado somente enquanto `introDone === false`. | FR-001 |
| H2 | `<BackgroundMusic />` só é montado quando `introDone === true` (música silenciada durante a abertura, inicia na home). | FR-014 |

## Casos de teste (Vitest + Testing Library)

1. Renderiza etapa `invite` com a mensagem e o botão de início.
2. Clicar no botão de início avança para a etapa de vídeo (renderiza o `<video>` e o botão "Pular").
3. `onEnded` do vídeo avança para a etapa final com a mensagem e o botão "Confirmar Presença".
4. Clicar em "Pular" avança direto para a etapa final.
5. Clicar em "Confirmar Presença" chama `onComplete`.
6. `onError` do vídeo mantém um caminho visível para a etapa final (fallback).
7. `toggleSound` alterna o estado de som (`soundOn` e `video.muted`).
8. (host) `<BackgroundMusic />` não está montado enquanto a abertura está ativa; passa a existir após `onComplete`.
