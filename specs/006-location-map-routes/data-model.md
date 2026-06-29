# Data Model: Mapa de Localização com Rotas

**Feature**: 006-location-map-routes | **Date**: 2026-06-29

Não há banco de dados, persistência nem estado de UI. O "modelo" desta feature é um único objeto de configuração estático, em memória, mais as URLs derivadas dele.

## Entidade: Venue (Local do Evento)

Objeto único e estático declarado em `src/app/InvitationSite.tsx` (fonte única — FR-009), reutilizando o endereço já presente em `eventDetails`.

| Campo | Tipo | Obrigatório | Descrição | Origem |
|-------|------|-------------|-----------|--------|
| `name` | `string` | Sim | Nome do local exibido ao convidado. Ex.: "Casa de Festas Turma da Kali". | Conteúdo (já em `eventDetails`) |
| `address` | `string` | Sim | Endereço por extenso, legível e usado para geocodificar o mapa e a rota. Ex.: "Est. Padre Roser, 765 - Vila da Penha, Rio de Janeiro". | Conteúdo (já em `eventDetails`) |
| `coords` | `string` | Não (opcional) | Coordenadas `"lat,lng"` para precisão do pino em endereços ambíguos. Quando ausente, usa-se `address`. | Opcional/futuro |

### Regras de validação / invariantes

- `name` e `address` MUST ser não vazios (caso contrário a seção não tem o que exibir).
- O mesmo `address` (ou `coords`, se presente) MUST alimentar **tanto** o `src` do mapa **quanto** o `href` da rota — nunca valores divergentes (FR-009).
- `address` MUST permanecer legível em texto na UI mesmo que o mapa não carregue (FR-002, SC-001).

### Valores derivados (computados a partir de Venue)

Seja `target = encodeURIComponent(venue.coords ?? venue.address)`:

| Derivado | Fórmula | Requisito |
|----------|---------|-----------|
| `mapEmbedSrc` | `https://maps.google.com/maps?q=${target}&output=embed` | FR-001 (mapa incorporado, sem API key) |
| `directionsHref` | `https://www.google.com/maps/dir/?api=1&destination=${target}` | FR-004/FR-005 (destino preenchido; sem `origin` → origem = posição atual) |

> Nota: `directionsHref` NÃO inclui o parâmetro `origin` — essa ausência é intencional e é o que faz o Google Maps usar a localização atual do convidado como ponto de partida (R2).

## Entidade conceitual: Convidado

Sem representação em dados. A "localização atual" do convidado é resolvida exclusivamente pelo app/serviço de mapas após o clique no botão; **o site não lê, não solicita, não trafega e não armazena** essa localização (Princípio 2 — Privacidade; FR-005).

## State Transitions

Nenhuma. A seção é estática: renderiza o mapa, o endereço e o botão; o clique no botão delega a navegação ao app de mapas (saída para fora do site). Não há estados de UI internos (loading/erro próprios) além do comportamento nativo de carregamento do `<iframe>`.
