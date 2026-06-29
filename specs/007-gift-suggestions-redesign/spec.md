# Feature Specification: Novo Formato de Sugestões de Presente

**Feature Branch**: `007-gift-suggestions-redesign`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Vamos montar um novo formato de sugestões de presentes — Sugestões de Presente. 1- primeiro precisamos colocar no estilo do nosso sistema. 2 - Onde comprar não quero que tenha mais isso, nem preço e afins. É só sugestão mesmo."

## Clarifications

### Session 2026-06-29

- Q: Qual formato visual a nova seção deve ter? → A: Cards com imagem ilustrativa (estilo das outras seções), sem preço e sem "onde comprar".
- Q: Como apresentar as ideias dentro de cada presente? → A: Manter várias ideias/variações por presente (2-3).
- Q: Quantos presentes a seção deve listar? → A: Manter os 12 presentes atuais, removendo apenas os dados comerciais.
- Atualização (2026-06-29): a lista de 12 brinquedos específicos foi substituída por **11 categorias** de presente (ex.: "Brinquedos musicais", "Roupinhas e Vestidinhos", "Sapatinhos e Sandálias"), cada uma com foto royalty-free e 2-3 ideias. Imagens passam a ser fotos de banco (royalty-free) curadas por categoria.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver sugestões de presente como ideias puras (Priority: P1)

Um convidado acessa a seção "Sugestões de Presente" do convite e encontra uma
lista de ideias carinhosas de presentes para a princesa Diana, apresentadas
apenas como inspiração — sem indicação de onde comprar, sem preços e sem
qualquer informação comercial. O foco é ajudar quem quer presentear a ter boas
ideias, deixando a escolha de loja e valor totalmente livre.

**Why this priority**: É o coração do pedido. Sem isso, a seção continua sendo
uma lista de compras com preços e lojas, contrariando a intenção de que seja
"só sugestão mesmo". Entrega valor sozinha.

**Independent Test**: Abrir a seção de presentes e confirmar que cada card mostra
apenas o nome do presente e suas ideias/descrições, sem nenhum preço, valor
sugerido ou link/menção de loja.

**Acceptance Scenarios**:

1. **Given** o convidado abre a seção "Sugestões de Presente", **When** a seção
   carrega, **Then** cada sugestão exibe nome e ideias do presente sem exibir
   qualquer preço ou valor.
2. **Given** o convidado lê uma sugestão, **When** procura por onde comprar,
   **Then** não existe nenhum bloco "Onde comprar", link de loja ou botão de
   compra.
3. **Given** o convidado percorre toda a lista de sugestões, **When** chega ao
   final, **Then** o conteúdo é percebido como inspiração/ideias, não como uma
   lista de produtos com valores.

---

### User Story 2 - Visual alinhado ao estilo do sistema (Priority: P1)

Um convidado navega pelo convite e percebe que a seção de sugestões de presente
tem a mesma identidade visual das demais seções do site (paleta de cores,
tipografia, formato dos cards, espaçamentos e animações), de modo que a seção
pareça parte natural do convite e não um bloco destoante.

**Why this priority**: O usuário pediu explicitamente "primeiro precisamos
colocar no estilo do nosso sistema". A coerência visual é parte essencial da
entrega e deve acompanhar a remoção das informações comerciais.

**Independent Test**: Comparar a seção de sugestões com outras seções do convite
(ex.: galeria, localização) e confirmar uso da mesma paleta, fontes, estilo de
cards e padrão de animação de entrada.

**Acceptance Scenarios**:

1. **Given** o convidado visualiza a seção, **When** compara com as demais
   seções, **Then** a paleta de cores, as fontes e o estilo dos cards são
   consistentes com o restante do convite.
2. **Given** o convidado acessa pelo celular, **When** a seção é exibida,
   **Then** o layout é responsivo e mantém legibilidade e harmonia visual em
   telas pequenas, médias e grandes.
3. **Given** o convidado rola a página até a seção, **When** ela entra na tela,
   **Then** a animação de entrada segue o mesmo padrão das outras seções.

---

### Edge Cases

- O que acontece se uma sugestão não tiver imagem associada? A seção deve exibir
  um estado visual de fallback coerente com o estilo do sistema, sem quebrar o
  layout.
- Como a seção se comporta quando há muitas sugestões? O layout em grade deve
  acomodar todas as sugestões mantendo alinhamento e respiro visual.
- O texto/título introdutório da seção não deve mais prometer "lojas onde
  encontrá-los", já que essa informação foi removida.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: A seção "Sugestões de Presente" MUST exibir cada presente apenas
  como sugestão/ideia, em formato de card com imagem ilustrativa, contendo nome
  do presente e várias ideias/variações (tipicamente 2-3) por presente.
- **FR-008**: A seção MUST listar as 11 categorias de presente definidas
  (brinquedos interativos, bichinhos de pelúcia, livrinhos infantis, brinquedos
  musicais, brinquedos educativos, roupinhas e vestidinhos, brinquedos
  sensoriais, sapatinhos e sandálias, brinquedos de encaixe ou montar,
  brinquedos de puxar ou empurrar, instrumentos musicais infantis), cada uma com
  foto royalty-free e 2-3 ideias, sem dados comerciais.
- **FR-002**: A seção MUST NOT exibir qualquer preço, valor sugerido ou
  informação monetária para os presentes.
- **FR-003**: A seção MUST NOT exibir o bloco "Onde comprar" nem qualquer link,
  botão ou menção a lojas/marketplaces.
- **FR-004**: O texto introdutório da seção MUST ser ajustado para refletir que
  o conteúdo é apenas sugestão/inspiração, sem mencionar preços ou lojas.
- **FR-005**: A apresentação visual da seção MUST seguir a identidade visual do
  sistema (paleta de cores, tipografia, formato de cards, espaçamentos e
  animações) usada nas demais seções do convite.
- **FR-006**: A seção MUST ser responsiva, mantendo legibilidade e harmonia em
  dispositivos móveis, tablets e desktops.
- **FR-007**: Quando uma sugestão não possuir imagem, a seção MUST apresentar um
  estado de fallback visualmente coerente, sem quebrar o layout.

### Key Entities *(include if feature involves data)*

- **Sugestão de Presente**: Representa uma ideia de presente. Atributos
  relevantes após a mudança: nome do presente, lista de ideias/descrições e,
  opcionalmente, uma imagem ilustrativa. NÃO inclui mais preço nem informações
  de loja/onde comprar.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos cards de sugestão exibem zero referências a preço/valor.
- **SC-002**: 100% dos cards de sugestão exibem zero links, botões ou menções a
  lojas ("Onde comprar").
- **SC-003**: A seção é percebida como visualmente consistente com o restante do
  convite em uma revisão lado a lado (paleta, fontes, cards e animação iguais às
  demais seções).
- **SC-004**: A seção exibe corretamente, sem quebra de layout, em larguras de
  tela representativas de celular, tablet e desktop.
- **SC-005**: Um convidado consegue entender que o conteúdo é apenas inspiração
  de presentes, sem sentir pressão de valor ou de loja específica.

## Assumptions

- A seção continua existindo no convite (mesma âncora/seção "Sugestões de
  Presente"); o pedido é reformatar o conteúdo, não removê-lo.
- "Estilo do nosso sistema" refere-se à identidade visual já adotada nas demais
  seções do convite (paleta rosé/dourado, tipografia script/serif, cards
  arredondados e animações de entrada).
- "Preço e afins" abrange qualquer informação comercial (preço, valor sugerido,
  faixa de valor, lojas, links de compra); imagens ilustrativas dos presentes
  são mantidas, pois não são informação comercial.
- A funcionalidade de Pix (seção separada "Pix Descomplica") permanece
  inalterada e fora do escopo desta mudança.
- A lista de presentes/ideias já existente serve como base de conteúdo,
  ajustada para remover os campos comerciais.
