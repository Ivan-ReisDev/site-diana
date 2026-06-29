import { describe, expect, it } from 'vitest';

import { rsvpAdultSchema, rsvpChildSchema, rsvpInputSchema } from './schema';

describe('rsvpAdultSchema', () => {
  it('aceita adulto apenas com nome', () => {
    const result = rsvpAdultSchema.parse({ name: 'João Reis' });

    expect(result).toEqual({ name: 'João Reis' });
  });

  it('rejeita adulto sem nome', () => {
    const result = rsvpAdultSchema.safeParse({ name: '' });

    expect(result.success).toBe(false);
  });
});

describe('rsvpChildSchema', () => {
  it('aceita criança com nome e idade', () => {
    const result = rsvpChildSchema.parse({ name: 'Lia Reis', age: '7' });

    expect(result).toEqual({ name: 'Lia Reis', age: 7 });
  });

  it('rejeita criança sem idade', () => {
    const result = rsvpChildSchema.safeParse({ name: 'Lia Reis' });

    expect(result.success).toBe(false);
  });

  it('rejeita idade negativa de criança', () => {
    const result = rsvpChildSchema.safeParse({ name: 'Lia Reis', age: -1 });

    expect(result.success).toBe(false);
  });

  it('rejeita idade acima de 120', () => {
    const result = rsvpChildSchema.safeParse({ name: 'Lia Reis', age: 200 });

    expect(result.success).toBe(false);
  });
});

describe('rsvpInputSchema', () => {
  it('aceita payload válido com adultos apenas com nome e crianças com idade', () => {
    const result = rsvpInputSchema.parse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: 'João Reis' }, { name: 'Ana Reis' }],
      children: [{ name: 'Lia Reis', age: '7' }],
    });

    expect(result.name).toBe('João Reis');
    expect(result.adults).toEqual([{ name: 'João Reis' }, { name: 'Ana Reis' }]);
    expect(result.children).toEqual([{ name: 'Lia Reis', age: 7 }]);
    expect(result.attendance).toBe('sim');
  });

  it('aceita payload sem crianças', () => {
    const result = rsvpInputSchema.parse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: 'João Reis' }],
    });

    expect(result.children).toEqual([]);
  });

  it('rejeita quando não há adultos informados', () => {
    const result = rsvpInputSchema.safeParse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [],
    });

    expect(result.success).toBe(false);
  });

  it('rejeita quando adulto não tem nome', () => {
    const result = rsvpInputSchema.safeParse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: '' }],
    });

    expect(result.success).toBe(false);
  });

  it('rejeita criança sem idade', () => {
    const result = rsvpInputSchema.safeParse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: 'João Reis' }],
      children: [{ name: 'Lia Reis' }],
    });

    expect(result.success).toBe(false);
  });

  it('ignora idade eventualmente enviada para adulto (não persiste no schema)', () => {
    const result = rsvpInputSchema.parse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: 'João Reis', age: 32 }],
    });

    expect(result.adults).toEqual([{ name: 'João Reis' }]);
  });
})
