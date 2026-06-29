# Feature Specification: Redesign de UI/UX das páginas da Dashboard

**Feature Branch**: `011-dashboard-ui-redesign`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "preciso que as páginas de dashboard você melhore o designer dela e deixe com uma UI/UX melhor, os formulários estão horríveis e fora do padrão da nossa aplicação"

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Formulários alinhados ao padrão visual do convite (Priority: P1)

A administradora abre as telas internas do painel (cadastro manual de grupo e filtros da lista de confirmações) e encontra formulários com a mesma linguagem visual delicada e acolhedora do site do convite — campos suaves preenchidos, foco claro, espaçamento confortável e botões consistentes — em vez do visual atual com aparência genérica e destoante.

**Why this priority**: Os formulários são o ponto explicitamente citado como "horríveis e fora do padrão". É onde a administradora passa mais tempo digitando e onde a inconsistência mais incomoda. Corrigir isso já entrega o maior valor percebido e pode ser demonstrado isoladamente.

**Independent Test**: Pode ser totalmente testado abrindo a tela de cadastro manual e a de confirmações, comparando lado a lado com o formulário público do convite, e verificando que campos, rótulos, estados de foco, mensagens e botões seguem o mesmo padrão visual.

**Acceptance Scenarios**:

1. **Given** a administradora está na tela de cadastro manual, **When** ela visualiza o formulário de adicionar/atualizar grupo, **Then** os campos de texto, seletor de presença e blocos de adultos/crianças usam o mesmo estilo visual (preenchimento, cantos, foco, rótulos) adotado no formulário público do convite.
2. **Given** a administradora clica em um campo do formulário, **When** o campo recebe foco, **Then** há um indicador de foco visível e consistente com o restante da aplicação.
3. **Given** a administradora está na tela de confirmações, **When** ela usa o formulário de busca e filtro, **Then** os controles seguem o mesmo padrão visual dos demais formulários do painel.
4. **Given** a administradora envia o formulário com dados inválidos ou com sucesso, **When** a mensagem de erro ou de confirmação aparece, **Then** ela é exibida de forma clara, com destaque visual coerente com o padrão da aplicação.

---

### User Story 2 - Consistência visual entre todas as páginas do painel (Priority: P2)

A administradora navega entre Visão geral, Cadastro manual, Lista de confirmações e Mural de recados e percebe que todas as páginas compartilham a mesma identidade: cabeçalhos, cartões, espaçamentos, hierarquia de títulos e paleta de cores coerentes, transmitindo a sensação de um produto único e cuidado.

**Why this priority**: Depois de corrigir os formulários, a consistência entre páginas eleva a percepção geral de qualidade. Depende de um padrão visual já estabelecido (P1), por isso vem em segundo.

**Independent Test**: Pode ser testado percorrendo cada página do painel e verificando que cabeçalhos de seção, cartões, espaçamentos e tipografia seguem um conjunto consistente de regras, sem páginas destoantes.

**Acceptance Scenarios**:

1. **Given** a administradora navega entre as páginas do painel, **When** cada página é carregada, **Then** os cabeçalhos de seção (rótulo, título e descrição) seguem o mesmo padrão de hierarquia e estilo.
2. **Given** a administradora visualiza qualquer cartão de conteúdo (tabela, lista, formulário, estatísticas), **When** ela compara entre páginas, **Then** os cartões compartilham os mesmos cantos, sombras e respiros internos.
3. **Given** a administradora vê estados vazios (ex.: nenhum recado, nenhuma confirmação), **When** o estado vazio é exibido, **Then** ele segue um padrão visual único e amigável em todas as páginas.

---

### User Story 3 - Leitura e ações claras em listas e tabelas (Priority: P3)

A administradora consulta a lista de confirmações e o mural de recados e consegue ler as informações com conforto e acionar as ações (remover recado, identificar status de presença) de forma clara, inclusive no celular.

**Why this priority**: Melhora a experiência de uso contínuo, mas a leitura já é funcional hoje; é um refinamento sobre a base visual estabelecida nas histórias anteriores.

**Independent Test**: Pode ser testado abrindo a lista de confirmações e o mural em telas grande e pequena, verificando legibilidade, alinhamento e clareza das ações.

**Acceptance Scenarios**:

1. **Given** a administradora abre a lista de confirmações, **When** há muitos registros, **Then** as informações permanecem legíveis e bem alinhadas, com distinção visual clara entre quem confirmou e quem não vai.
2. **Given** a administradora abre o mural de recados, **When** ela precisa remover um recado, **Then** a ação de remover é claramente identificável e fornece feedback durante o processamento.
3. **Given** a administradora usa o painel no celular, **When** ela visualiza listas e tabelas, **Then** o conteúdo se adapta à largura da tela sem quebrar o layout nem exigir rolagem horizontal desconfortável.

---

### Edge Cases

- Como o formulário de cadastro manual se comporta visualmente quando há muitos adultos e crianças adicionados (lista longa)?
- Como os estados de erro e sucesso aparecem quando coexistem com listas longas dentro do mesmo formulário?
- Como as telas se comportam em modo escuro do navegador, dado que a aplicação força tema claro?
- Como os cabeçalhos longos e descrições extensas se comportam em telas estreitas?
- Como o foco do teclado percorre o formulário redesenhado (ordem e visibilidade do indicador de foco)?

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Os formulários do painel (cadastro manual de grupo e busca/filtro da lista de confirmações) MUST adotar a mesma linguagem visual do formulário público do convite, incluindo estilo de campos, rótulos, cantos arredondados e espaçamento.
- **FR-002**: Todos os campos de entrada (texto, número, seleção) MUST apresentar um estado de foco visível e consistente em todo o painel.
- **FR-003**: Os botões de ação primária, secundária e destrutiva MUST seguir um padrão consistente de aparência e estados (normal, hover, desabilitado, processando) em todas as páginas do painel.
- **FR-004**: Cada página do painel MUST exibir um cabeçalho de seção com hierarquia consistente (rótulo de contexto, título e descrição) seguindo o mesmo padrão visual.
- **FR-005**: Os cartões de conteúdo (formulários, tabelas, listas, estatísticas) MUST compartilhar o mesmo padrão de cantos, sombras e respiros internos.
- **FR-006**: As mensagens de erro e de sucesso MUST ser exibidas de forma clara e visualmente coerente com o padrão da aplicação, perceptíveis sem depender apenas de cor.
- **FR-007**: Os estados vazios (sem recados, sem confirmações) MUST seguir um padrão visual único e amigável em todas as páginas.
- **FR-008**: O layout do painel MUST ser totalmente responsivo, sem rolagem horizontal indesejada nem quebra de layout em telas de celular, tablet e desktop.
- **FR-009**: O redesenho MUST preservar todas as funcionalidades atuais do painel (cadastro/atualização de grupo, adição/remoção de adultos e crianças, busca e filtro, remoção de recados, visualização de estatísticas e lista) sem alterar comportamento funcional.
- **FR-010**: O redesenho MUST manter os requisitos de acessibilidade já adotados pela aplicação (rótulos associados aos campos, navegação por teclado, contraste adequado e indicadores de foco visíveis).
- **FR-011**: A distinção visual entre grupos confirmados e não confirmados na lista MUST permanecer clara após o redesenho.
- **FR-012**: A navegação lateral (sidebar) e o estado ativo do item de menu MUST permanecer consistentes com o padrão visual atualizado.

### Key Entities

Não há novas entidades de dados. A funcionalidade é puramente de apresentação e reutiliza as entidades existentes (grupos de RSVP com adultos e crianças, recados do mural, estatísticas de presença).

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos campos de formulário do painel seguem o mesmo padrão visual de campo adotado no formulário público do convite (verificável por inspeção visual lado a lado).
- **SC-002**: Em uma avaliação visual das quatro páginas do painel, nenhuma página é apontada como "destoante" do padrão por um avaliador comparando-as entre si.
- **SC-003**: A administradora consegue concluir o cadastro manual de um grupo completo (com adultos e crianças) sem confusão visual, em até 2 minutos, em uma sessão de teste de uso.
- **SC-004**: O painel é utilizável e legível sem rolagem horizontal em larguras de tela de 360px (celular), 768px (tablet) e 1280px (desktop).
- **SC-005**: Todos os campos do painel apresentam indicador de foco visível ao navegar por teclado (verificável em 100% dos campos).
- **SC-006**: Nenhuma funcionalidade existente do painel deixa de funcionar após o redesenho (verificável pela suíte de testes existente e validação manual).

## Assumptions

- O "padrão da nossa aplicação" referido pela usuária é a linguagem visual do site público do convite (paleta blush/rosê, cantos bem arredondados, cartões suaves com sombras leves, campos preenchidos com foco em anel suave), que serve de referência para o redesenho do painel.
- O escopo é a camada de apresentação (UI/UX) das páginas do painel: Visão geral, Cadastro manual, Lista de confirmações e Mural de recados; não inclui mudanças de regra de negócio, modelo de dados ou novas telas.
- A aplicação continua forçando tema claro; o redesenho não introduz modo escuro.
- O público do painel é a administradora (uso autenticado), com acesso por celular e desktop.
- Os textos e rótulos permanecem em português (pt-BR), conforme o restante da aplicação.
- A validação inclui build e verificação visual real, conforme a constituição do projeto.
