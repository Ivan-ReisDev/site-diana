import { z } from 'zod';

export const recadoInputSchema = z.object({
  nome: z.string().trim().min(1, 'Informe seu nome.'),
  mensagem: z
    .string()
    .trim()
    .min(1, 'Escreva uma mensagem.')
    .max(240, 'Máximo de 240 caracteres.'),
});

export type RecadoInput = z.infer<typeof recadoInputSchema>;
