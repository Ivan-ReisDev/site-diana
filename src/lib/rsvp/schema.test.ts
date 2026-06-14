import { describe, expect, it } from 'vitest';

import { rsvpInputSchema } from './schema';

describe('rsvpInputSchema', () => {
  it('aceita payload válido com participantes individuais', () => {
    const result = rsvpInputSchema.parse({
      groupName: 'Família Reis',
      phone: '(21) 99999-0000',
      attendance: 'sim',
      participants: [
        { name: 'João Reis', type: 'adulto', age: '35' },
        { name: 'Lia Reis', type: 'crianca', age: '7' },
      ],
      message: 'Estaremos lá',
    });

    expect(result.groupName).toBe('Família Reis');
    expect(result.participants).toEqual([
      { name: 'João Reis', type: 'adulto', age: 35 },
      { name: 'Lia Reis', type: 'crianca', age: 7 },
    ]);
    expect(result.attendance).toBe('sim');
  });

  it('rejeita quando não há participantes', () => {
    const result = rsvpInputSchema.safeParse({
      phone: '(21) 99999-0000',
      attendance: 'sim',
      participants: [],
    });

    expect(result.success).toBe(false);
  });

  it('rejeita idade negativa', () => {
    const result = rsvpInputSchema.safeParse({
      phone: '(21) 99999-0000',
      attendance: 'sim',
      participants: [{ name: 'João Reis', type: 'adulto', age: -1 }],
    });

    expect(result.success).toBe(false);
  });
})
