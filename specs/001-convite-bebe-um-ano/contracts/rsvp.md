# Contrato de UI: RSVP

## Entrada

- nome: texto obrigatório
- telefone: texto obrigatório
- presença: sim/não obrigatório
- adultos: número
- crianças: número
- mensagem: texto opcional

## Saída esperada

- Se inválido: mensagem amigável de erro.
- Se válido: cartão de confirmação com resumo da presença.

## Pix

- Botão copiar chave Pix deve gravar o texto no clipboard quando disponível.
- Deve mostrar fallback visual de chave copiada mesmo se clipboard não estiver disponível.
