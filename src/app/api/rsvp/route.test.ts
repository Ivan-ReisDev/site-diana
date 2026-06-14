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
    upsertRsvp.mockRejectedValue(new Error('Informe pelo menos uma pessoa e o telefone.'));

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
      name: 'Família Reis — João Reis, Lia Reis',
      groupName: 'Família Reis',
      attendance: 'sim',
      adults: 1,
      children: 1,
      participants: [
        { name: 'João Reis', type: 'adulto', age: 35 },
        { name: 'Lia Reis', type: 'crianca', age: 7 },
      ],
    });

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/rsvp', {
      method: 'POST',
      body: JSON.stringify({
        groupName: 'Família Reis',
        phone: '(21) 99999-0000',
        attendance: 'sim',
        participants: [
          { name: 'João Reis', type: 'adulto', age: 35 },
          { name: 'Lia Reis', type: 'crianca', age: 7 },
        ],
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
