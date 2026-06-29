import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const listRecados = vi.fn();
const createRecado = vi.fn();
const rateLimiter = { check: vi.fn(), reset: vi.fn() };

vi.mock('@/lib/recados/service', () => ({
  listRecados,
  createRecado,
}));

vi.mock('@/lib/recados/rate-limit', () => ({
  createRecadoRateLimiter: () => rateLimiter,
}));

describe('GET /api/recados', () => {
  beforeEach(() => {
    listRecados.mockReset();
    rateLimiter.check.mockReset();
    rateLimiter.reset.mockReset();
  });

  it('retorna a lista quando o serviço responde', async () => {
    listRecados.mockResolvedValue([
      { id: 'r1', nome: 'Tia Ana', mensagem: 'Felicidades!', createdAt: new Date('2026-06-29T12:00:00Z') },
    ]);

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(Array.isArray(body.recados)).toBe(true);
    expect(body.recados[0].id).toBe('r1');
  });

  it('retorna 500 quando o serviço falha', async () => {
    listRecados.mockRejectedValue(new Error('boom'));

    const { GET } = await import('./route');
    const response = await GET();
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
  });
});

describe('POST /api/recados', () => {
  beforeEach(() => {
    createRecado.mockReset();
    rateLimiter.check.mockReset();
    rateLimiter.reset.mockReset();
  });

  it('retorna 400 para payload inválido', async () => {
    rateLimiter.check.mockReturnValue({ allowed: true, remaining: 4 });

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/recados', {
      method: 'POST',
      body: JSON.stringify({ nome: '', mensagem: '' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });

  it('retorna 429 quando o dispositivo excede o limite', async () => {
    rateLimiter.check.mockReturnValue({ allowed: false, remaining: 0 });

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/recados', {
      method: 'POST',
      body: JSON.stringify({ nome: 'Tia', mensagem: 'Felicidades!' }),
      headers: {
        'content-type': 'application/json',
        'x-forwarded-for': '203.0.113.10',
      },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(429);
    expect(body.ok).toBe(false);
    expect(createRecado).not.toHaveBeenCalled();
  });

  it('cria recado com sucesso quando validação passa e rate limit permite', async () => {
    rateLimiter.check.mockReturnValue({ allowed: true, remaining: 4 });
    createRecado.mockResolvedValue({
      id: 'r1',
      nome: 'Tia Ana',
      mensagem: 'Felicidades!',
      createdAt: new Date('2026-06-29T12:00:00Z'),
    });

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/recados', {
      method: 'POST',
      body: JSON.stringify({ nome: 'Tia Ana', mensagem: 'Felicidades!' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.recado.id).toBe('r1');
  });

  it('retorna 500 quando o serviço falha ao criar', async () => {
    rateLimiter.check.mockReturnValue({ allowed: true, remaining: 4 });
    createRecado.mockRejectedValue(new Error('boom'));

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/recados', {
      method: 'POST',
      body: JSON.stringify({ nome: 'Tia Ana', mensagem: 'Felicidades!' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body.ok).toBe(false);
  });
})
