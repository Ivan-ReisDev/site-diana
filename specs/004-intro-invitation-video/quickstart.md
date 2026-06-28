# Quickstart: Tela de Abertura com Convocação Real e Vídeo

Guia rápido para implementar e validar a feature `004-intro-invitation-video`.

## Pré-requisitos

- Node + dependências já instaladas (`framer-motion`, `lucide-react` já presentes — sem novas deps).
- Arquivo de vídeo disponível em `public/`.

## Passos de implementação

1. **Disponibilizar o vídeo com nome web-safe**
   ```bash
   cp "public/WhatsApp Video 2026-06-28 at 16.16.17.mp4" public/convite-video.mp4
   ```

2. **Criar o hook de etapas** — `src/hooks/useIntroSequence.ts`
   - Máquina de estados `invite → video → final` + `videoStatus` + `soundOn`.
   - Handlers: `start`, `skip`, `onVideoEnded`, `onVideoError`, `toggleSound`.
   - Ver contrato em `contracts/intro-overlay.contract.md` e transições em `data-model.md`.

3. **Criar o componente** — `src/components/invitation/IntroOverlay.tsx` (`"use client"`)
   - Overlay `fixed inset-0 z-[100]`; `useEffect` para travar/liberar `document.body.style.overflow`.
   - Etapa `invite`: mensagem da Convocação Real + botão de princesa (use a skill **frontend-design** para o visual).
   - Etapa `video`: fundo `bg-black`, `<video>` centralizado, `preload="none"`, `onEnded`/`onError`, botão "Pular" e toggle de som; chamar `video.play()` dentro do `onClick` de `start`.
   - Etapa `final`: mensagem da Convocação Real + botão "Confirmar Presença" → `onComplete()`.
   - Animações com `framer-motion` (`AnimatePresence`, `motion`), respeitando `useReducedMotion()`.

4. **Integrar em** `src/app/InvitationSite.tsx`
   - Adicionar `const [introDone, setIntroDone] = useState(false);`.
   - Renderizar `<IntroOverlay onComplete={() => setIntroDone(true)} />` enquanto `!introDone` (envolto em `AnimatePresence`).
   - **Gating da música**: trocar `<BackgroundMusic />` por `{introDone && <BackgroundMusic />}` para silenciá-la durante a abertura (FR-014).

## Validação

```bash
npm test            # Vitest: useIntroSequence + IntroOverlay
npm run build       # build de produção (validação obrigatória — constituição §6)
npm run dev         # validação visual real
```

### Checklist de validação visual (desktop + mobile)

- [ ] Abertura cobre 100% da tela ao abrir; home inacessível por baixo (sem scroll).
- [ ] Botão de princesa visível e bonito; clique dispara a transição.
- [ ] Vídeo centralizado em fundo preto, inicia automaticamente; som ativável.
- [ ] Botão "Pular" funciona a qualquer momento do vídeo.
- [ ] Ao terminar o vídeo, surgem a mensagem final e "Confirmar Presença".
- [ ] "Confirmar Presença" revela a home.
- [ ] Música de fundo só toca depois de entrar na home (nunca durante a abertura).
- [ ] Vídeo que falha ao carregar ainda permite chegar à home.
- [ ] Legível em 320px–1920px, retrato e paisagem; alvos de toque ≥ 44px.
- [ ] Com "reduzir movimento" ativo, transições ficam suaves/simplificadas.

## Referências

- Plano: [plan.md](./plan.md)
- Pesquisa/decisões: [research.md](./research.md)
- Estado/transições: [data-model.md](./data-model.md)
- Contrato de UI: [contracts/intro-overlay.contract.md](./contracts/intro-overlay.contract.md)
- Padrão de referência (feature 003): `src/components/invitation/BackgroundMusic.tsx`, `src/hooks/useBackgroundMusic.ts`
