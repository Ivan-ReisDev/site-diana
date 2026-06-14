# Especificação: Autenticação e dashboard de presença

**Feature Directory**: `specs/002-auth-dashboard-presenca`  
**Criado em**: 2026-06-13  
**Status**: especificado para checklist e planejamento técnico

## Descrição

Adicionar uma área administrativa protegida para a família anfitriã consultar confirmações de presença do convite. O formulário público de RSVP deixa de ser apenas demonstrativo local e passa a registrar respostas de forma persistente. A dashboard deve mostrar quem confirmou presença, quem não poderá comparecer, quantidades de adultos/crianças, mensagens enviadas e informações úteis para organização do evento.

## Usuários e objetivos

- **Família anfitriã / administradores**: acessar com segurança uma área privada para acompanhar a lista de presença, totais e detalhes dos convidados.
- **Convidados**: confirmar presença pelo convite sem precisar criar conta e receber feedback claro de que a resposta foi registrada.
- **Organização do evento**: consolidar números de convidados para planejamento de buffet, espaço, lembrancinhas e comunicação.

## User Stories & Testing

### US1 — Registrar RSVP persistente (P1)

Como convidado, quero enviar minha confirmação de presença e ter certeza de que ela foi registrada, para que a família possa contar comigo na organização.

**Critério independente**: Ao enviar nome, telefone, presença, adultos, crianças e mensagem opcional, o sistema valida os dados, salva o registro e retorna feedback amigável sem perder a experiência visual do convite.

### US2 — Autenticar administrador (P1)

Como administrador, quero entrar em uma área privada com e-mail e senha, para que somente pessoas autorizadas vejam os dados de presença.

**Critério independente**: A rota da dashboard redireciona usuários não autenticados para login, valida credenciais e mantém sessão segura após autenticação bem-sucedida.

### US3 — Visualizar dashboard de presença (P1)

Como administrador, quero ver uma lista com todas as confirmações e indicadores de presença, para acompanhar rapidamente quem vai, quem não vai e quantas pessoas são esperadas.

**Critério independente**: A dashboard exibe cards de resumo, tabela/lista de RSVPs e detalhes por convidado, incluindo nome, telefone, status, adultos, crianças, total do grupo, mensagem e data de envio.

### US4 — Atualizar RSVP existente por telefone (P2)

Como convidado, quero poder reenviar minha confirmação caso tenha errado ou mudado de ideia, para manter a lista final correta.

**Critério independente**: Quando o mesmo telefone enviar novo RSVP, o sistema atualiza o registro existente ou cria uma nova revisão rastreável, conforme regra definida, sem duplicar contagens indevidamente.

### US5 — Navegar bem no celular (P2)

Como administrador usando celular, quero consultar a dashboard com layout responsivo, para verificar a lista de presença mesmo fora do computador.

**Critério independente**: Cards, filtros e lista são legíveis em mobile, com ações tocáveis e sem overflow horizontal.

## Requisitos funcionais

- **FR-001**: O RSVP público deve persistir confirmação de presença em armazenamento durável.
- **FR-002**: O formulário RSVP deve validar nome e telefone como obrigatórios.
- **FR-003**: O formulário RSVP deve validar adultos e crianças como números inteiros não negativos.
- **FR-004**: O sistema deve registrar presença como `sim` ou `nao`.
- **FR-005**: O sistema deve registrar mensagem opcional do convidado quando informada.
- **FR-006**: O sistema deve registrar data/hora de criação e última atualização do RSVP.
- **FR-007**: A dashboard deve ser acessível somente após login administrativo.
- **FR-008**: Usuários não autenticados ao acessar dashboard devem ser redirecionados para login.
- **FR-009**: A dashboard deve listar RSVPs com nome, telefone, presença, adultos, crianças, total, mensagem e data.
- **FR-010**: A dashboard deve exibir totais: grupos confirmados, grupos que não irão, adultos confirmados, crianças confirmadas e total geral confirmado.
- **FR-011**: A dashboard deve permitir filtrar por status de presença (`todos`, `confirmados`, `não irão`).
- **FR-012**: A dashboard deve permitir busca por nome ou telefone.
- **FR-013**: O sistema deve permitir logout administrativo.
- **FR-014**: O login deve usar credenciais administrativas configuráveis, sem expor senha em código-fonte.
- **FR-015**: Erros de envio de RSVP e login devem exibir mensagens amigáveis sem revelar detalhes sensíveis.

## Requisitos não funcionais

- **Privacidade**: dados pessoais de convidados não devem aparecer em páginas públicas, logs desnecessários ou screenshots compartilhados.
- **Segurança**: senhas devem ser armazenadas apenas como hash; sessões devem usar cookie HttpOnly e expiração.
- **Performance**: a dashboard deve carregar rapidamente para dezenas/centenas de confirmações.
- **Acessibilidade**: login, filtros, tabela/lista e formulários devem ter labels e estados de foco claros.
- **Responsividade**: convite e dashboard devem funcionar bem em mobile e desktop.
- **Confiabilidade**: falhas de banco/API não podem apagar estado visual existente sem feedback claro.

## Entidades principais

- **Administrador**: e-mail, nome, senha protegida, datas de criação/atualização.
- **Sessão administrativa**: vínculo com administrador, token protegido, expiração.
- **RSVP**: nome, telefone, presença, adultos, crianças, mensagem, datas de criação/atualização.

## Assumptions

- Haverá inicialmente apenas um ou poucos administradores da família.
- Convidados não precisam criar conta.
- Telefone será tratado como identificador prático para atualizar RSVP e reduzir duplicidade.
- Dashboard ficará em rota privada separada do convite público.
- A primeira entrega prioriza lista de presença; reservas de presentes e mural podem continuar locais ou entrar em persistência em uma fase posterior.

## Fora de escopo nesta fase

- Pagamentos Pix reais ou confirmação automática de pagamento.
- Envio automático de WhatsApp/SMS/e-mail.
- Múltiplos eventos no mesmo sistema.
- Painel avançado de permissões por função.
- Upload de imagens ou gestão completa do conteúdo do convite.

## Critérios de sucesso

- Convidado envia RSVP e o registro aparece na dashboard após login.
- Usuário não autenticado não acessa dados de presença.
- Administrador entende em menos de 10 segundos quantas pessoas confirmaram presença.
- Testes automatizados cobrem validação, persistência, autenticação e proteção da dashboard.
- Build de produção executa sem erro.
