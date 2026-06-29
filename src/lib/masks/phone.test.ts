import { describe, expect, it } from 'vitest';

import { isValidBrazilianPhone, maskPhone, phoneSchema, unmaskPhone } from './phone';

describe('unmaskPhone', () => {
  it('mantém apenas dígitos e limita a 11', () => {
    expect(unmaskPhone('(21) 99999-0000')).toBe('21999990000');
    expect(unmaskPhone('21 9 9999 0000 99')).toBe('21999990000');
  });
});

describe('maskPhone', () => {
  it('formata celular com 11 dígitos', () => {
    expect(maskPhone('21999990000')).toBe('(21) 99999-0000');
  });

  it('formata fixo com 10 dígitos', () => {
    expect(maskPhone('2133334444')).toBe('(21) 3333-4444');
  });

  it('formata progressivamente enquanto digita', () => {
    expect(maskPhone('')).toBe('');
    expect(maskPhone('2')).toBe('(2');
    expect(maskPhone('21')).toBe('(21');
    expect(maskPhone('219')).toBe('(21) 9');
    expect(maskPhone('219999')).toBe('(21) 9999');
    expect(maskPhone('2199990')).toBe('(21) 9999-0');
  });

  it('ignora caracteres não numéricos digitados', () => {
    expect(maskPhone('abc21def99999ghi0000')).toBe('(21) 99999-0000');
  });
});

describe('isValidBrazilianPhone', () => {
  it('aceita 10 e 11 dígitos', () => {
    expect(isValidBrazilianPhone('(21) 99999-0000')).toBe(true);
    expect(isValidBrazilianPhone('(21) 3333-4444')).toBe(true);
  });

  it('rejeita telefones incompletos ou vazios', () => {
    expect(isValidBrazilianPhone('')).toBe(false);
    expect(isValidBrazilianPhone('(21) 9999')).toBe(false);
    expect(isValidBrazilianPhone('219')).toBe(false);
  });
});

describe('phoneSchema', () => {
  it('valida telefone com DDD', () => {
    expect(phoneSchema.safeParse('(21) 99999-0000').success).toBe(true);
  });

  it('rejeita telefone sem DDD ou incompleto', () => {
    expect(phoneSchema.safeParse('99999-0000').success).toBe(false);
    expect(phoneSchema.safeParse('').success).toBe(false);
  });
});
