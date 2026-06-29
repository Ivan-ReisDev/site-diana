# Feature Specification: Ajuste de idade no RSVP e Mural de Recados persistente

**Feature Branch**: `008-rsvp-child-age-mural`

**Created**: 2026-06-29

**Status**: Draft

**Input**: User description: "preciso que você faça a o seguinte na página de confirmação de presença você vai tirar o a idade do adulto e deixar apenas a idade no campo quando adicionar criança e precisamos deixar o mural de recados funcionando com o banco de dados também"

## Clarifications

### Session 2026-06-29

- Q: Como os recados devem ser publicados no mural público? → A: Aparecem imediatamente após o envio, sem aprovação prévia (publicação instantânea).
- Q: A organizadora deve poder remover recados inadequados? → A: Sim — remoção reativa pela organizadora no painel administrativo existente.
- Q: Onde a organizadora gerencia/remove os recados? → A: No painel administrativo existente (mesmo login/dashboard), reaproveitando a autenticação atual.
- Q: Que proteção contra spam/abuso o mural público deve ter? → A: Validação básica (nome e mensagem obrigatórios, limite de 240 caracteres, sem envio duplicado por clique) **mais** rate limiting por dispositivo.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Confirmar presença sem informar idade de adultos (Priority: P1)

Um convidado abre a página de confirmação de presença, adiciona os adultos do seu grupo informando apenas o nome completo de cada um, e adiciona as crianças informando nome completo **e** idade. A idade deixa de ser solicitada para adultos.

**Why this priority**: É a mudança de comportamento explicitamente pedida e afeta diretamente o fluxo principal de confirmação que todo convidado utiliza. Reduz atrito no formulário e remove um dado desnecessário.

**Independent Test**: Pode ser testada de forma independente preenchendo o formulário de presença: o campo de idade não aparece para nenhum adulto, aparece para cada criança, e a confirmação é aceita e salva corretamente sem idade de adultos.

**Acceptance Scenarios**:

1. **Given** o formulário de confirmação de presença aberto, **When** o convidado visualiza a seção de adultos, **Then** cada adulto exibe somente o campo de nome completo (nenhum campo de idade).
2. **Given** o formulário de confirmação de presença aberto, **When** o convidado adiciona uma criança, **Then** a criança exibe os campos de nome completo e idade.
3. **Given** adultos preenchidos só com nome e crianças com nome e idade válidos, **When** o convidado envia a confirmação, **Then** a confirmação é registrada com sucesso e os dados ficam persistidos.
4. **Given** uma criança sem idade informada, **When** o convidado tenta enviar, **Then** o sistema impede o envio e exibe mensagem orientando a preencher a idade da criança.
5. **Given** uma confirmação registrada, **When** a organizadora consulta os dados no painel administrativo, **Then** os adultos aparecem sem idade e as crianças aparecem com idade, sem erros de exibição.

---

### User Story 2 - Deixar um recado que permanece salvo (Priority: P1)

Um convidado escreve seu nome e uma mensagem no Mural de Recados e envia. A mensagem é gravada no banco de dados e continua visível para qualquer pessoa que acesse a página depois, inclusive após recarregar a página ou em outro dispositivo.

**Why this priority**: Hoje os recados existem apenas na memória do navegador e desaparecem ao recarregar a página, então a funcionalidade não cumpre sua promessa ("sua mensagem aparece no mural para sempre"). Persistir os recados é essencial para o valor do mural.

**Independent Test**: Pode ser testada enviando um recado, recarregando a página (ou abrindo em outro navegador/dispositivo) e confirmando que o recado continua aparecendo no mural.

**Acceptance Scenarios**:

1. **Given** o Mural de Recados na página, **When** o convidado informa nome e mensagem e envia, **Then** o recado é salvo e passa a aparecer na lista de recados com confirmação de envio.
2. **Given** um recado já enviado anteriormente, **When** qualquer visitante recarrega a página ou acessa de outro dispositivo, **Then** o recado continua visível no mural.
3. **Given** o campo de nome ou de mensagem vazio, **When** o convidado tenta enviar, **Then** o envio é impedido e o recado não é salvo.
4. **Given** vários recados enviados em momentos diferentes, **When** o mural é exibido, **Then** os recados aparecem em ordem cronológica consistente (mais recentes primeiro).
5. **Given** nenhum recado cadastrado, **When** o mural é exibido, **Then** é mostrado o estado vazio convidando a deixar o primeiro recado.

---

### Edge Cases

- **Mensagem muito longa**: o campo de mensagem possui limite de 240 caracteres; mensagens são limitadas a esse tamanho antes de salvar.
- **Falha ao salvar o recado**: se o salvamento no banco falhar, o convidado vê uma mensagem de erro amigável e a mensagem digitada não é perdida da tela, permitindo nova tentativa.
- **Falha ao carregar os recados**: se a lista não puder ser carregada, a página exibe um estado de erro ou vazio sem quebrar o restante da página.
- **Envio duplicado (clique repetido)**: clicar em enviar várias vezes rapidamente não deve criar recados duplicados nem múltiplas confirmações.
- **Conteúdo indevido em recados**: como o mural é público e a publicação é instantânea (sem aprovação prévia), a organizadora deve poder remover um recado inadequado pelo painel administrativo.
- **Excesso de envios do mesmo dispositivo**: envios acima do limite permitido por dispositivo em um intervalo de tempo são bloqueados com mensagem amigável, sem gravar recados em excesso.
- **Grupo só com adultos**: confirmar presença sem nenhuma criança continua funcionando normalmente.
- **Dados antigos de RSVP**: confirmações registradas antes desta mudança (que possam conter idade de adultos) continuam sendo exibidas sem causar erro.

## Requirements *(mandatory)*

### Functional Requirements

#### Confirmação de presença (idade)

- **FR-001**: O formulário de confirmação de presença MUST exibir, para cada adulto, apenas o campo de nome completo, sem campo de idade.
- **FR-002**: O formulário MUST continuar exibindo, para cada criança, os campos de nome completo e idade.
- **FR-003**: O sistema MUST aceitar e persistir uma confirmação de presença sem qualquer informação de idade de adultos.
- **FR-004**: O sistema MUST exigir a idade de cada criança adicionada e impedir o envio quando a idade de alguma criança não for informada, com mensagem orientativa.
- **FR-005**: O painel administrativo MUST exibir corretamente as confirmações sob o novo formato (adultos sem idade, crianças com idade), incluindo confirmações antigas, sem erros.

#### Mural de Recados (persistência)

- **FR-006**: O sistema MUST persistir cada recado enviado (nome do autor, mensagem e data/hora) de forma durável no banco de dados.
- **FR-007**: O mural MUST carregar e exibir os recados persistidos sempre que a página for acessada, de modo que permaneçam visíveis após recarregar a página ou em outros dispositivos.
- **FR-008**: O sistema MUST exigir nome e mensagem preenchidos para salvar um recado e rejeitar envios com qualquer um deles vazio.
- **FR-009**: O sistema MUST limitar o tamanho da mensagem do recado a 240 caracteres.
- **FR-010**: O mural MUST apresentar os recados em ordem cronológica consistente (mais recentes primeiro).
- **FR-011**: O sistema MUST exibir confirmação de envio ao convidado quando um recado for salvo com sucesso e mensagem de erro amigável quando o salvamento falhar, preservando o texto digitado para nova tentativa.
- **FR-012**: O sistema MUST exibir um estado vazio convidativo quando não houver recados.
- **FR-013**: A organizadora MUST poder remover um recado inadequado do mural a partir do painel administrativo existente (mesmo login/dashboard), de forma reativa após a publicação.
- **FR-014**: O sistema MUST aplicar rate limiting por dispositivo no envio de recados, limitando a frequência de novos recados a partir do mesmo dispositivo em um intervalo de tempo, para mitigar spam/abuso no mural público.
- **FR-015**: Os recados MUST ser publicados imediatamente após o envio, sem etapa de aprovação prévia.

### Key Entities *(include if feature involves data)*

- **Confirmação de Presença (RSVP)**: representa o grupo confirmado por um convidado. Possui responsável, telefone, indicação de comparecimento, lista de adultos e lista de crianças. Cada **adulto** passa a ter apenas nome. Cada **criança** tem nome e idade.
- **Recado (Mural)**: mensagem deixada por um visitante. Atributos: nome do autor, texto da mensagem (até 240 caracteres) e data/hora de criação. Persistido de forma durável e exibido publicamente no mural.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% das novas confirmações de presença são registradas com sucesso sem nenhum campo de idade de adulto presente no formulário.
- **SC-002**: Em todas as confirmações, a idade é solicitada apenas para crianças, e nenhuma confirmação válida é bloqueada por causa de idade de adulto.
- **SC-003**: 100% dos recados enviados com sucesso continuam visíveis após recarregar a página e ao abrir a página em outro dispositivo.
- **SC-004**: Recados enviados permanecem disponíveis indefinidamente (não se perdem entre sessões ou recarregamentos), eliminando a perda de recados que ocorre hoje.
- **SC-005**: Tentativas de enviar recado ou confirmação com campos obrigatórios vazios são bloqueadas em 100% dos casos, sem gravar dados incompletos.
- **SC-006**: Envios de recados acima do limite por dispositivo são bloqueados em 100% dos casos, sem gravar recados em excesso, e a organizadora consegue remover qualquer recado pelo painel administrativo.

## Assumptions

- A página de "confirmação de presença" referida é a seção de RSVP da página pública do convite (mesmo formulário onde hoje se adicionam adultos e crianças).
- Os recados são públicos e ficam visíveis imediatamente após o envio, sem fluxo de aprovação prévia (confirmado em clarificação).
- A moderação se dá de forma reativa: a organizadora remove recados inadequados após publicados, pelo painel administrativo existente, em vez de aprová-los antes.
- A proteção anti-spam combina validação básica (campos obrigatórios, limite de 240 caracteres, sem duplicação por clique) com rate limiting por dispositivo; os parâmetros exatos do limite (quantidade/intervalo) serão definidos na fase de planejamento.
- Confirmações de presença antigas que eventualmente contenham idade de adultos são apenas exibidas/ignoradas; não há migração obrigatória desses dados nesta feature.
- O limite de 240 caracteres para a mensagem do recado é mantido conforme já indicado na interface atual.
- O banco de dados e a infraestrutura de persistência já existentes do projeto serão reutilizados para armazenar os recados.
- A identidade do autor do recado é informada livremente pelo próprio visitante (não há autenticação de convidados).
