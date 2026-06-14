import { describe, expect, it } from 'vitest';

import { rsvpInputSchema } from './schema';

describe('rsvpInputSchema', () => {
  it('aceita payload válido com adultos e crianças', () => {
    const result = rsvpInputSchema.parse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [
        { name: 'João Reis', age: '32' },
        { name: 'Ana Reis', age: '30' },
      ],
      children: [{ name: 'Lia Reis', age: '7' }],
    });

    expect(result.name).toBe('João Reis');
    expect(result.adults).toEqual([
      { name: 'João Reis', age: 32 },
      { name: 'Ana Reis', age: 30 },
    ]);
    expect(result.children).toEqual([{ name: 'Lia Reis', age: 7 }]);
    expect(result.attendance).toBe('sim');
  });

  it('aceita payload sem crianças', () => {
    const result = rsvpInputSchema.parse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: 'João Reis', age: '32' }],
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

  it('rejeita idade negativa de criança', () => {
    const result = rsvpInputSchema.safeParse({
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      adults: [{ name: 'João Reis', age: '32' }],
      children: [{ name: 'Lia Reis', age: -1 }],
    });

    expect(result.success).toBe(false);
  });
})
