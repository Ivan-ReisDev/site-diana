import { z } from 'zod';

export const rsvpParticipantSchema = z.object({
  name: z.string().trim().min(1, 'Informe o nome da pessoa.'),
  type: z.enum(['adulto', 'crianca']),
  age: z.coerce.number().int().min(0, 'Informe a idade.').max(120, 'Idade inválida.'),
});

export const rsvpInputSchema = z.object({
  groupName: z
    .string()
    .trim()
    .max(120, 'Nome da família/grupo muito longo.')
    .optional()
    .transform((value) => value || undefined),
  phone: z.string().trim().min(1, 'Preencha seu telefone.'),
  attendance: z.enum(['sim', 'nao']).default('sim'),
  participants: z.array(rsvpParticipantSchema).min(1, 'Informe pelo menos uma pessoa.'),
  message: z
    .string()
    .trim()
    .max(500, 'Mensagem muito longa.')
    .optional()
    .transform((value) => value || undefined),
});

export type RsvpParticipantInput = z.infer<typeof rsvpParticipantSchema>;
export type RsvpInput = z.infer<typeof rsvpInputSchema>;
