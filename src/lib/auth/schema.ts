import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().email('Informe um e-mail válido.'),
  password: z.string().min(8, 'Informe sua senha.'),
});

export type LoginInput = z.infer<typeof loginSchema>;
