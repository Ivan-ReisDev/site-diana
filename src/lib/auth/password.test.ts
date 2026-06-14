import { describe, expect, it } from 'vitest';

import { hashPassword, verifyPassword } from './password';

describe('password helpers', () => {
  it('gera hash e valida a senha correta', async () => {
    const hash = await hashPassword('segredo-forte');

    expect(hash).not.toBe('segredo-forte');
    await expect(verifyPassword('segredo-forte', hash)).resolves.toBe(true);
    await expect(verifyPassword('outra-senha', hash)).resolves.toBe(false);
  });
});
