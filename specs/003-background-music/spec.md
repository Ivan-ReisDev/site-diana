# Feature Specification: Música de fundo no convite

**Feature Branch**: `003-background-music`

**Created**: 2026-06-28

**Status**: Draft

**Input**: User description: "Temos a música `public/A Dream Is a Wish Your Heart Makes.mp3.mpeg`. Preciso colocá-la tocando de fundo no site em uma altura agradável. A ideia é que ela dispare quando o usuário entrar no site — pelo movimento, clique ou algo do tipo — funcionando inclusive em navegadores que bloqueiam autoplay e em dispositivos móveis."

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Música começa ao interagir com o convite (Priority: P1)

Um convidado abre a página do convite da Diana. A trilha sonora ("A Dream Is a Wish Your Heart Makes") ainda não toca, porque o navegador exige uma interação antes de liberar áudio. Assim que o convidado faz qualquer gesto natural na página — rolar, tocar na tela, clicar ou pressionar uma tecla —, a música começa automaticamente, em um volume baixo e agradável, criando o clima da festa.

**Why this priority**: É o coração da funcionalidade. Sem o disparo da música a partir de uma interação, nada do restante tem valor. Entrega o objetivo central (ambiente sonoro encantado) de forma confiável em qualquer navegador.

**Independent Test**: Abrir a página em um navegador desktop e em um celular, realizar um único gesto (rolagem ou toque) e confirmar que a música começa a tocar em volume baixo, sem erros no console e sem exigir botão dedicado.

**Acceptance Scenarios**:

1. **Given** o convidado acabou de abrir a página e nenhuma interação ocorreu, **When** a página termina de carregar, **Then** a música permanece em silêncio e o site não exibe erro de áudio bloqueado.
2. **Given** a página está carregada e em silêncio, **When** o convidado faz o primeiro gesto na página (rolar, clicar, tocar ou pressionar tecla), **Then** a música começa a tocar do início em volume baixo e agradável.
3. **Given** a música já começou após o primeiro gesto, **When** o convidado continua interagindo com a página, **Then** a música continua tocando normalmente, sem reiniciar a cada interação.
4. **Given** a música chegou ao fim, **When** não há comando para parar, **Then** ela recomeça em laço (loop) mantendo o clima.

---

### User Story 2 - Convidado controla a música (ligar/desligar) (Priority: P1)

Em alguns contextos o convidado não quer som (está no trabalho, em local silencioso, ou simplesmente prefere navegar sem áudio). Ele precisa de um controle visível e óbvio para pausar/retomar (ou silenciar) a música a qualquer momento, sem precisar procurar.

**Why this priority**: Áudio que toca sozinho sem uma forma fácil de desligar gera frustração e abandono da página. Um controle claro é requisito de boa experiência e de respeito ao usuário — por isso também é P1, acompanhando a US1.

**Independent Test**: Com a música tocando, localizar o controle na tela, acioná-lo para pausar (música para imediatamente), acioná-lo de novo para retomar (música volta a tocar). Verificável de forma independente em desktop e mobile.

**Acceptance Scenarios**:

1. **Given** a música está tocando, **When** o convidado aciona o controle de áudio, **Then** a música é pausada/silenciada imediatamente e o controle indica visualmente o estado "desligado".
2. **Given** a música está pausada/silenciada pelo controle, **When** o convidado aciona o controle novamente, **Then** a música retoma a reprodução e o controle indica o estado "ligado".
3. **Given** o convidado desligou a música manualmente, **When** ele realiza novos gestos na página (rolar, clicar), **Then** a música permanece desligada (a escolha do usuário prevalece sobre o disparo automático).
4. **Given** o controle de áudio está na tela, **When** a página é vista em um celular, **Then** o controle é grande o suficiente para toque confortável e não cobre conteúdo essencial.

---

### User Story 3 - Preferência de áudio é lembrada na navegação (Priority: P3)

Se o convidado desligar a música e recarregar a página durante a visita, a página respeita a escolha dele e não volta a tocar sozinha.

**Why this priority**: Refinamento de experiência. Agrega polimento e evita irritação em revisitas, mas o convite cumpre seu propósito sem isso. Por isso fica como P3.

**Independent Test**: Desligar a música, recarregar a página, fazer um gesto e confirmar que a música continua desligada respeitando a preferência anterior.

**Acceptance Scenarios**:

1. **Given** o convidado desligou a música, **When** ele recarrega a página e faz um gesto, **Then** a música permanece desligada respeitando a preferência salva.
2. **Given** o convidado nunca alterou o controle, **When** ele faz o primeiro gesto, **Then** a música toca normalmente (comportamento padrão de "ligado").

---

### Edge Cases

- **Autoplay bloqueado pelo navegador**: a reprodução nunca é tentada antes de um gesto do usuário; portanto, o navegador não bloqueia nem registra erro. O som só inicia após a primeira interação válida.
- **Usuário com som mudo no aparelho ou volume do sistema zerado**: a página executa a reprodução corretamente; a ausência de som é responsabilidade do dispositivo, não um erro do site.
- **Aba em segundo plano / usuário troca de aba**: a música pode continuar tocando ou pausar conforme o comportamento padrão do navegador; ao retornar, o estado deve permanecer coerente com a última escolha do usuário.
- **Conexão lenta**: enquanto o arquivo de áudio carrega, a página continua utilizável; a música começa assim que o áudio estiver pronto após o gesto.
- **Acessibilidade / preferência por menos estímulo**: o convidado pode desligar o áudio de forma imediata pelo controle visível; nenhuma ação obrigatória é exigida para usar o site.
- **Páginas administrativas (painel/login)**: a música de fundo não toca nessas áreas — restringe-se à página pública do convite.
- **Múltiplos gestos rápidos antes do áudio carregar**: a música não deve iniciar várias instâncias simultâneas nem reiniciar a cada gesto.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: O site MUST disponibilizar a faixa "A Dream Is a Wish Your Heart Makes" como trilha sonora de fundo da página pública do convite.
- **FR-002**: O site MUST iniciar a reprodução da música apenas após o primeiro gesto do usuário na página (rolagem, clique, toque na tela ou pressionar de tecla), e não antes — garantindo compatibilidade com navegadores que bloqueiam autoplay.
- **FR-003**: O site MUST reproduzir a música em um volume baixo e agradável por padrão, adequado para fundo, sem dominar a navegação.
- **FR-004**: O site MUST repetir a música em laço (loop) enquanto a reprodução estiver ativa.
- **FR-005**: O site MUST garantir que a música inicie apenas uma vez por sessão de reprodução, sem reiniciar nem criar reproduções simultâneas a cada novo gesto.
- **FR-006**: O site MUST exibir um controle de áudio visível e identificável que permita ao usuário ligar/desligar (ou pausar/retomar) a música a qualquer momento.
- **FR-007**: O controle de áudio MUST indicar visualmente o estado atual (tocando vs. desligado).
- **FR-008**: O site MUST priorizar a escolha manual do usuário: uma vez que ele desligue a música, novos gestos NÃO devem reativá-la automaticamente.
- **FR-009**: O site MUST funcionar de forma equivalente em navegadores de desktop e em dispositivos móveis (incluindo o disparo por toque), com o controle dimensionado para uso por toque.
- **FR-010**: O site MUST limitar a reprodução da música à página pública do convite, não reproduzindo nas áreas administrativas (painel e login).
- **FR-011**: O site SHOULD lembrar a preferência de áudio do usuário ao recarregar a página durante a mesma visita, evitando reativar o som contra a vontade dele.
- **FR-012**: O site MUST degradar graciosamente caso o áudio não possa ser reproduzido (ex.: formato não suportado), sem quebrar a página nem exibir mensagens de erro ao usuário.

### Key Entities *(include if feature involves data)*

- **Faixa de trilha sonora**: o arquivo de áudio do convite ("A Dream Is a Wish Your Heart Makes"), reproduzido em laço como fundo.
- **Preferência de áudio do usuário**: estado de "ligado/desligado" escolhido pelo convidado, usado para respeitar a decisão dele durante a visita.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: Em 100% das visitas, a música não tenta tocar antes de um gesto do usuário, eliminando erros de "autoplay bloqueado".
- **SC-002**: Após o primeiro gesto do usuário, a música começa a tocar em até 1 segundo (com o áudio já carregado) em navegadores de desktop e mobile mais usados.
- **SC-003**: O usuário consegue localizar e acionar o controle de ligar/desligar a música em menos de 5 segundos, sem instruções.
- **SC-004**: Em 100% dos casos, acionar o controle para desligar interrompe o som imediatamente (percepção instantânea pelo usuário).
- **SC-005**: Depois que o usuário desliga a música, ela permanece desligada em 100% das interações subsequentes da mesma visita.
- **SC-006**: A funcionalidade opera corretamente (disparo por toque + controle utilizável) em pelo menos os navegadores móveis padrão de iOS e Android.

## Assumptions

- O volume "agradável" padrão equivale a um nível baixo de fundo (aproximadamente 30% do volume máximo), ajustável durante a implementação por percepção.
- "Dispara quando o usuário entrar no site" é interpretado como iniciar no primeiro gesto do usuário (rolagem, clique, toque ou tecla), pois navegadores modernos não permitem áudio com som antes de uma interação.
- A música deve ficar restrita à página pública do convite; as áreas de painel e login não tocam áudio.
- O comportamento padrão (antes de qualquer escolha do usuário) é "ligado" — a intenção declarada é que a música toque.
- A preferência de áudio é lembrada ao menos durante a visita atual (incluindo recarregamentos da página).
- O arquivo de áudio existente em `public/` é a fonte da trilha; eventual renomeação/otimização do arquivo é detalhe de implementação e não altera o escopo desta especificação.
- A reprodução em laço é desejada para manter o clima durante toda a permanência na página.
