# Data Model: Autenticação e dashboard de presença

## AdminUser

Representa usuário administrativo autorizado a acessar dashboard.

Campos planejados:
- `id`: identificador único.
- `email`: e-mail único, normalizado em lowercase.
- `name`: nome exibido na dashboard.
- `passwordHash`: hash seguro da senha.
- `createdAt`: data de criação.
- `updatedAt`: data de atualização.

Regras:
- `email` deve ser único.
- `passwordHash` nunca deve ser retornado para cliente.

## AdminSession

Representa sessão autenticada persistida no banco.

Campos planejados:
- `id`: identificador único.
- `tokenHash`: hash único do token de sessão.
- `adminUserId`: vínculo com administrador.
- `expiresAt`: data/hora de expiração.
- `createdAt`: data de criação.

Regras:
- Sessões expiradas não autorizam dashboard.
- Logout remove/invalida a sessão atual.
- Cookie deve armazenar token opaco, não dados do usuário.

## Rsvp

Representa confirmação de presença de um grupo/família.

Campos planejados:
- `id`: identificador único.
- `name`: nome do responsável/grupo.
- `phone`: telefone como informado para exibição.
- `phoneNormalized`: telefone normalizado para busca/uniqueness.
- `attendance`: `YES` ou `NO`.
- `adults`: número de adultos.
- `children`: número de crianças.
- `message`: mensagem opcional.
- `createdAt`: data de criação.
- `updatedAt`: data da última alteração.

Regras:
- `name` obrigatório.
- `phone` obrigatório.
- `phoneNormalized` único para evitar duplicidade.
- `adults` e `children` inteiros não negativos.
- Se `attendance = NO`, contagem confirmada deve ser 0 para métricas de presença.

## Métricas derivadas

- `confirmedGroups`: RSVPs com `attendance = YES`.
- `declinedGroups`: RSVPs com `attendance = NO`.
- `confirmedAdults`: soma de adultos dos RSVPs confirmados.
- `confirmedChildren`: soma de crianças dos RSVPs confirmados.
- `confirmedTotal`: adultos + crianças confirmados.
