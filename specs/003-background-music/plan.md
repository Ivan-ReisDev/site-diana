# Implementation Plan: Música de fundo no convite

**Branch**: `003-background-music` | **Date**: 2026-06-28 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/003-background-music/spec.md`

## Summary

Adicionar a trilha "A Dream Is a Wish Your Heart Makes" como música de fundo na página pública do convite. A reprodução não é tentada no carregamento (para nunca esbarrar nas políticas de autoplay); em vez disso, ela inicia no primeiro gesto do usuário (rolar, clicar, tocar ou tecla), em volume baixo (~30%) e em laço. Um controle flutuante visível permite ligar/desligar a qualquer momento; a escolha manual prevalece sobre o disparo automático e é lembrada durante a visita. A música fica restrita à página do convite (não toca em painel/login).

Abordagem técnica: um componente cliente `BackgroundMusic` montado dentro de `InvitationSite`, usando o elemento HTML5 `<audio>` nativo (sem novas dependências), um hook que escuta o primeiro gesto via listeners globais `{ once: true }`, e `sessionStorage` para a preferência. Ícones reaproveitados de `lucide-react` (`Volume2`/`VolumeX`).

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.7 (App Router, Turbopack), `lucide-react` (ícones já no projeto). Sem novas dependências — usa o elemento `<audio>` nativo.

**Storage**: `sessionStorage` no navegador para a preferência de áudio (ligado/desligado). Nenhum dado em banco.

**Testing**: Vitest + @testing-library/react (já configurados); validação visual/manual real no navegador (desktop + mobile).

**Target Platform**: Navegadores modernos desktop e mobile — Chrome/Edge/Firefox, Safari iOS, Chrome Android.

**Project Type**: Web application (Next.js App Router existente, estrutura `src/`).

**Performance Goals**: Não impactar o carregamento inicial da página — o áudio não é pré-carregado (`preload="none"`); início da reprodução em ≤1s após o gesto com o áudio já em cache; alternância do controle perceptivelmente instantânea.

**Constraints**: Respeitar as políticas de autoplay (nenhuma tentativa de tocar com som antes de um gesto); arquivo de áudio de ~7,7 MB deve ser carregado sob demanda; o controle deve ser acessível (foco por teclado, `aria-label`, estado anunciado) e ter alvo de toque ≥ 44px no mobile.

**Scale/Scope**: 1 componente novo + 1 hook; integração em 1 página (`InvitationSite`); 1 arquivo de áudio servido de `public/`.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Reforça o clima do convite em qualquer dispositivo; controle fácil de desligar evita imposição. | ✅ Pass |
| 2. Privacidade e segurança | Nenhum dado sensível; preferência só no `sessionStorage` do próprio navegador. | ✅ Pass |
| 3. Acessibilidade | Botão com `aria-label`, foco por teclado, estado (tocando/desligado) anunciado; áudio nunca forçado e sempre desligável de imediato. | ✅ Pass |
| 4. Performance e SEO | `preload="none"` + carregamento sob demanda mantém o carregamento inicial leve; sem impacto em metadados. | ✅ Pass |
| 5. Design emocional sem excesso | Controle flutuante discreto, alinhado à paleta rosa/dourada existente. | ✅ Pass |
| 6. TDD/validação | Testes unitários para a lógica de preferência/primeiro-gesto + build + validação visual real (desktop e mobile). | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/003-background-music/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/
│   └── background-music.contract.md   # Contrato de UI/comportamento do componente
├── checklists/
│   └── requirements.md  # Checklist de qualidade da spec
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
public/
└── musica-convite.mp3                 # Áudio renomeado a partir do arquivo atual (nome web-safe)

src/
├── app/
│   ├── InvitationSite.tsx             # Monta <BackgroundMusic /> na página pública
│   └── globals.css                    # (se necessário) estilo do controle flutuante
├── components/
│   └── invitation/
│       └── BackgroundMusic.tsx        # Componente cliente: <audio> + controle + estado
└── hooks/
    └── useBackgroundMusic.ts          # Hook: primeiro gesto, play/pause, preferência

src/components/invitation/BackgroundMusic.test.tsx   # Testes do componente
src/hooks/useBackgroundMusic.test.ts                 # Testes da lógica do hook
```

**Structure Decision**: Projeto único (Next.js App Router em `src/`). A funcionalidade é puramente client-side e se integra à página pública existente (`src/app/InvitationSite.tsx`). Cria-se um componente isolado em `src/components/invitation/` e um hook em `src/hooks/` para manter a lógica testável e separada da página. O áudio é servido estaticamente de `public/` com um nome web-safe.

## Complexity Tracking

> Sem violações de constituição. Nada a justificar.
