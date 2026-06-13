# Data Model

## Evento

- `childName`: nome exibido no convite.
- `ageLabel`: idade/celebração.
- `date`: data formatada.
- `time`: horário.
- `venue`: local textual.
- `address`: endereço placeholder.
- `theme`: tema visual.

## RSVP

- `name`: obrigatório.
- `phone`: obrigatório.
- `attendance`: `sim` ou `nao`.
- `adults`: número mínimo 0.
- `children`: número mínimo 0.
- `message`: opcional.

## PixGift

- `pixKey`: placeholder editável.
- `suggestedAmounts`: lista de valores sugeridos.
- `instructions`: texto de apoio para presente.
