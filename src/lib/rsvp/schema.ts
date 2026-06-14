import { z } from 'zod';

export const rsvpGuestSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome completo.'),
  age: z.coerce.number().int().min(0, 'Informe a idade.').max(120, 'Idade inválida.'),
});

export const rsvpInputSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo.'),
  phone: z.string().trim().min(1, 'Preencha seu telefone.'),
  attendance: z.enum(['sim', 'nao']).default('sim'),
  adults: z.array(rsvpGuestSchema).min(1, 'Informe o nome completo e a idade de cada adulto.'),
  children: z.array(rsvpGuestSchema).default([]),
});

export type RsvpGuestInput = z.infer<typeof rsvpGuestSchema>;
export type RsvpInput = z.infer<typeof rsvpInputSchema>;
