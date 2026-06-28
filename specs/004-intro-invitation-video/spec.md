# Feature Specification: Tela de Abertura com Convocação Real e Vídeo

**Feature Branch**: `004-intro-invitation-video`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Quando a pessoa abrir o site ela vai ver uma tela que sobrepõe tudo do tamanho da tela do usuário e vai ter algo escrito (Convocação Real... Mamãe e Papai têm a honra de convidar você para celebrar o 1º aniversário da nossa Princesa) e um botão bonito de princesa. Quando o usuário clicar no botão vai abrir uma animação que mostra o vídeo em um fundo preto e no centro. No final do vídeo, após ele acabar, vai aparecer o convite (Convocação Real) e o botão Confirmar Presença, que leva o usuário para a home do site."

## Clarifications

### Session 2026-06-28

- Q: A tela de abertura deve aparecer a cada visita ou só na primeira vez? → A: A cada visita ao site (sem persistir "já visto").
- Q: O que faz o botão "Confirmar Presença" ao fim do vídeo? → A: Apenas encerra a abertura e exibe a home; o convidado acessa o RSVP (feature 002) navegando depois.
- Q: Como a música de fundo (feature 003) se comporta durante a abertura e o vídeo? → A: Fica em silêncio/pausada durante toda a abertura e o vídeo; (re)inicia somente ao entrar na home.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Receber a Convocação Real ao abrir o convite (Priority: P1)

Ao acessar o site, o convidado é recebido por uma tela que cobre toda a área visível do dispositivo, exibindo a mensagem da "Convocação Real" ("Mamãe e Papai têm a honra de convidar você para celebrar o 1º aniversário da nossa Princesa") em um visual delicado de princesa, com um único botão de destaque que convida a pessoa a iniciar a experiência.

**Why this priority**: É o primeiro contato do convidado com o convite e estabelece o tom emocional do evento. Sem essa tela de abertura, a funcionalidade não existe. É a fatia mínima que entrega valor (um convite encantador) por si só.

**Independent Test**: Abrir o site em qualquer dispositivo e confirmar que a tela de abertura cobre 100% da tela, mostra o texto da convocação e o botão de princesa, impedindo a visualização da home por baixo.

**Acceptance Scenarios**:

1. **Given** um convidado abre o site pela primeira vez, **When** a página termina de carregar, **Then** uma tela de abertura sobrepõe completamente o conteúdo do site, exibindo a mensagem da Convocação Real e um botão de destaque.
2. **Given** a tela de abertura está visível, **When** o convidado tenta rolar ou interagir com o conteúdo de fundo, **Then** o conteúdo da home permanece inacessível até a experiência ser concluída.
3. **Given** a tela de abertura é exibida em telas de tamanhos diferentes (celular, tablet, desktop), **When** o convidado visualiza, **Then** o texto e o botão permanecem legíveis, centralizados e proporcionais à tela.

---

### User Story 2 - Assistir ao vídeo do convite (Priority: P2)

Ao tocar no botão de princesa, o convidado vê uma transição animada que abre o vídeo do convite, reproduzido no centro da tela sobre um fundo totalmente preto, criando um momento de imersão "como no cinema".

**Why this priority**: É o coração emocional da experiência e o motivo central pelo qual o convite foi pensado. Depende da tela de abertura (P1) já existir para ser acionado.

**Independent Test**: A partir da tela de abertura, clicar no botão e confirmar que ocorre uma animação de transição, o fundo fica preto e o vídeo é reproduzido centralizado, iniciando automaticamente.

**Acceptance Scenarios**:

1. **Given** a tela de abertura está visível, **When** o convidado clica/toca no botão de princesa, **Then** uma animação de transição leva a um fundo preto com o vídeo do convite centralizado, que inicia a reprodução.
2. **Given** o vídeo está sendo reproduzido, **When** o convidado visualiza em qualquer dispositivo, **Then** o vídeo aparece centralizado, sem cortes que prejudiquem o conteúdo e sem elementos do site visíveis ao redor.
3. **Given** o vídeo está em reprodução, **When** o convidado deseja avançar, **Then** existe uma forma clara de pular/avançar o vídeo para o próximo passo.
4. **Given** o navegador bloqueia reprodução automática com som, **When** o vídeo é aberto, **Then** o convidado consegue iniciar/ativar o som por meio de uma ação visível.

---

### User Story 3 - Confirmar presença e entrar na home (Priority: P3)

Quando o vídeo termina (ou é pulado), aparece a mensagem final da Convocação Real junto a um botão "Confirmar Presença". Ao acioná-lo, o convidado é levado para a home do site para explorar os detalhes do evento.

**Why this priority**: Fecha a jornada conduzindo o convidado da experiência de abertura para o conteúdo principal do site. Depende dos passos anteriores.

**Independent Test**: Aguardar o vídeo terminar (ou pulá-lo) e confirmar que surgem a mensagem da Convocação Real e o botão "Confirmar Presença", e que clicá-lo revela a home do site.

**Acceptance Scenarios**:

1. **Given** o vídeo chegou ao fim, **When** a reprodução termina, **Then** a mensagem da Convocação Real e o botão "Confirmar Presença" aparecem sobre o fundo.
2. **Given** a mensagem final e o botão "Confirmar Presença" estão visíveis, **When** o convidado clica no botão, **Then** a tela de abertura é encerrada e a home do site é exibida e acessível.
3. **Given** o convidado pulou o vídeo, **When** ele avança, **Then** ele também chega à etapa final com o botão "Confirmar Presença".

---

### Edge Cases

- **Vídeo não carrega ou falha**: O convidado deve conseguir chegar à etapa final e entrar na home mesmo que o vídeo não reproduza (botão de avançar/entrar disponível).
- **Conexão lenta**: Deve haver indicação de carregamento enquanto o vídeo é preparado, evitando uma tela preta sem feedback.
- **Convidado que retorna**: Definir se a tela de abertura aparece a cada visita ou apenas na primeira (ver Assumptions).
- **Música de fundo do site (feature 003)**: Coordenar para que o áudio do vídeo não conflite com a música de fundo existente (ver Assumptions).
- **Acessibilidade de movimento**: Convidados com preferência por "reduzir movimento" devem ter a transição animada suavizada/simplificada.
- **Orientação de tela**: O vídeo e os textos devem permanecer apresentáveis em retrato e paisagem.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O sistema MUST exibir, ao abrir o site, uma tela de abertura que sobreponha completamente toda a área visível do dispositivo, ocultando o conteúdo da home.
- **FR-002**: A tela de abertura MUST exibir a mensagem da Convocação Real ("Mamãe e Papai têm a honra de convidar você para celebrar o 1º aniversário da nossa Princesa") com estética de princesa coerente com a identidade do convite.
- **FR-003**: A tela de abertura MUST apresentar um único botão de destaque, visualmente encantador ("de princesa"), como chamada para iniciar a experiência.
- **FR-004**: O sistema MUST impedir o acesso e a rolagem do conteúdo da home enquanto a tela de abertura estiver ativa.
- **FR-005**: Ao acionar o botão de início, o sistema MUST executar uma transição animada que conduza à etapa de reprodução do vídeo.
- **FR-006**: O sistema MUST reproduzir o vídeo do convite centralizado sobre um fundo totalmente preto, sem elementos do site visíveis ao redor.
- **FR-007**: O vídeo MUST iniciar a reprodução automaticamente ao abrir a etapa de vídeo, com mecanismo para ativar o som caso o navegador bloqueie áudio automático.
- **FR-008**: O sistema MUST oferecer uma forma clara de pular/avançar o vídeo antes do seu término.
- **FR-009**: Ao término (ou ao pular) do vídeo, o sistema MUST exibir a mensagem final da Convocação Real e um botão "Confirmar Presença".
- **FR-010**: Ao acionar "Confirmar Presença", o sistema MUST encerrar a tela de abertura e exibir a home do site, tornando-a totalmente acessível.
- **FR-011**: O sistema MUST garantir que o convidado consiga chegar à home mesmo se o vídeo falhar ao carregar ou reproduzir.
- **FR-012**: A tela de abertura, o vídeo e os botões MUST ser responsivos e legíveis em celular, tablet e desktop, em retrato e paisagem.
- **FR-013**: O sistema MUST respeitar a preferência de "reduzir movimento" do dispositivo, simplificando as animações quando solicitado.
- **FR-014**: O sistema MUST manter a música de fundo existente (feature `003-background-music`) em silêncio/pausada durante toda a tela de abertura e a reprodução do vídeo, iniciando-a (ou retomando-a) somente quando a home for exibida.

### Key Entities

- **Tela de Abertura (Convocação Real)**: Estado inicial sobreposto ao site; contém a mensagem do convite e o botão de início. Atributos: mensagem, visual de princesa, estado (visível/encerrada).
- **Experiência de Vídeo**: Etapa de reprodução do vídeo do convite em fundo preto. Atributos: fonte do vídeo, estado de reprodução (carregando/reproduzindo/concluído/pulado), controle de som, controle de pular.
- **Etapa Final / Confirmação**: Mensagem da Convocação Real com o botão "Confirmar Presença" que conduz à home.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: 100% dos acessos exibem a tela de abertura cobrindo toda a tela antes de qualquer conteúdo da home ficar acessível.
- **SC-002**: Em pelo menos 95% dos acessos com conexão típica, o convidado consegue iniciar o vídeo em até 3 segundos após tocar no botão de princesa.
- **SC-003**: O convidado consegue percorrer toda a jornada (abertura → vídeo → confirmar presença → home) em menos de 1 minuto, sem ajuda externa.
- **SC-004**: 100% dos convidados conseguem chegar à home mesmo quando o vídeo não carrega ou é pulado.
- **SC-005**: A tela de abertura, o vídeo e os botões são exibidos de forma legível e proporcional em telas de 320px a 1920px de largura, em retrato e paisagem.
- **SC-006**: Nenhum acesso resulta em sobreposição conflitante entre o áudio do vídeo e a música de fundo do site.

## Assumptions

- A tela de abertura é exibida **a cada visita** ao site (não há persistência de "já visto"), pois o convite é a experiência central e curta. Caso seja desejado exibir apenas na primeira visita, isso deve ser ajustado.
- O vídeo a ser reproduzido é o arquivo já disponível em `public/WhatsApp Video 2026-06-28 at 16.16.17.mp4`.
- A música de fundo existente (feature `003-background-music`) é **pausada enquanto o vídeo é reproduzido** e pode retomar/iniciar ao entrar na home, para evitar conflito de áudio.
- O botão "Confirmar Presença" desta tela **leva à home do site**; o fluxo detalhado de registro de presença (RSVP) já é tratado por funcionalidade existente (feature `002-auth-dashboard-presenca`) e está fora do escopo desta abertura.
- A reprodução automática de vídeo com som pode ser bloqueada por navegadores; por isso há um controle visível para ativar o som.
- O conteúdo textual segue o idioma e o tom do convite (português, estética de princesa) já adotados no projeto.
- A experiência é destinada a convidados em geral, sem necessidade de autenticação para visualizar a abertura.
