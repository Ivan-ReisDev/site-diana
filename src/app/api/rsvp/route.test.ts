import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const upsertRsvp = vi.fn();

vi.mock('@/lib/rsvp/service', () => ({
  upsertRsvp,
}));

describe('POST /api/rsvp', () => {
  beforeEach(() => {
    upsertRsvp.mockReset();
  });

  it('retorna 400 para payload inválido', async () => {
    upsertRsvp.mockRejectedValue(new Error('Informe seu nome completo, telefone e os dados de cada adulto.'));

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/rsvp', {
      method: 'POST',
      body: JSON.stringify({ phone: '' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });

  it('persiste RSVP válido', async () => {
    upsertRsvp.mockResolvedValue({
      name: 'João Reis',
      attendance: 'sim',
      adults: 2,
      children: 1,
      adultsList: [
        { name: 'João Reis', age: 32 },
        { name: 'Ana Reis', age: 30 },
      ],
      childrenList: [{ name: 'Lia Reis', age: 7 }],
    });

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/rsvp', {
      method: 'POST',
      body: JSON.stringify({
        name: 'João Reis',
        phone: '(21) 99999-0000',
        attendance: 'sim',
        adults: [
          { name: 'João Reis', age: 32 },
          { name: 'Ana Reis', age: 30 },
        ],
        children: [{ name: 'Lia Reis', age: 7 }],
      }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(upsertRsvp).toHaveBeenCalled();
  });
})
