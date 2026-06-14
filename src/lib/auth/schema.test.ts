import { describe, expect, it } from 'vitest';

import { loginSchema } from './schema';

describe('loginSchema', () => {
  it('aceita e-mail e senha válidos', () => {
    const result = loginSchema.parse({
      email: 'admin@example.com',
      password: '12345678',
    });

    expect(result.email).toBe('admin@example.com');
  });

  it('rejeita e-mail inválido', () => {
    const result = loginSchema.safeParse({
      email: 'admin',
      password: '12345678',
    });

    expect(result.success).toBe(false);
  });
});
