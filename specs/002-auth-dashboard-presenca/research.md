# Research: Autenticação e dashboard de presença

## Decisões propostas

### Persistência

- Usar banco relacional para RSVPs, administradores e sessões.
- Telefone normalizado será usado para evitar duplicidade acidental.
- Um RSVP representa um grupo/família convidada, com contagem de adultos e crianças.

**Rationale**: RSVP é dado estruturado, consultado por dashboard e agregado por totais. Banco relacional simplifica filtros, somatórios e integridade.

### Autenticação administrativa

- Área administrativa protegida por login com e-mail e senha.
- Convidados continuam sem conta.
- Senha armazenada somente como hash.
- Sessão por cookie HttpOnly com expiração e token persistido no banco.

**Rationale**: reduz dependências de provedores externos e atende ao caso de uso simples de uma família/administrador.

### Atualização de RSVP

- Regra inicial: novo envio com mesmo telefone normalizado atualiza o RSVP existente.
- `updatedAt` registra alteração.
- A dashboard pode exibir a última versão consolidada.

**Rationale**: evita duplicar contagens quando a mesma família altera presença.

### Dashboard

- Rota privada: `/dashboard`.
- Login: `/login`.
- API/Server Actions privadas devem validar sessão no servidor.
- Métricas calculadas no servidor: confirmados, não irão, adultos, crianças, total.

**Rationale**: dashboard deve ser simples, rápida e segura, sem expor dados no bundle público.

## Alternativas consideradas

### Autenticação por provedor externo

Ex.: Google OAuth.  
**Motivo para não priorizar agora**: aumenta setup e depende de credenciais externas; e-mail/senha atende o escopo inicial.

### RSVP sem telefone único

**Motivo para não priorizar agora**: facilita duplicidade e distorce contagens.

### Persistir também mural e presentes nesta fase

**Motivo para adiar**: requisito principal é lista de presença. Persistir tudo junto aumenta escopo e risco sem necessidade imediata.

## Perguntas abertas

1. O admin inicial será criado por seed via variáveis de ambiente ou por tela interna de setup?
2. Ao reenviar RSVP com mesmo telefone, deve atualizar silenciosamente ou registrar histórico?
3. A dashboard precisa exportar CSV já na primeira versão?
4. Telefone deve ser exibido completo na dashboard ou mascarado parcialmente?
5. Existe domínio/produção já definido para configurar cookies seguros?
