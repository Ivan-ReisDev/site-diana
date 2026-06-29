# Data Model: Novo Formato de Sugestões de Presente

**Feature**: 007-gift-suggestions-redesign | **Date**: 2026-06-29

Dados estáticos no código (sem persistência). Os tipos abaixo substituem os atuais em `InvitationSite.tsx` e passam a ser exportados por `src/components/invitation/GiftSuggestions.tsx`.

## Entidade: GiftItem

Representa o presente em si (identidade visual + nome).

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| `id` | `number` | Sim | Identificador único; liga-se a `GiftSuggestion.giftId`. |
| `nome` | `string` | Sim | Nome do presente exibido no card. |
| `imagem` | `string` | Sim | URL da imagem ilustrativa (pode estar vazia → fallback). |

**Removidos** (em relação ao modelo atual):
- `preco: string` — proibido por FR-002.
- `reservado: boolean` — campo morto (nunca lido); fora do escopo de reserva.
- `reservadoPor: string` — idem.

## Entidade: GiftSuggestion

Representa as ideias/inspiração associadas a um `GiftItem`.

| Campo | Tipo | Obrigatório | Notas |
|-------|------|-------------|-------|
| `giftId` | `number` | Sim | Referencia `GiftItem.id`. |
| `ideias` | `string[]` | Sim | 2-3 ideias/variações por presente (FR-001). |

**Removidos**:
- `lojas: { nome: string; busca: string }[]` — proibido por FR-003.

## Relacionamentos

- `GiftSuggestion.giftId` → `GiftItem.id` (1:1). A renderização faz o lookup do item pelo `giftId`.

## Regras de validação / invariantes

- **INV-1**: Nenhum campo do modelo contém valor monetário ou referência a loja/link de compra (FR-002, FR-003).
- **INV-2**: Existem exatamente 11 `GiftItem` (categorias) e 11 `GiftSuggestion` correspondentes (FR-008).
- **INV-3**: Cada `GiftSuggestion.ideias` tem ≥ 1 item (tipicamente 2-3).
- **INV-4**: Se `imagem` for vazia/ausente, o card usa fallback visual com ícone (FR-007), sem quebrar layout.

## Fora de escopo (inalterado)

- `giftAmounts = ["R$ 50", ...]` pertence à seção **Pix Descomplica** (`#pix`), onde valores monetários são intencionais e legítimos. Não é tocado por esta feature.
