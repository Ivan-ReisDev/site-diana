# Implementation Plan: Mapa de Localização com Rotas

**Branch**: `006-location-map-routes` | **Date**: 2026-06-29 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/006-location-map-routes/spec.md`

## Summary

Adicionar uma **seção de localização** ao convite com um **mapa do Google Maps incorporado** (embed via `<iframe>`, sem chave de API) centralizado no local da festa e com o pino no ponto, mais o **endereço por extenso** sempre visível, e um botão **"Como chegar"** que abre a navegação do Google Maps com o **destino preenchido** e a **localização atual do convidado como origem automática** (sem o site pedir permissão de geolocalização).

Abordagem técnica: um componente de apresentação `LocationMap` (sem estado, sem hook) em `src/components/invitation/`, montado numa nova `motion.section` `id="local"` logo após a seção `#evento` em `src/app/InvitationSite.tsx`. O mapa é um `<iframe loading="lazy">` apontando para `https://maps.google.com/maps?q=<endereço>&output=embed`. O botão é um `<a target="_blank" rel="noopener noreferrer">` para `https://www.google.com/maps/dir/?api=1&destination=<endereço>` (sem `origin`, fazendo o Maps usar a posição atual). Os dados do local (nome + endereço) são centralizados num único objeto `venue`, reutilizando o endereço já presente em `eventDetails`. Sem novas dependências.

## Technical Context

**Language/Version**: TypeScript 5, React 19.2.4

**Primary Dependencies**: Next.js 16.2.7 (App Router, Turbopack), `framer-motion` 12 (animação `whileInView` da seção, já no projeto), `lucide-react` (ícone do botão, já no projeto). **Sem novas dependências** — `<iframe>` e `<a>` nativos.

**Storage**: Nenhum. Dados do local são constantes estáticas no código. Nenhum estado de UI, nenhuma persistência, nenhuma geolocalização capturada/armazenada.

**Testing**: Vitest + @testing-library/react (já configurados); validação visual/manual real no navegador (desktop + mobile).

**Target Platform**: Navegadores modernos desktop e mobile — Chrome/Edge/Firefox, Safari iOS, Chrome Android. Botão de rota abre app Google Maps (se instalado) ou versão web.

**Project Type**: Web application (Next.js App Router existente, estrutura `src/`).

**Performance Goals**: Não atrasar o carregamento da página — `<iframe>` com `loading="lazy"`, mapa visível/interativo em até ~3s ao entrar na tela (SC-005). Endereço em texto renderiza imediatamente, independente do iframe (SC-001).

**Constraints**: Sem chave de API (embed `?output=embed`); rota em ≤ 2 toques (SC-002); origem = localização atual via delegação ao Maps, sem prompt de geolocalização no site (FR-005, Princípio 2 — Privacidade); responsivo de 320px a 1920px com alvos de toque ≥ 44px (FR-008); endereço sempre legível mesmo sem o mapa carregar (FR-002); dado do local em ponto único (FR-009); link com `rel="noopener noreferrer"`.

**Scale/Scope**: 1 componente novo (`LocationMap`) + 1 objeto de dados `venue`; 1 nova seção `#local` em `InvitationSite.tsx` (após `#evento`, com divisor da coroa). Sem hooks, sem rotas de API, sem migrações.

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Princípio | Avaliação | Status |
|-----------|-----------|--------|
| 1. Valor para convidados primeiro | Ajuda o convidado a saber onde é e a traçar rota da posição atual em poucos toques, em qualquer dispositivo. | ✅ Pass |
| 2. Privacidade e segurança | O site **não** coleta nem armazena geolocalização — a origem é resolvida pelo app de mapas. Link externo com `rel="noopener noreferrer"`. Endereço do evento é público por escolha da família; nenhum dado de RSVP envolvido. | ✅ Pass |
| 3. Acessibilidade | `<iframe>` com `title` descritivo; endereço em texto real (não só imagem); botão "Como chegar" como link com rótulo claro e alvo ≥ 44px; navegável por teclado; contraste na paleta atual. | ✅ Pass |
| 4. Performance e SEO | `<iframe loading="lazy">` não pesa o carregamento inicial; endereço textual ajuda SEO/legibilidade; sem JS extra de mapa no bundle. | ✅ Pass |
| 5. Design emocional sem excesso | Seção alinhada à estética rosa/dourada e ao padrão de cards/seções existentes; mapa emoldurado com cantos arredondados, sem poluição. | ✅ Pass |
| 6. TDD/validação | Testes do componente (render do endereço, `title` do iframe com `src` de embed correto, `href` de direções com destino e sem origin, atributos de segurança) + build + validação visual real (desktop e mobile, abrir a rota num celular). | ✅ Pass |

**Resultado**: Sem violações. Nenhuma entrada em Complexity Tracking necessária.

## Project Structure

### Documentation (this feature)

```text
specs/006-location-map-routes/
├── plan.md              # Este arquivo (/speckit-plan)
├── research.md          # Fase 0 (/speckit-plan)
├── data-model.md        # Fase 1 (/speckit-plan)
├── quickstart.md        # Fase 1 (/speckit-plan)
├── contracts/
│   └── location-map.contract.md   # Contrato de UI/comportamento da seção de localização
├── checklists/
│   └── requirements.md  # Checklist de qualidade da spec
└── tasks.md             # Fase 2 (/speckit-tasks — NÃO criado aqui)
```

### Source Code (repository root)

```text
src/
├── app/
│   └── InvitationSite.tsx           # Adiciona o objeto `venue` e monta a nova
│                                    # <motion.section id="local"> com <LocationMap />
│                                    # após a seção #evento (com divisor da coroa)
└── components/
    └── invitation/
        ├── LocationMap.tsx              # Componente: iframe do mapa + endereço + botão "Como chegar"
        └── LocationMap.test.tsx         # Testes do componente
```

**Structure Decision**: Projeto único (Next.js App Router em `src/`). Funcionalidade declarativa/estática, integrada à página pública existente (`src/app/InvitationSite.tsx`), espelhando o padrão das features 003/004/005: componente isolado em `src/components/invitation/`. **Não há hook** (diferente do 005), pois não existe estado de UI, timer ou geolocalização — é apresentação pura de um `<iframe>` e um `<a>`. O ponto de integração é uma nova seção `#local` logo após a seção `#evento` (que já contém o endereço em `eventDetails`), reutilizando o mesmo endereço a partir de um objeto `venue` único (FR-009). O divisor decorativo da coroa separa a seção, seguindo o layout vigente.

## Complexity Tracking

> Sem violações de constituição. Nada a justificar.
