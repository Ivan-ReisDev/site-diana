# Data Model: Música de fundo no convite

**Feature**: 003-background-music | **Date**: 2026-06-28

Esta feature é client-side e não envolve banco de dados. As "entidades" são estado do navegador.

## Entidade: Preferência de áudio (client-side)

Representa a escolha do convidado sobre tocar ou não a música de fundo.

| Campo | Tipo | Valores | Onde vive | Notas |
|-------|------|---------|-----------|-------|
| `bgMusic` | string | `"on"` \| `"off"` | `sessionStorage` (chave `bgMusic`) | Ausência da chave = padrão "on". Acesso protegido por try/catch. |

**Regras de validação / comportamento**:
- Ausência de valor → tratar como "on" (intenção padrão: música toca).
- Gravar `"off"` quando o usuário desliga manualmente; nesse estado, o disparo por gesto é ignorado.
- Gravar `"on"` quando o usuário religa manualmente.
- Persistência limitada à visita (sessão do navegador).

## Estado de runtime (em memória, não persistido)

| Estado | Tipo | Descrição |
|--------|------|-----------|
| `isPlaying` | boolean | Se o `<audio>` está tocando no momento (reflete no ícone do controle). |
| `hasStarted` | boolean | Se a música já foi disparada ao menos uma vez (evita múltiplos inícios / não reiniciar a cada gesto — FR-005). |

### Transições de estado

```text
[Carregou, silencioso]
   │  primeiro gesto do usuário  (e preferência ≠ "off")
   ▼
[Tocando]  ──── usuário aciona controle ───►  [Desligado pelo usuário] (grava "off")
   ▲                                                   │
   └──────── usuário aciona controle (grava "on") ─────┘

[Carregou, silencioso] ── primeiro gesto, mas preferência = "off" ──► permanece [Silencioso]
```

- De `[Tocando]`, gestos adicionais NÃO criam novas reproduções (`hasStarted` evita re-trigger).
- A escolha manual (`[Desligado pelo usuário]`) prevalece sobre disparos automáticos subsequentes (FR-008).
