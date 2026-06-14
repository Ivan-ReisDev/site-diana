import { describe, expect, it } from 'vitest';

import { normalizePhone } from './phone';

describe('normalizePhone', () => {
  it('normaliza telefone brasileiro para apenas dígitos', () => {
    expect(normalizePhone('(21) 99999-0000')).toBe('21999990000');
  });

  it('remove símbolos extras e espaços', () => {
    expect(normalizePhone('+55 (21) 99999-0000')).toBe('5521999990000');
  });

  it('lança erro para telefone inválido', () => {
    expect(() => normalizePhone('123')).toThrow(/telefone/i);
  });
});
