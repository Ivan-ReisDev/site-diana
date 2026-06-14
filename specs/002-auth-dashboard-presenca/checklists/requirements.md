# Checklist de qualidade dos requisitos

## Clareza

- [x] Requisitos descrevem comportamento observável pelo usuário.
- [x] Escopo principal está separado de itens fora de escopo.
- [x] Dashboard, login e RSVP persistente têm critérios independentes.
- [x] Dados sensíveis e privacidade foram considerados.

## Testabilidade

- [x] RSVP pode ser testado por envio e consulta no banco/dashboard.
- [x] Autenticação pode ser testada com credenciais válidas/inválidas.
- [x] Proteção da dashboard pode ser testada por acesso com e sem sessão.
- [x] Métricas podem ser testadas com registros seedados.

## Ambiguidades restantes

- [ ] Definir se admin inicial será seed via env ou tela de setup.
- [ ] Definir se reenvio de RSVP atualiza ou mantém histórico. Assumido: atualiza por telefone.
- [ ] Definir necessidade de exportação CSV na primeira versão. Assumido: fora do MVP.
- [ ] Definir política de mascaramento de telefone. Assumido: telefone completo na dashboard privada.

## Pronto para planejamento técnico?

Sim, com as assumptions documentadas. As perguntas abertas podem ser ajustadas antes da implementação se o usuário preferir outro comportamento.
