# Quickstart: Música de fundo no convite

**Feature**: 003-background-music | **Date**: 2026-06-28

Guia rápido para implementar e validar a feature.

## Pré-requisitos

- Dependências instaladas (`npm install`). Sem novas dependências necessárias.
- Arquivo de áudio em `public/` (será renomeado para `musica-convite.mp3`).

## Passos de implementação (ordem sugerida)

1. **Áudio web-safe**: copiar `public/A Dream Is a Wish Your Heart Makes.mp3.mpeg` → `public/musica-convite.mp3`.
2. **Hook** `src/hooks/useBackgroundMusic.ts`: gesto único, play/pause, preferência em `sessionStorage`, volume 0.3. (TDD: escrever `useBackgroundMusic.test.ts` primeiro.)
3. **Componente** `src/components/invitation/BackgroundMusic.tsx`: `<audio loop preload="none">` + botão flutuante acessível (ícones `Volume2`/`VolumeX`). (TDD: `BackgroundMusic.test.tsx`.)
4. **Integração**: montar `<BackgroundMusic />` em `src/app/InvitationSite.tsx` (somente a página pública).
5. **Build + validação**: `npm run build` e validação visual/sonora real (desktop + mobile).

## Como validar (mapeado aos cenários)

| Cenário | Como testar | Esperado |
|---------|-------------|----------|
| C1 / SC-001 | Abrir `/`, não interagir, olhar o console | Sem som; sem erro de autoplay |
| C2 / SC-002 | Abrir `/`, rolar a página uma vez | Música começa em ≤1s, volume baixo |
| C4 / SC-004 | Com música tocando, clicar no controle | Som para imediatamente; ícone muda |
| C5 | Clicar no controle de novo | Música retoma |
| C6 / SC-005 | Desligar, depois rolar/clicar | Permanece desligada |
| C3 / US3 | Desligar, recarregar a página, rolar | Permanece desligada (preferência lembrada) |
| Mobile / SC-006 | Abrir no celular (iOS/Android), tocar na tela | Música dispara por toque; controle confortável |
| Escopo / FR-010 | Abrir `/dashboard` e `/login` | Nenhuma música toca |

## Comandos

```bash
npm test          # testes unitários (vitest)
npm run build     # validação de build
npm run dev       # validação manual local
```
