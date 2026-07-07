# Feature Specification: Excluir e editar confirmações no painel

**Feature Branch**: `012-rsvp-edit-delete`

**Created**: 2026-07-06

**Status**: Draft

**Input**: User description: "quero poder excluir cada um desses se eu quiser então falta a função de excluir o usuário aqui /dashboard/confirmacoes e também falta a função de editar caso o convidado tenha preenchido errado"

## Resumo do problema

Hoje a página `/dashboard/confirmacoes` apenas **lista** as confirmações enviadas pelos convidados (nome, telefone, status, adultos, crianças, atualização). O administrador consegue ver os registros, mas **não consegue removê-los nem corrigi-los**. Isso gera dois problemas práticos:

1. Quando um convidado preenche o formulário com dados errados (nome trocado, telefone incorreto, número de adultos/crianças equivocado, marcou presença errada), o administrador não tem como corrigir — o dado errado permanece na lista e nas estatísticas.
2. Quando um registro precisa sair da lista (duplicado, teste, desistência, cadastro indevido), o administrador não tem como excluí-lo.

Esta feature adiciona as ações de **editar** e **excluir** para cada confirmação diretamente na lista do painel.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Excluir uma confirmação (Priority: P1)

Como administrador, na página de confirmações quero excluir um registro específico da lista, para remover cadastros duplicados, de teste ou indevidos. A exclusão pede uma confirmação antes de apagar, para evitar remoção acidental, e depois de confirmada o registro some da lista e deixa de contar nas estatísticas.

**Why this priority**: É o pedido central ("quero poder excluir cada um desses"). Entrega valor imediato mesmo sem a edição: o administrador ganha controle para limpar a lista.

**Independent Test**: Acessar `/dashboard/confirmacoes`, acionar a exclusão de um registro, confirmar na caixa de confirmação e verificar que o registro desaparece da lista e que os totais/estatísticas passam a desconsiderá-lo.

**Acceptance Scenarios**:

1. **Given** o administrador autenticado na página de confirmações com pelo menos um registro, **When** aciona a ação de excluir em um registro e confirma, **Then** o registro é removido e a lista é atualizada sem ele.
2. **Given** o administrador aciona a ação de excluir, **When** cancela na caixa de confirmação, **Then** nenhum registro é removido e a lista permanece inalterada.
3. **Given** um registro confirmado ("sim") foi excluído, **When** o administrador visualiza a visão geral/estatísticas, **Then** os totais de grupos, adultos e crianças refletem a remoção.
4. **Given** o administrador tenta excluir um registro que já foi removido (ex.: em outra aba), **When** confirma a exclusão, **Then** recebe uma mensagem indicando que o registro não foi encontrado e a lista é atualizada.

---

### User Story 2 - Editar uma confirmação preenchida errada (Priority: P1)

Como administrador, quero corrigir os dados de uma confirmação existente (nome, telefone, presença, lista de adultos e de crianças com idade, e recado), para consertar o que o convidado preencheu errado sem precisar apagar e recadastrar. Ao salvar, a lista e as estatísticas passam a refletir os dados corrigidos.

**Why this priority**: É a segunda metade explícita do pedido ("falta a função de editar caso o convidado tenha preenchido errado"). Sem ela, o administrador só conseguiria corrigir excluindo e recriando o registro, o que é trabalhoso e arriscado.

**Independent Test**: Acessar `/dashboard/confirmacoes`, abrir a edição de um registro, alterar um ou mais campos (ex.: corrigir o telefone e o número de adultos), salvar e verificar que a lista mostra os novos valores e que as estatísticas foram recalculadas.

**Acceptance Scenarios**:

1. **Given** o administrador autenticado na página de confirmações, **When** aciona a ação de editar em um registro, **Then** vê um formulário pré-preenchido com os dados atuais daquele registro.
2. **Given** o formulário de edição aberto, **When** altera campos válidos (ex.: nome, telefone, status de presença, adultos, crianças com idade, recado) e salva, **Then** o registro é atualizado e a lista exibe os valores corrigidos.
3. **Given** o administrador editou um registro confirmado alterando a quantidade de adultos/crianças, **When** salva, **Then** as estatísticas de presença são recalculadas com os novos números.
4. **Given** o formulário de edição aberto, **When** o administrador cancela sem salvar, **Then** nenhuma alteração é aplicada ao registro.
5. **Given** o administrador altera o status de "confirmado" para "não irá" (ou vice-versa), **When** salva, **Then** o registro passa a contar na categoria correta das estatísticas.

---

### User Story 3 - Feedback claro e proteção contra erros (Priority: P2)

Como administrador, quero receber confirmação visual do resultado de cada ação (sucesso ao excluir/salvar, ou mensagem de erro quando algo falha) e ser impedido de salvar dados inválidos, para ter confiança de que a correção foi aplicada corretamente.

**Why this priority**: Melhora a segurança e a confiança nas ações destrutivas/corretivas, mas as ações principais (excluir/editar) já entregam valor sem o polimento completo de feedback.

**Independent Test**: Acionar exclusão e edição e observar mensagens de sucesso; tentar salvar uma edição com campo obrigatório vazio ou telefone em formato inválido e confirmar que o sistema bloqueia com mensagem clara.

**Acceptance Scenarios**:

1. **Given** o administrador exclui um registro com sucesso, **When** a operação conclui, **Then** vê uma mensagem de confirmação de que a confirmação foi removida.
2. **Given** o administrador tenta salvar uma edição com um campo obrigatório vazio (ex.: nome ou telefone), **When** envia, **Then** o sistema não salva e exibe qual campo precisa ser corrigido.
3. **Given** o administrador edita o telefone para um valor que colidiria com o de outro registro existente, **When** salva, **Then** o sistema informa o conflito e não sobrescreve outro registro.
4. **Given** ocorre uma falha ao excluir ou salvar (ex.: sem conexão), **When** a operação falha, **Then** o administrador vê uma mensagem de erro e o registro permanece no estado anterior.

---

### Edge Cases

- **Exclusão do último registro**: excluir o único registro da lista deve resultar no estado vazio ("Nenhuma confirmação encontrada"), sem erro.
- **Registro já removido**: excluir/editar um registro que já não existe mais (removido em outra sessão/aba) deve retornar "não encontrado" e atualizar a visão, sem quebrar a página.
- **Telefone duplicado na edição**: alterar o telefone para um que já pertence a outro registro não pode sobrescrever nem duplicar; deve ser bloqueado com mensagem.
- **Ação sem sessão válida**: tentar excluir/editar com sessão expirada deve ser bloqueado (não autorizado), sem alterar dados.
- **Filtros/busca ativos**: excluir ou editar com filtros de status/busca aplicados deve manter o filtro atual e refletir a mudança dentro do resultado filtrado.
- **Edição que zera participantes**: reduzir adultos/crianças a zero deve ser aceito apenas se coerente com as regras de validação já usadas no cadastro (mesma validação do formulário de origem).

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema DEVE exibir, para cada confirmação listada em `/dashboard/confirmacoes`, uma ação de **excluir** e uma ação de **editar**.
- **FR-002**: Antes de excluir, o sistema DEVE solicitar uma **confirmação explícita** do administrador e só remover o registro após essa confirmação.
- **FR-003**: Ao confirmar a exclusão, o sistema DEVE remover permanentemente o registro correspondente e atualizar a lista exibida para não incluí-lo.
- **FR-004**: Após uma exclusão, o sistema DEVE recalcular as estatísticas/totais de presença para desconsiderar o registro removido.
- **FR-005**: Se o registro alvo de exclusão não existir mais, o sistema DEVE informar "não encontrado" e atualizar a visão sem falhar.
- **FR-006**: O sistema DEVE permitir abrir a **edição** de um registro, exibindo um formulário **pré-preenchido** com os dados atuais do registro.
- **FR-007**: A edição DEVE permitir alterar os mesmos campos que o convidado pode preencher: nome, telefone, status de presença (irá / não irá), lista de adultos, lista de crianças com idade, e recado/mensagem.
- **FR-008**: Ao salvar uma edição, o sistema DEVE aplicar a **mesma validação** usada no cadastro de confirmações (campos obrigatórios, formato de telefone, coerência de participantes).
- **FR-009**: Se a edição contiver dados inválidos, o sistema DEVE **não salvar** e indicar ao administrador o que precisa ser corrigido.
- **FR-010**: Ao salvar uma edição válida, o sistema DEVE atualizar o registro existente (sem criar um novo) e refletir os novos valores na lista.
- **FR-011**: Após uma edição, o sistema DEVE recalcular as estatísticas/totais de presença com base nos dados atualizados.
- **FR-012**: O sistema DEVE impedir que uma edição de telefone sobrescreva ou duplique outro registro existente com o mesmo telefone, informando o conflito ao administrador.
- **FR-013**: As ações de excluir e editar DEVEM estar disponíveis **apenas para administradores autenticados**; requisições sem sessão válida devem ser rejeitadas sem alterar dados.
- **FR-014**: O sistema DEVE fornecer **feedback visual** do resultado de cada ação (sucesso ou erro).
- **FR-015**: O administrador DEVE poder **cancelar** tanto a exclusão (na confirmação) quanto a edição (no formulário) sem que nenhuma alteração seja aplicada.
- **FR-016**: Excluir ou editar com filtros de status/busca ativos DEVE preservar os filtros atuais e refletir a mudança no resultado exibido.

### Key Entities *(include if feature involves data)*

- **Confirmação (RSVP)**: representa a resposta de um grupo de convidados. Atributos relevantes para esta feature: nome do responsável, telefone (identificador único do grupo), status de presença (irá / não irá), quantidade e lista de adultos, quantidade e lista de crianças (com idade), recado opcional, e datas de criação/atualização. É a entidade sobre a qual incidem as ações de excluir e editar.
- **Estatísticas de presença**: totais derivados das confirmações (grupos confirmados/recusados, adultos, crianças, total). São recalculados após exclusão ou edição.
- **Administrador**: usuário autenticado do painel, único autorizado a excluir e editar confirmações.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: O administrador consegue excluir uma confirmação da lista em até 3 interações (acionar → confirmar → concluído), com o registro desaparecendo da lista imediatamente após a confirmação.
- **SC-002**: O administrador consegue corrigir um dado errado de uma confirmação (ex.: telefone) e ver o valor atualizado na lista em menos de 1 minuto, sem precisar apagar e recadastrar.
- **SC-003**: 100% das exclusões exigem uma confirmação explícita antes de apagar (nenhuma exclusão ocorre em clique único acidental).
- **SC-004**: Após exclusão ou edição, os totais de presença exibidos refletem 100% das mudanças, sem exigir recarregar manualmente a página.
- **SC-005**: Tentativas de salvar edições inválidas (campo obrigatório vazio, telefone inválido ou em conflito) são bloqueadas em 100% dos casos, com mensagem indicando a causa.
- **SC-006**: Nenhuma ação de excluir ou editar é concluída sem sessão de administrador válida.

## Assumptions

- A edição reutiliza as mesmas regras de validação e o mesmo conjunto de campos do cadastro manual de confirmações já existente no painel; não há novos campos.
- A exclusão é permanente (hard delete), sem lixeira/undo — o padrão já adotado para outros registros do painel (ex.: recados). Uma confirmação explícita é suficiente como salvaguarda.
- O telefone continua sendo o identificador único de um grupo/confirmação; a edição respeita essa unicidade.
- As ações de excluir e editar ficam na própria lista de `/dashboard/confirmacoes`, integradas a cada linha/cartão de registro, sem criar uma nova rota de página dedicada.
- O público desta funcionalidade é o administrador do painel (ex.: a organizadora), acessando de desktop ou celular; a lista já é responsiva e as novas ações devem seguir o mesmo padrão.
- Não há requisito de registro de auditoria/histórico de quem alterou ou excluiu, além do comportamento já existente.
