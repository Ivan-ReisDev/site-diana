# UI Contract: LocationMap (Seção de Localização)

**Feature**: 006-location-map-routes | **Date**: 2026-06-29

Contrato de interface/comportamento do componente `LocationMap` e da seção `#local`. Define o que pode ser testado de forma determinística (sem depender da rede do Google Maps).

## Componente: `LocationMap`

### Props

```ts
type Venue = {
  name: string;        // "Casa de Festas Turma da Kali"
  address: string;     // "Est. Padre Roser, 765 - Vila da Penha, Rio de Janeiro"
  coords?: string;     // "lat,lng" opcional para precisão do pino
};

type LocationMapProps = {
  venue: Venue;
};
```

### Garantias de renderização (testáveis)

| ID | Garantia | Requisito |
|----|----------|-----------|
| C1 | Renderiza `venue.name` e `venue.address` como **texto legível** no DOM (não apenas dentro do iframe). | FR-002, SC-001 |
| C2 | Renderiza um `<iframe>` com `title` descritivo (ex.: `Mapa: <name>`) e `src` **exatamente** igual a `https://maps.google.com/maps?q=${encodeURIComponent(coords ?? address)}&output=embed`. | FR-001 |
| C3 | O `<iframe>` tem `loading="lazy"`. | SC-005, Perf |
| C4 | Renderiza um link/botão "Como chegar" (`<a>`) com `href` **exatamente** igual a `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(coords ?? address)}`. | FR-004, FR-005 |
| C5 | O `href` da rota **NÃO** contém o parâmetro `origin`. | FR-005 (origem = posição atual) |
| C6 | O link da rota tem `target="_blank"` e `rel` contendo `noopener` e `noreferrer`. | Segurança, FR-007 |
| C7 | `src` do mapa e `href` da rota derivam do **mesmo** valor (`coords ?? address`) — testar igualdade do alvo entre os dois. | FR-009 |
| C8 | O componente **não** chama `navigator.geolocation` (nenhuma solicitação de geolocalização do navegador). | FR-005, Privacidade |

### Acessibilidade (testável/validável)

| ID | Garantia | Requisito |
|----|----------|-----------|
| A1 | O `<iframe>` possui atributo `title` não vazio. | FR-008, Acessibilidade |
| A2 | O botão "Como chegar" é um elemento focável por teclado com rótulo textual claro. | FR-003, Acessibilidade |
| A3 | Alvo de toque do botão ≥ 44px de altura (validação visual/CSS). | FR-008 |

## Integração da seção `#local` (em `InvitationSite.tsx`)

| ID | Garantia | Requisito |
|----|----------|-----------|
| S1 | Existe uma `section` com `id="local"` posicionada **após** a seção `#evento`. | FR-001 |
| S2 | A seção monta `<LocationMap venue={venue} />` com `venue` derivado dos dados do local (mesmo endereço de `eventDetails`). | FR-009 |
| S3 | Layout responsivo: utilizável de 320px a 1920px (mapa não estoura a largura; botão acessível em mobile). | FR-008, SC-004 |

## Fora de escopo do contrato

- Conteúdo geográfico real renderizado pelo Google (depende de rede/terceiro) — validado apenas manualmente.
- Comportamento do app de mapas após o clique (origem automática, escolha de app) — validado manualmente em dispositivo real (US2/US3).
