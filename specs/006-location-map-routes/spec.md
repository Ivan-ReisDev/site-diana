# Feature Specification: Mapa de Localização com Rotas

**Feature Branch**: `006-location-map-routes`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Precisamos criar o seguinte, o usuário quer colocar o maps com a localização de forma que o site faça o seguinte tenha a opção de rotas onde a pessoa pode pegar a rota e incluir diretamente da localização que a pessoa está"

## Clarifications

### Session 2026-06-29

- Q: Qual provedor fornece o mapa visual exibido na seção de localização? → A: Google Maps incorporado via iframe (embed), sem chave de API.
- Q: Como a origem ("localização atual") da rota é obtida? → A: Delegada ao app de mapas — o link de direções leva apenas o destino e o app usa a localização atual automaticamente; o site não solicita permissão de geolocalização.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Visualizar o local do evento no mapa (Priority: P1)

Um convidado, ao acessar o convite, encontra uma seção de localização com um mapa que mostra exatamente onde o evento acontecerá, junto com o endereço por extenso, para que ele saiba para onde precisa ir.

**Why this priority**: Sem ver onde é o evento, o convidado não consegue planejar a ida. É o valor mínimo da funcionalidade e funciona de forma autônoma, mesmo sem rotas.

**Independent Test**: Pode ser totalmente testado abrindo o convite, rolando até a seção de localização e confirmando que o mapa exibe o ponto correto do evento com o endereço legível. Entrega valor ao informar o local.

**Acceptance Scenarios**:

1. **Given** um convidado abrindo o convite em um celular, **When** ele chega à seção de localização, **Then** o mapa carrega centralizado no endereço do evento com um marcador visível no ponto exato.
2. **Given** o mapa exibido, **When** o convidado observa a seção, **Then** o endereço completo do evento aparece em texto legível próximo ao mapa.

---

### User Story 2 - Traçar rota a partir da localização atual (Priority: P1)

Um convidado quer ir ao evento e precisa do caminho a partir de onde ele está naquele momento. Ele toca em um botão de "Como chegar / Traçar rota" e o sistema inicia a navegação usando a posição atual dele como ponto de partida e o local do evento como destino.

**Why this priority**: É o pedido central do usuário — permitir que a pessoa pegue a rota direto da localização em que está. Sem isso, o mapa é apenas informativo.

**Independent Test**: Pode ser testado tocando no botão de rota e confirmando que a navegação abre com o destino já preenchido como o local do evento e a origem como a posição atual do convidado. Entrega valor ao guiar o convidado até o evento.

**Acceptance Scenarios**:

1. **Given** um convidado na seção de localização, **When** ele toca em "Como chegar", **Then** a navegação é iniciada com o destino definido como o endereço do evento e a origem definida como a localização atual do dispositivo.
2. **Given** o convidado autorizou o uso da localização, **When** a rota é traçada, **Then** o trajeto sugerido parte da posição atual dele até o local do evento.
3. **Given** o convidado não autorizou ou não disponibilizou a localização atual, **When** ele toca em "Como chegar", **Then** a navegação ainda abre com o destino definido, permitindo que ele informe a origem manualmente.

---

### User Story 3 - Escolher o aplicativo de navegação (Priority: P3)

Um convidado que prefere um aplicativo de mapas específico (ou que está em um dispositivo onde o app padrão não é o desejado) consegue iniciar a rota no serviço de navegação disponível no seu dispositivo, sem ficar preso a uma única opção.

**Why this priority**: Melhora a experiência e a taxa de sucesso em dispositivos diversos, mas não é essencial para entregar o valor central de ver o local e traçar a rota.

**Independent Test**: Pode ser testado em dispositivos diferentes (com apps de mapa distintos) confirmando que a ação de rota é compatível e abre uma opção de navegação válida em cada um. Entrega valor ao reduzir falhas por incompatibilidade de app.

**Acceptance Scenarios**:

1. **Given** um convidado em um dispositivo com aplicativo de mapas instalado, **When** ele toca em "Como chegar", **Then** a rota abre em um aplicativo de navegação compatível com o dispositivo dele.

---

### Edge Cases

- O que acontece quando o convidado **nega a permissão de localização ao app de mapas**? A navegação deve abrir com o destino preenchido e permitir que a origem seja informada manualmente dentro do serviço de mapas, sem travar a experiência. (O site em si não pede essa permissão.)
- Como o sistema se comporta **sem conexão de internet**? O mapa pode não carregar; nesse caso o endereço por extenso deve permanecer visível para que o convidado ainda saiba o destino.
- O que acontece em um **desktop sem GPS**? A rota deve abrir com o destino definido, deixando o convidado preencher o ponto de partida.
- O que acontece se o **app de mapas não estiver instalado** em um celular? A ação deve recorrer à versão web do serviço de mapas como alternativa.
- Como o convidado distingue o **ponto exato** quando o endereço é amplo (ex.: salão dentro de um complexo)? O marcador deve apontar para a coordenada precisa do local, não apenas para o centro do bairro/rua.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir, na página do convite, uma seção de localização contendo um mapa do Google Maps incorporado (embed via iframe, sem chave de API) centralizado no local do evento com um marcador no ponto exato.
- **FR-002**: O sistema MUST apresentar o endereço completo do evento em texto legível, visível independentemente de o mapa carregar.
- **FR-003**: O sistema MUST oferecer uma ação clara de "Como chegar / Traçar rota" na seção de localização.
- **FR-004**: Ao acionar a rota, o sistema MUST iniciar a navegação com o local do evento definido como destino.
- **FR-005**: Ao acionar a rota, o sistema MUST abrir um link de direções do Google Maps contendo apenas o destino (sem origem explícita), de modo que o app/serviço de mapas use a localização atual do convidado como ponto de partida automaticamente. O site NÃO solicita a permissão de geolocalização do navegador.
- **FR-006**: O sistema MUST garantir que, quando o app de mapas não tiver acesso à localização atual, a navegação ainda abra com o destino definido para que o convidado informe a origem manualmente dentro do próprio serviço de mapas.
- **FR-007**: O sistema MUST abrir a rota em um serviço/aplicativo de navegação compatível com o dispositivo do convidado, com alternativa via versão web quando nenhum aplicativo estiver disponível.
- **FR-008**: A seção de localização MUST ser responsiva e utilizável em celulares, tablets e desktops, com alvos de toque adequados em telas pequenas.
- **FR-009**: O sistema MUST manter o endereço e as coordenadas do evento configuráveis em um único ponto, para que uma mudança de local seja refletida tanto no mapa quanto na rota.

### Key Entities *(include if feature involves data)*

- **Local do Evento**: representa o destino do convite. Atributos principais: nome do local (ex.: nome do salão), endereço completo por extenso, e coordenadas geográficas precisas (ponto do marcador e do destino da rota).
- **Convidado**: pessoa que visualiza o convite e solicita a rota. Atributo relevante para esta feature: localização atual do dispositivo (quando autorizada), usada como ponto de partida da rota.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos acessos à seção de localização exibem o endereço por extenso do evento, mesmo quando o mapa não carrega.
- **SC-002**: A partir da seção de localização, um convidado consegue iniciar a rota até o evento em no máximo 2 toques/cliques.
- **SC-003**: Quando a localização atual é autorizada, em 95% dos casos a rota inicia com a origem definida como a posição atual do convidado, sem digitação manual.
- **SC-004**: A seção de localização e a ação de rota funcionam corretamente nos principais navegadores e sistemas móveis usados pelos convidados (Android e iOS) e em desktop.
- **SC-005**: O mapa da seção de localização fica visível e interativo em até 3 segundos após a seção entrar na tela, em uma conexão móvel típica.

## Assumptions

- O evento ocorre em um **único local fixo**, conhecido no momento da publicação do convite (coordenadas e endereço definidos por quem configura o site).
- A rota é entregue **delegando a navegação a um serviço de mapas** do dispositivo (aplicativo nativo ou versão web), em vez de o site calcular o trajeto internamente — esse é o padrão para "traçar rota da localização atual".
- O **ponto de partida padrão é a localização atual** do convidado; o site não precisa armazenar nem rastrear essa localização, apenas usá-la no momento de abrir a rota.
- A obtenção da localização atual é responsabilidade do **app/serviço de mapas** (Google Maps), que usa a posição atual como origem padrão; o site não solicita nem armazena geolocalização. Negar a permissão ao app de mapas é um fluxo previsto e não bloqueia o uso.
- O público-alvo acessa majoritariamente por **celular**, então a experiência mobile-first é prioritária (alinhado ao restante do convite).
- O endereço/coordenadas do evento serão fornecidos por quem configura o site; esta especificação não define o endereço específico.
