# Especificação: Site convite de aniversário de 1 ano

**Feature Directory**: `specs/001-convite-bebe-um-ano`  
**Criado em**: 2026-06-07  
**Status**: pronto para planejamento

## Descrição

Criar um site convite moderno, inspirado na experiência de sites como Casar.com, para o aniversário de 1 ano de uma menina. O site deve funcionar como convite digital, centralizar informações do evento, permitir confirmação de presença e oferecer uma área de presentes via Pix.

## Usuários e objetivos

- **Família anfitriã**: compartilhar um convite bonito, memorável e prático.
- **Convidados**: entender data/local, confirmar presença rapidamente e enviar presente via Pix se desejarem.

## User Stories & Testing

### US1 — Ver convite e informações principais (P1)

Como convidado, quero abrir o site e entender rapidamente quem está aniversariando, quando será a festa e qual é o clima do evento, para decidir minha presença.

**Critério independente**: Ao abrir a página, o convidado vê nome da criança, idade, data, horário, local, tema visual infantil, CTA de RSVP e CTA de presentes.

### US2 — Confirmar presença (P1)

Como convidado, quero preencher uma confirmação de presença simples, para avisar a família se eu e meus acompanhantes iremos.

**Critério independente**: O formulário coleta nome, telefone, quantidade de adultos/crianças e mensagem opcional, com feedback de confirmação.

### US3 — Presentear via Pix (P1)

Como convidado, quero visualizar uma área de presentes com Pix, para contribuir de forma rápida sem lista complexa.

**Critério independente**: O site apresenta instruções de Pix, chave placeholder, botão de copiar e sugestões de valores.

### US4 — Navegar em celular (P2)

Como convidado usando celular, quero que o site seja bonito e legível, para acessar o convite pelo WhatsApp sem esforço.

**Critério independente**: Todas as seções são responsivas e os CTAs permanecem fáceis de tocar.

## Requisitos funcionais

- **FR-001**: O site deve apresentar seção hero com identidade visual de bebê menina de 1 ano.
- **FR-002**: O site deve exibir data, horário, local e chamada para confirmação de presença.
- **FR-003**: O site deve conter formulário RSVP com nome, telefone, adultos, crianças, presença e mensagem.
- **FR-004**: O RSVP deve validar campos obrigatórios e exibir feedback amigável após envio.
- **FR-005**: O site deve conter seção de presentes via Pix com chave placeholder e botão de copiar.
- **FR-006**: O site deve oferecer sugestões de valores de presente sem forçar pagamento.
- **FR-007**: O layout deve ser responsivo para desktop e mobile.
- **FR-008**: O site deve usar imagens decorativas externas adequadas ao tema infantil, sem depender de imagens sensíveis pessoais.
- **FR-009**: O site deve ter metadados de convite para compartilhamento.
- **FR-010**: O site deve evitar exposição de dados reais de Pix, endereço ou telefone; usar placeholders editáveis.

## Requisitos não funcionais

- Carregamento percebido rápido em conexão comum de celular.
- Acessível com labels, contraste suficiente e botões claros.
- Visual moderno, delicado, com paleta rosa bebê, creme, lavanda e dourado suave.

## Entidades principais

- **Evento**: nome da criança, idade, data, hora, local, mensagem.
- **RSVP**: nome, telefone, presença, adultos, crianças, mensagem.
- **Presente Pix**: chave, instruções, valores sugeridos.

## Assumptions

- Nome provisório da criança: **Diana**.
- Pix será placeholder: `pix-da-familia@exemplo.com`.
- Local e data serão placeholders editáveis.
- RSVP será demonstrativo local no navegador, sem backend persistente neste protótipo.

## Critérios de sucesso

- Convidado identifica a proposta do convite em menos de 10 segundos.
- RSVP pode ser concluído em menos de 1 minuto.
- Pix pode ser copiado com um clique/toque.
- Página fica visualmente adequada em desktop e mobile.
- Build de produção executa sem erro.
