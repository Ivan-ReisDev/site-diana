# Feature Specification: Galeria de Fotos em Carrossel na seção "Nossa História"

**Feature Branch**: `005-photo-gallery-carousel`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Criar um carrossel na área da seção Nossa História. Remover o lado direito atual (a linha do tempo com 13h Recepção, 14h Brincadeiras, 15h Parabéns, Até 20/09 Confirmar presença) e colocar no lugar um grid de fotos da criança: uma foto grande com fotos pequenas ao lado, fazendo transição em carrossel."

## Clarifications

### Session 2026-06-28

- Q: Como as fotos serão fornecidas/atualizadas? → A: Conjunto fixo (estático) — as fotos vão para a pasta `public`; trocar depois exige edição no código.
- Q: O que fazer com o cronograma (13h/14h/15h/Até 20/09) que sai dessa seção? → A: Remover de vez — não aparece em outro lugar; data/horário essenciais seguem na seção "Informações".

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Ver as fotos da princesa em destaque (Priority: P1)

Ao chegar na seção "Nossa História", no lugar da antiga linha do tempo (lado direito), o convidado vê uma galeria de fotos da Diana: uma **foto grande em destaque** acompanhada de **miniaturas ao lado**. As fotos se alternam automaticamente em carrossel, criando um momento afetivo de apresentação da aniversariante.

**Why this priority**: É o coração da mudança pedida — transformar a área em uma vitrine emocional das fotos da criança. Sem isso, a feature não existe. Entrega valor sozinha (mostra as fotos de forma encantadora).

**Independent Test**: Abrir a seção "Nossa História" e confirmar que o lado direito exibe uma foto grande + miniaturas, e que a foto em destaque muda sozinha ao longo do tempo.

**Acceptance Scenarios**:

1. **Given** o convidado está na seção "Nossa História", **When** a seção é exibida, **Then** o lado direito mostra uma foto grande em destaque e um conjunto de miniaturas das demais fotos.
2. **Given** a galeria está visível e parada, **When** alguns segundos se passam, **Then** a foto em destaque transiciona suavemente para a próxima foto, em laço contínuo.
3. **Given** a antiga linha do tempo (13h/14h/15h/Até 20/09) existia ali, **When** a nova seção é exibida, **Then** essa lista lateral não aparece mais.

---

### User Story 2 - Escolher qual foto ver (Priority: P2)

O convidado pode tocar/clicar em uma miniatura para trazer aquela foto para o destaque imediatamente, controlando a galeria no seu ritmo.

**Why this priority**: Dá controle e interatividade ao convidado, aumentando o engajamento. Depende da galeria (P1) já existir.

**Independent Test**: Clicar em uma miniatura e confirmar que ela passa a ser a foto grande em destaque, com a miniatura correspondente indicada como ativa.

**Acceptance Scenarios**:

1. **Given** a galeria está visível, **When** o convidado clica/toca em uma miniatura, **Then** a foto em destaque muda para a foto escolhida com transição suave.
2. **Given** o convidado escolheu manualmente uma foto, **When** a seleção acontece, **Then** a miniatura ativa é destacada visualmente (indicação de qual está em exibição).
3. **Given** o convidado interage com a galeria, **When** ele faz uma seleção manual, **Then** o avanço automático não "briga" com a escolha (a foto escolhida é respeitada antes do próximo avanço).

---

### User Story 3 - Navegar pela galeria em qualquer dispositivo (Priority: P3)

O convidado consegue ver e navegar a galeria de forma confortável tanto no computador quanto no celular, com a foto grande e as miniaturas se adaptando ao tamanho da tela.

**Why this priority**: Garante que a experiência funcione para todos os convidados, já que muitos abrirão pelo celular. Refina a entrega das stories anteriores.

**Independent Test**: Abrir a seção em telas de tamanhos diferentes (celular, tablet, desktop) e confirmar que a foto grande e as miniaturas permanecem legíveis, bem posicionadas e navegáveis.

**Acceptance Scenarios**:

1. **Given** a galeria é exibida no desktop, **When** o convidado visualiza, **Then** a foto grande e as miniaturas aparecem lado a lado, ocupando bem o espaço da seção.
2. **Given** a galeria é exibida no celular, **When** o convidado visualiza, **Then** o layout se adapta (por exemplo, foto grande acima e miniaturas em faixa abaixo) mantendo tudo acessível.
3. **Given** as miniaturas não cabem todas de uma vez, **When** o convidado navega, **Then** ele consegue acessar todas as fotos (por rolagem das miniaturas ou avanço do carrossel).

---

### Edge Cases

- **Apenas uma foto disponível**: a galeria exibe a foto em destaque sem avanço automático e sem miniaturas (ou com uma única miniatura), sem quebrar o layout.
- **Foto que não carrega**: exibir um estado visual de carregamento/placeholder e seguir o carrossel para a próxima sem travar.
- **Conexão lenta**: as fotos devem carregar de forma a não travar a seção; idealmente a primeira foto aparece rápido.
- **Preferência por reduzir movimento**: o avanço automático e as transições devem ser suavizados/simplificados para quem ativa "reduzir movimento".
- **Proporções de foto diferentes** (retrato/paisagem): a foto em destaque deve se acomodar sem distorcer nem cortar de forma desagradável.
- **Conteúdo da antiga linha do tempo**: o cronograma (13h/14h/15h/Até 20/09) deixa de aparecer nesta seção (ver Assumptions sobre realocação).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST remover, da seção "Nossa História", a linha do tempo lateral atual (itens 13h, 14h, 15h e "Até 20/09").
- **FR-002**: O sistema MUST exibir, no lugar removido, uma galeria de fotos da aniversariante composta por uma **foto em destaque (grande)** e um conjunto de **miniaturas** das demais fotos.
- **FR-003**: A galeria MUST avançar automaticamente a foto em destaque em laço contínuo, com transição visual suave entre as fotos.
- **FR-004**: O convidado MUST conseguir selecionar uma miniatura para colocá-la imediatamente em destaque.
- **FR-005**: O sistema MUST indicar visualmente qual foto está em destaque (miniatura ativa).
- **FR-006**: A seleção manual de uma foto MUST ser respeitada (não ser imediatamente sobreposta pelo avanço automático).
- **FR-007**: A galeria MUST ser responsiva, adaptando o arranjo de foto grande + miniaturas para celular, tablet e desktop.
- **FR-008**: O sistema MUST permitir acesso a todas as fotos do conjunto, mesmo quando as miniaturas não couberem todas simultaneamente.
- **FR-009**: O sistema MUST tratar com elegância os casos de uma única foto e de foto que falha ao carregar (sem quebrar o layout).
- **FR-010**: As transições e o avanço automático MUST respeitar a preferência de "reduzir movimento" do dispositivo.
- **FR-011**: A galeria MUST manter a identidade visual do convite (estética de princesa, paleta rosa/dourada) e seguir o padrão de cards já adotado no site.
- **FR-012**: As fotos MUST ser apresentadas mantendo proporção adequada, sem distorção.

### Key Entities

- **Foto da galeria**: cada imagem da aniversariante. Atributos: imagem (origem), texto alternativo/descrição, ordem de exibição.
- **Conjunto da galeria**: a coleção ordenada de fotos exibidas na seção; define a sequência do carrossel.
- **Estado da galeria (em exibição)**: qual foto está em destaque no momento e se o avanço automático está ativo.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos acessos à seção "Nossa História" exibem a galeria de fotos (foto grande + miniaturas) e não exibem mais a antiga linha do tempo.
- **SC-002**: A foto em destaque avança automaticamente sem o convidado precisar fazer nada, em intervalo perceptível e confortável (entre ~3 e ~7 segundos por foto).
- **SC-003**: Ao clicar em uma miniatura, a foto correspondente entra em destaque em menos de 1 segundo.
- **SC-004**: A galeria é exibida de forma legível e navegável em telas de 320px a 1920px de largura, em retrato e paisagem.
- **SC-005**: 100% das fotos do conjunto ficam acessíveis ao convidado (via miniaturas e/ou avanço do carrossel).
- **SC-006**: A seção continua carregando rápido — a primeira foto em destaque aparece sem atraso perceptível na maioria dos acessos com conexão típica.

## Assumptions

- As fotos são um **conjunto curado fornecido pela família** e servido de forma estática junto ao site; **não há** tela de upload/gerenciamento de fotos no escopo desta feature.
- A galeria substitui **apenas** o lado direito (a linha do tempo) da seção "Nossa História"; o lado esquerdo (eyebrow "Nossa História", título e texto introdutório) é **mantido**.
- O comportamento padrão combina **avanço automático** com **seleção manual** por miniaturas (a interação do convidado tem prioridade sobre o avanço automático).
- O cronograma da festa (13h/14h/15h/Até 20/09) que estava nesta linha do tempo **deixa de ser exibido aqui**. As informações essenciais de data/horário/local já constam na seção "Informações"; caso se deseje preservar o cronograma detalhado, isso seria tratado em outra seção/feature (fora do escopo atual).
- A quantidade de fotos é flexível (tipicamente de 3 a 8); o layout deve acomodar variações nesse intervalo.
- No celular, o arranjo padrão é **foto grande acima** e **miniaturas em faixa abaixo** (rolável se necessário).
- As fotos exibidas são públicas para qualquer visitante do convite (sem necessidade de autenticação).
