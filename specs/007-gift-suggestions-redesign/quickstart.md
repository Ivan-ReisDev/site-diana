# Quickstart: Novo Formato de Sugestões de Presente

**Feature**: 007-gift-suggestions-redesign

## Objetivo

Transformar a seção `#gifts` em pura inspiração: cards com imagem, nome e ideias — **sem preço** e **sem "Onde comprar"** — para os 12 presentes, alinhada ao estilo do convite.

## Passos de implementação (resumo)

1. **Criar** `src/components/invitation/GiftSuggestions.tsx`:
   - Mover `giftItems` e `giftSuggestions` de `InvitationSite.tsx`, com tipos simplificados (ver [data-model.md](./data-model.md)).
   - Remover dos dados: `preco`, `reservado`, `reservadoPor` (de `GiftItem`) e `lojas` (de `GiftSuggestion`).
   - Renderizar o grid de cards (imagem `loading="lazy"` + fallback com ícone, badge "Sugestão", nome, lista de ideias). Sem preço, sem bloco "Onde comprar".
   - Ajustar o texto introdutório (sem mencionar lojas).
2. **Escrever** `src/components/invitation/GiftSuggestions.test.tsx` cobrindo C1–C8 do [contrato](./contracts/gift-suggestions.contract.md).
3. **Editar** `src/app/InvitationSite.tsx`:
   - Remover a `<section id="gifts">` inline, os tipos `GiftItem`/`GiftSuggestion` e os arrays `giftItems`/`giftSuggestions`.
   - Importar e montar `<GiftSuggestions />` no lugar.
   - **Não** tocar em `giftAmounts` nem na seção `#pix`.
   - Remover imports agora não usados (ex.: `ShoppingBag`, `ExternalLink` se só usados ali).

## Como validar

```bash
npm test            # Vitest — testes do GiftSuggestions devem passar
npm run lint        # ESLint
npm run build       # build de produção sem erros
npm run dev         # validação visual real (desktop + mobile)
```

### Checklist de validação visual/manual

- [ ] Seção "Sugestões de Presente" mostra os 12 presentes com imagem + ideias.
- [ ] Nenhum preço/valor (`R$`) aparece na seção.
- [ ] Nenhum bloco "Onde comprar" e nenhum link de loja.
- [ ] Texto introdutório não promete lojas.
- [ ] Estilo (cores, fontes, cards, animação de entrada) igual às demais seções.
- [ ] Layout íntegro em 320px, tablet e desktop.
- [ ] Seção "Pix Descomplica" continua igual (com seus valores em Pix).
