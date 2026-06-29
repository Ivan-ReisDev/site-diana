# Feature Specification: Dashboard em páginas separadas

**Feature Branch**: `009-dashboard-separate-pages`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "Preciso que você Atualize isso aqui na página separada tá tudo em pagina unica separado só por id as sessões isso acontece em http://localhost:3000/dashboard#confirmacoes"

## Resumo do problema

Hoje o painel administrativo (`/dashboard`) carrega **todas as seções em uma única página**, separadas apenas por âncoras de id (`#visao-geral`, `#cadastro-manual`, `#confirmacoes`, `#mural-recados`). Os itens do menu lateral apenas rolam a mesma página até a âncora correspondente. O administrador quer que cada seção seja uma **página própria**, navegável por uma rota distinta, em vez de tudo empilhado numa só tela.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Navegar entre seções do painel por páginas distintas (Priority: P1)

Como administrador, ao clicar em um item do menu lateral (ex.: "Lista de confirmações"), quero ser levado a uma página dedicada que mostra apenas aquela seção, e não rolar uma página única que contém tudo. Cada seção tem seu próprio endereço (rota), para que eu possa abrir, recarregar ou compartilhar o link direto de uma seção específica.

**Why this priority**: É o coração do pedido — transformar a navegação por âncora em navegação por páginas. Sem isso, nada do que o usuário pediu acontece.

**Independent Test**: Acessar o painel, clicar em cada item do menu e verificar que cada clique navega para uma URL diferente (uma rota por seção) exibindo somente o conteúdo daquela seção. Recarregar a página de uma seção mantém o usuário naquela seção.

**Acceptance Scenarios**:

1. **Given** o administrador autenticado no painel, **When** clica em "Visão geral", **Then** é levado à página da visão geral (totais/estatísticas) em uma rota própria que exibe apenas essa seção.
2. **Given** o administrador autenticado, **When** clica em "Cadastro manual", **Then** é levado à página de cadastro manual em rota própria exibindo apenas o formulário de adicionar/atualizar grupo.
3. **Given** o administrador autenticado, **When** clica em "Lista de confirmações", **Then** é levado à página de confirmações em rota própria exibindo apenas filtros + tabela de confirmações.
4. **Given** o administrador na página de uma seção, **When** recarrega o navegador (F5), **Then** permanece naquela mesma seção (a rota é estável e recarregável).
5. **Given** o administrador, **When** copia o endereço de uma seção e abre em nova aba, **Then** a aba abre diretamente naquela seção.

---

### User Story 2 - Menu lateral indica a seção atual (Priority: P2)

Como administrador, quero que o item do menu correspondente à página em que estou apareça destacado como ativo, para saber em qual seção estou.

**Why this priority**: Melhora a orientação ao navegar entre páginas reais. Importante, mas o painel funciona sem o destaque.

**Independent Test**: Navegar para cada seção e confirmar que o item de menu correspondente recebe destaque visual de "ativo" e os demais não.

**Acceptance Scenarios**:

1. **Given** o administrador na página de confirmações, **When** olha o menu lateral, **Then** o item "Lista de confirmações" aparece destacado como ativo.
2. **Given** o administrador troca para outra seção, **When** a nova página carrega, **Then** o destaque de ativo migra para o item correspondente.

---

### User Story 3 - Entrada padrão e endereços antigos continuam funcionando (Priority: P3)

Como administrador, ao acessar `/dashboard`, quero cair em uma seção inicial padrão (visão geral), e que eventuais links antigos com âncora (`/dashboard#confirmacoes`) não me deixem em uma tela quebrada.

**Why this priority**: Garante que a transição não quebre marcadores/atalhos existentes e que a raiz do painel tenha um destino claro.

**Independent Test**: Acessar `/dashboard` e um link antigo com âncora; confirmar que ambos resultam em uma seção válida exibida corretamente.

**Acceptance Scenarios**:

1. **Given** um administrador autenticado, **When** acessa `/dashboard`, **Then** vê a seção inicial padrão (visão geral) sem erro.
2. **Given** um link antigo `/dashboard#confirmacoes`, **When** é aberto por um administrador autenticado, **Then** o sistema apresenta uma seção válida do painel sem tela em branco ou erro.

---

### Edge Cases

- **Sessão expirada / não autenticado**: ao acessar qualquer página de seção sem sessão válida, o administrador é redirecionado para o login (mesma proteção que existe hoje no painel).
- **Filtros e busca na lista de confirmações**: ao aplicar filtro/busca na página de confirmações, os parâmetros precisam permanecer válidos dentro daquela rota (filtro não pode "vazar" para outras seções nem ser perdido ao recarregar).
- **Mural de recados**: a seção de mural de recados também existe hoje na página única; é preciso decidir se vira página própria, permanece dentro de outra seção, ou some — ver clarificação.
- **Navegação direta para rota inexistente** sob o painel: deve resultar em um destino tratado (seção padrão ou página de "não encontrado") e não em erro bruto.
- **Menu mobile**: ao selecionar uma seção no menu colapsado em telas pequenas, o menu deve fechar e navegar para a página correta.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O painel MUST expor cada seção administrativa (visão geral, cadastro manual, lista de confirmações e mural de recados) como uma página navegável por rota própria, em vez de uma única página com âncoras.
- **FR-002**: O menu lateral MUST navegar para a página/rota da seção selecionada (navegação entre páginas), substituindo o comportamento atual de rolagem por âncora.
- **FR-003**: Cada página de seção MUST exibir somente o conteúdo daquela seção, sem renderizar o conteúdo das demais seções na mesma tela.
- **FR-004**: Cada página de seção MUST possuir endereço estável que possa ser recarregado e aberto diretamente (deep link), preservando a seção exibida.
- **FR-005**: O menu lateral MUST destacar o item correspondente à seção atualmente exibida.
- **FR-006**: O acesso a `/dashboard` (raiz do painel) MUST apresentar uma seção inicial padrão definida (visão geral) sem exigir clique adicional.
- **FR-007**: Todas as páginas de seção MUST manter a proteção de autenticação existente, redirecionando administradores sem sessão válida para o login.
- **FR-008**: O layout comum do painel (menu lateral, cabeçalho do painel, botão de sair) MUST permanecer visível e consistente em todas as páginas de seção.
- **FR-009**: A página de lista de confirmações MUST preservar a funcionalidade de filtros e busca dentro de sua própria rota, mantendo os parâmetros ao recarregar.
- **FR-010**: A reorganização MUST preservar todas as funcionalidades atuais de cada seção (estatísticas, cadastro/atualização manual de grupos, listagem/filtro de confirmações, gestão de recados); nenhuma capacidade existente pode ser perdida.
- **FR-011**: O menu mobile (colapsado) MUST fechar ao selecionar uma seção e levar o administrador à página correspondente.

### Key Entities *(include if feature involves data)*

Nenhuma entidade de dados nova. A funcionalidade reorganiza a apresentação/navegação de dados já existentes (grupos de presença/RSVP, estatísticas e recados). As fontes de dados e regras de negócio permanecem inalteradas.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das seções do painel (visão geral, cadastro manual, lista de confirmações e mural de recados) são acessíveis por endereços distintos, cada um exibindo apenas sua própria seção.
- **SC-002**: Ao recarregar a página em qualquer seção, o administrador permanece na mesma seção em 100% dos casos (sem voltar para o topo de uma página única).
- **SC-003**: O item de menu correspondente à seção atual aparece destacado como ativo em 100% das seções.
- **SC-004**: Nenhuma funcionalidade existente do painel é perdida na reorganização — todas as ações disponíveis hoje continuam executáveis após a mudança (verificável por checklist de paridade de funcionalidades).
- **SC-005**: Acessar a raiz `/dashboard` leva a uma seção inicial válida sem erro em 100% dos acessos autenticados.

## Assumptions

- O escopo é apenas a navegação/organização das seções já existentes do painel; não há novas funcionalidades de dados.
- A seção inicial padrão ao acessar `/dashboard` é a "Visão geral" (totais/estatísticas), por ser a tela de resumo natural.
- A proteção de autenticação atual do painel (redirecionar para `/login` quando não há sessão) é reutilizada em todas as novas páginas.
- O visual, as cores e os componentes de cada seção permanecem os mesmos; muda a forma de navegar, não o design interno de cada seção.
- O mural de recados, hoje presente na página única, será tratado conforme a decisão de clarificação abaixo.

## Clarifications

### Question 1: Como tratar o "Mural de recados" e a "Visão geral" no novo menu?

**Context**: O menu lateral atual lista apenas três itens ("Visão geral", "Cadastro manual", "Lista de confirmações"), mas a página única contém **quatro** seções com id, incluindo `#mural-recados` (gestão de recados) que não tem item de menu.

**What we need to know**: Quais seções devem virar páginas próprias no menu?

| Option | Answer | Implications |
|--------|--------|--------------|
| A | Quatro páginas: Visão geral, Cadastro manual, Lista de confirmações e **Mural de recados** (adicionar item no menu) | Cada seção atual vira uma página; mural ganha entrada de menu própria. Navegação mais completa. |
| B | Três páginas (espelhando o menu atual): Visão geral, Cadastro manual, Lista de confirmações — e o **Mural de recados** fica dentro da Visão geral ou de outra página | Menos rotas; mural não tem rota própria. Mantém o menu como está hoje. |
| C | Três páginas e **remover** o mural do painel administrativo | Simplifica, mas perde a gestão de recados no painel (precisa confirmar que não é usada). |
| Custom | Outra combinação | Descreva quais seções viram páginas e onde o mural aparece. |

**Your choice**: **A** — Quatro páginas, incluindo o Mural de recados com item próprio no menu (escolha não-destrutiva, preserva toda a funcionalidade atual).

---

### Question 2: Qual deve ser o endereço (estrutura de URL) de cada seção?

**Context**: Hoje tudo vive em `/dashboard` com âncoras. Ao virar páginas, é preciso decidir o padrão de endereço.

**What we need to know**: Como nomear as rotas das seções?

| Option | Answer | Implications |
|--------|--------|--------------|
| A | Sub-rotas sob o painel (ex.: `/dashboard/visao-geral`, `/dashboard/cadastro-manual`, `/dashboard/confirmacoes`, `/dashboard/mural`) e `/dashboard` redireciona para a visão geral | URLs descritivas e organizadas; `/dashboard` continua sendo a entrada. Padrão mais comum. |
| B | `/dashboard` é a própria Visão geral e as demais são sub-rotas (`/dashboard/cadastro-manual`, etc.) | Evita um redirecionamento; raiz já mostra a visão geral. |
| Custom | Outro padrão de nomes/idioma (ex.: inglês) | Descreva o padrão desejado. |

**Your choice**: **B** — `/dashboard` é a própria Visão geral; demais seções como sub-rotas (`/dashboard/cadastro-manual`, `/dashboard/confirmacoes`, `/dashboard/mural`). Evita redirecionamento extra na raiz.
