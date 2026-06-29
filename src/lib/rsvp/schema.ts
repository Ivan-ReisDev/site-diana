import { z } from 'zod';

import { phoneSchema } from '@/lib/masks/phone';

export const rsvpAdultSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome completo.'),
});

export const rsvpChildSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome completo.'),
  age: z.coerce.number().int().min(0, 'Informe a idade.').max(120, 'Idade inválida.'),
});

export const rsvpInputSchema = z.object({
  name: z.string().trim().min(1, 'Informe seu nome completo.'),
  phone: phoneSchema,
  attendance: z.enum(['sim', 'nao']).default('sim'),
  adults: z.array(rsvpAdultSchema).min(1, 'Informe o nome completo de cada adulto.'),
  children: z.array(rsvpChildSchema).default([]),
});

export type RsvpAdultInput = z.infer<typeof rsvpAdultSchema>;
export type RsvpChildInput = z.infer<typeof rsvpChildSchema>;
export type RsvpInput = z.infer<typeof rsvpInputSchema>;
