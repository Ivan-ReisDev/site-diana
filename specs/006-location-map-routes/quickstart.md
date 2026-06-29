# Quickstart: Mapa de Localização com Rotas

**Feature**: 006-location-map-routes | **Date**: 2026-06-29

Guia rápido para implementar e validar a seção de localização com rotas.

## Pré-leitura obrigatória (AGENTS.md)

Antes de codar, conferir as convenções desta versão do Next.js em
`node_modules/next/dist/docs/01-app/` (Client/Server Components, uso de assets).
Esta versão (Next 16.2.7 / React 19.2.4, App Router + Turbopack) pode divergir do
conhecimento de treino. O design só usa `<iframe>`/`<a>` nativos + Tailwind, sem APIs instáveis.

## O que será criado/alterado

1. **`src/components/invitation/LocationMap.tsx`** — componente de apresentação:
   - Recebe `venue: { name, address, coords? }`.
   - Calcula `target = encodeURIComponent(venue.coords ?? venue.address)`.
   - Renderiza:
     - `<iframe title="Mapa: {name}" src="https://maps.google.com/maps?q={target}&output=embed" loading="lazy" />` emoldurado (cantos arredondados, paleta atual).
     - `name` e `address` em texto legível.
     - `<a href="https://www.google.com/maps/dir/?api=1&destination={target}" target="_blank" rel="noopener noreferrer">` com rótulo "Como chegar" e ícone (`lucide-react`, ex. `MapPin`/`Navigation`), alvo ≥ 44px.
   - **Não** chamar `navigator.geolocation`. **Não** incluir `origin` na URL da rota.

2. **`src/app/InvitationSite.tsx`**:
   - Adicionar objeto `venue` (reutilizando "Casa de Festas Turma da Kali" / "Est. Padre Roser, 765 - Vila da Penha").
   - Inserir uma `<motion.section id="local">` após a seção `#evento`, com o divisor da coroa, montando `<LocationMap venue={venue} />`.
   - Seguir o padrão de animação `whileInView` das seções vizinhas.

3. **`src/components/invitation/LocationMap.test.tsx`** — testes conforme o contrato.

## TDD — ordem sugerida

Escrever os testes primeiro (ver `contracts/location-map.contract.md`):

1. **C1**: renderiza `name` e `address` como texto.
2. **C2/C3**: `<iframe>` com `title` e `src` de embed corretos + `loading="lazy"`.
3. **C4/C5**: link de rota com `href` de `dir/?api=1&destination=...` **sem** `origin`.
4. **C6**: `target="_blank"` + `rel` com `noopener noreferrer`.
5. **C7**: `src` do mapa e `href` da rota usam o mesmo alvo.
6. **C8**: nenhuma chamada a `navigator.geolocation`.

Depois implementar `LocationMap` até os testes passarem.

## Comandos

```bash
# Testes da feature
npx vitest run src/components/invitation/LocationMap.test.tsx

# Suíte completa + build
npx vitest run
npm run build

# Dev (validação visual)
npm run dev
```

## Validação manual (obrigatória — Princípio 6)

- [ ] Desktop: a seção `#local` mostra o mapa com o pino no local e o endereço por extenso.
- [ ] Mobile (dispositivo real): tocar em "Como chegar" abre o Google Maps (app ou web) com o **destino preenchido**.
- [ ] Mobile com localização ativa: a rota parte da **posição atual** sem digitar origem (US2).
- [ ] Negar localização ao app de mapas: a navegação ainda abre com o destino, permitindo origem manual (FR-006).
- [ ] Responsivo de 320px a 1920px: mapa não estoura a largura; botão confortável de tocar.
- [ ] Sem o mapa (ex.: offline/iframe falha): o endereço continua legível (SC-001).

## Critérios de aceite mapeados

| Critério | Como verificar |
|----------|----------------|
| SC-001 | Endereço textual sempre visível (teste C1 + validação offline) |
| SC-002 | Rota em ≤ 2 toques (1 toque no botão) |
| SC-003 | Origem = posição atual (validação em dispositivo) |
| SC-004 | Funciona em Android/iOS/desktop (validação cross-device) |
| SC-005 | Mapa interativo em ~3s (`loading="lazy"`, validação visual) |
