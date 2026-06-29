# Research: Mapa de Localização com Rotas

**Feature**: 006-location-map-routes | **Date**: 2026-06-29

Consolidação das decisões técnicas. Todas as incógnitas do Technical Context estão resolvidas — não há `NEEDS CLARIFICATION` pendente.

## R1. Provedor e forma de exibir o mapa visual (FR-001)

- **Decision**: Google Maps incorporado via `<iframe>` apontando para `https://maps.google.com/maps?q=<endereço-url-encoded>&output=embed`, sem chave de API.
- **Rationale**: Confirmado na clarificação (Q1=A). O endpoint `?output=embed` aceita uma busca por texto (`q=`) e geocodifica o endereço do lado do Google, exibindo o pino no ponto correto — sem chave de API, sem custo, sem biblioteca de mapa no bundle. Combina com o ecossistema do botão "Como chegar" (também Google Maps). Carregar via `loading="lazy"` evita pesar o carregamento inicial da página.
- **Alternatives considered**:
  - *OpenStreetMap + Leaflet*: open-source, mas adiciona dependência JS e CSS de mapa ao bundle de um convite estático — peso desnecessário.
  - *Google Maps JavaScript API / Embed API com key*: mais estilização, mas exige chave de API, billing e gestão de segredo — viola a simplicidade desejada e o princípio de não expor segredos.
  - *Imagem estática + link*: mais leve, mas perde o mapa interativo (zoom/arrastar) que ajuda o convidado a se situar.

## R2. Como obter a origem ("localização atual") da rota (FR-005/FR-006)

- **Decision**: Delegar ao serviço de mapas. O botão "Como chegar" é um link para `https://www.google.com/maps/dir/?api=1&destination=<endereço-url-encoded>` (apenas destino, **sem** parâmetro `origin`). O site NÃO usa a Geolocation API do navegador.
- **Rationale**: Confirmado na clarificação (Q2=A). No formato universal de direções do Google Maps (`dir/?api=1`), omitir `origin` faz o app/web do Google Maps assumir a **localização atual do usuário** como ponto de partida automaticamente. Isso satisfaz "pegar a rota direto da localização em que a pessoa está" sem o site pedir permissão de geolocalização, sem armazenar PII de localização (Princípio 2 — Privacidade) e funcionando igual em Android, iOS e desktop. Se o app não tiver acesso à posição, ele mesmo pede a origem ao usuário (FR-006), sem quebrar o fluxo.
- **Alternatives considered**:
  - *Capturar `navigator.geolocation` e passar `origin=lat,lng`*: adiciona prompt de permissão no site, tratamento de erro/timeout e implicação de privacidade — sem ganho real, já que o Maps faz isso sozinho.
  - *Híbrido (geolocaliza, senão delega)*: complexidade extra de fluxo de permissão para um caso que o Maps já cobre nativamente.

## R3. Abertura cross-platform e fallback de app (FR-007, US3)

- **Decision**: Usar a URL universal `https://www.google.com/maps/dir/?api=1&destination=...` em um `<a target="_blank" rel="noopener noreferrer">`. Em celular com o app Google Maps instalado, o SO abre o app; sem app, abre a versão web do Google Maps no navegador.
- **Rationale**: O formato `?api=1` é o esquema oficial e estável de URLs do Google Maps, projetado justamente para funcionar igual em Android, iOS e web, com fallback automático para o navegador. `rel="noopener noreferrer"` é boa prática de segurança para links que abrem nova aba.
- **Alternatives considered**:
  - *Esquemas nativos (`comgooglemaps://`, `geo:`, `maps://` da Apple)*: exigem detecção de plataforma e tratamento de "app não instalado"; a URL universal já resolve com um único link.

## R4. Coordenadas vs. endereço como conteúdo (FR-009, gap de conteúdo da spec)

- **Decision**: Usar o **endereço por extenso** já presente no site como fonte única tanto para o embed (`q=`) quanto para a rota (`destination=`). O local já está no código: **"Casa de Festas Turma da Kali"** — **"Est. Padre Roser, 765 - Vila da Penha"** (ver `eventDetails` em `src/app/InvitationSite.tsx`). Centralizar esses dados num único objeto `venue`.
- **Rationale**: O endereço geocodifica bem no Google Maps; não é necessário obter coordenadas para entregar o valor. Centralizar em um único objeto satisfaz FR-009 (mudar o local reflete em mapa e rota de uma vez). Opcionalmente, um campo de coordenadas (`lat,lng`) pode ser adicionado depois para precisão do pino em endereços ambíguos, sem mudar a arquitetura.
- **Alternatives considered**:
  - *Hardcode separado em cada lugar (iframe e link)*: viola FR-009 e arrisca divergência entre mapa e rota.

## R5. Estrutura de componente e integração na página (FR-008)

- **Decision**: Componente de apresentação `LocationMap` (sem estado, sem hook) em `src/components/invitation/`, montado numa nova `motion.section` `id="local"` logo após a seção `#evento` em `src/app/InvitationSite.tsx`, com o divisor da coroa entre as seções (padrão já usado). Sem dependências novas; o `<iframe>` e o `<a>` são nativos.
- **Rationale**: A feature é estática/declarativa — não há estado de UI (diferente do carrossel 005, que precisou de hook). Um componente presentational mantém o padrão das features 003/004/005 (componente isolado em `components/invitation/`) sem complexidade desnecessária. A página `InvitationSite` já é client component e usa `motion.section`, então a nova seção entra no mesmo padrão de animação `whileInView`. Responsividade via classes Tailwind (mobile-first), espelhando as seções existentes.
- **Alternatives considered**:
  - *Hook dedicado*: desnecessário — não há timers nem estado.
  - *Inserir o iframe inline na seção `#evento`*: mistura responsabilidades e dificulta teste isolado; uma seção própria é mais clara e testável.

## R6. Convenções desta versão do Next.js (AGENTS.md)

- **Decision**: Antes de codar, consultar `node_modules/next/dist/docs/01-app/` para confirmar convenções de Client/Server Components e uso de `<iframe>`/assets nesta versão (Next 16.2.7, React 19.2.4, App Router + Turbopack). O `<iframe>` do Google Maps é HTML nativo e não passa pelo otimizador de imagem, então não há restrição de `next.config` de `images`. `next.config.ts` usa `output: "standalone"` — sem impacto para iframe externo.
- **Rationale**: AGENTS.md adverte que esta versão pode divergir do conhecimento de treino; a verificação acontece na implementação. Nada no design depende de API instável — apenas `<iframe>`/`<a>` nativos e classes Tailwind.
- **Alternatives considered**: N/A.
