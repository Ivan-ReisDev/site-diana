import { NextRequest } from 'next/server';
import { ZodError } from 'zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const deleteRsvp = vi.fn();
const updateRsvp = vi.fn();
const getCurrentAdminSession = vi.fn();

vi.mock('@/lib/rsvp/service', async (importActual) => {
  const actual = await importActual<typeof import('@/lib/rsvp/service')>();
  return {
    ...actual,
    deleteRsvp,
    updateRsvp,
  };
});

vi.mock('@/lib/auth/session', () => ({
  getCurrentAdminSession,
}));

function buildDeleteRequest(id: string) {
  return new NextRequest(`http://localhost:3000/api/rsvp/${id}`, {
    method: 'DELETE',
  });
}

function buildPatchRequest(id: string, body: unknown) {
  return new NextRequest(`http://localhost:3000/api/rsvp/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  });
}

const validBody = {
  name: 'Maria Silva',
  phone: '(21) 99999-0000',
  attendance: 'sim',
  adults: [{ name: 'Maria Silva' }],
  children: [],
};

describe('DELETE /api/rsvp/[id]', () => {
  beforeEach(() => {
    deleteRsvp.mockReset();
    getCurrentAdminSession.mockReset();
  });

  it('retorna 401 quando não autenticado', async () => {
    getCurrentAdminSession.mockResolvedValue(null);

    const { DELETE } = await import('./route');
    const response = await DELETE(buildDeleteRequest('ckxyz'), {
      params: Promise.resolve({ id: 'ckxyz' }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(deleteRsvp).not.toHaveBeenCalled();
  });

  it('retorna 200 quando admin remove confirmação existente', async () => {
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    deleteRsvp.mockResolvedValue(true);

    const { DELETE } = await import('./route');
    const response = await DELETE(buildDeleteRequest('ckxyz'), {
      params: Promise.resolve({ id: 'ckxyz' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.message).toBe('Confirmação removida.');
    expect(deleteRsvp).toHaveBeenCalledWith('ckxyz');
  });

  it('retorna 404 quando a confirmação não existe', async () => {
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    deleteRsvp.mockResolvedValue(false);

    const { DELETE } = await import('./route');
    const response = await DELETE(buildDeleteRequest('missing'), {
      params: Promise.resolve({ id: 'missing' }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.ok).toBe(false);
    expect(body.message).toBe('Confirmação não encontrada.');
  });
})

describe('PATCH /api/rsvp/[id]', () => {
  beforeEach(() => {
    updateRsvp.mockReset();
    getCurrentAdminSession.mockReset();
  });

  it('retorna 401 quando não autenticado', async () => {
    getCurrentAdminSession.mockResolvedValue(null);

    const { PATCH } = await import('./route');
    const response = await PATCH(buildPatchRequest('r1', validBody), {
      params: Promise.resolve({ id: 'r1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(updateRsvp).not.toHaveBeenCalled();
  });

  it('retorna 400 quando o corpo é inválido (ZodError)', async () => {
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    updateRsvp.mockRejectedValue(new ZodError([]));

    const { PATCH } = await import('./route');
    const response = await PATCH(buildPatchRequest('r1', { name: '' }), {
      params: Promise.resolve({ id: 'r1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body.ok).toBe(false);
  });

  it('retorna 200 e a confirmação atualizada', async () => {
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    const rsvp = { id: 'r1', name: 'Maria Silva' };
    updateRsvp.mockResolvedValue(rsvp);

    const { PATCH } = await import('./route');
    const response = await PATCH(buildPatchRequest('r1', validBody), {
      params: Promise.resolve({ id: 'r1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(body.rsvp).toMatchObject({ id: 'r1' });
    expect(body.message).toBe('Confirmação atualizada.');
    expect(updateRsvp).toHaveBeenCalledWith('r1', expect.objectContaining({ name: 'Maria Silva' }));
  });

  it('retorna 404 quando o id não existe (RsvpNotFoundError)', async () => {
    const { RsvpNotFoundError } = await import('@/lib/rsvp/service');
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    updateRsvp.mockRejectedValue(new RsvpNotFoundError());

    const { PATCH } = await import('./route');
    const response = await PATCH(buildPatchRequest('missing', validBody), {
      params: Promise.resolve({ id: 'missing' }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.ok).toBe(false);
    expect(body.message).toBe('Confirmação não encontrada.');
  });

  it('retorna 409 quando o telefone conflita (RsvpPhoneConflictError)', async () => {
    const { RsvpPhoneConflictError } = await import('@/lib/rsvp/service');
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    updateRsvp.mockRejectedValue(new RsvpPhoneConflictError());

    const { PATCH } = await import('./route');
    const response = await PATCH(buildPatchRequest('r1', validBody), {
      params: Promise.resolve({ id: 'r1' }),
    });
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body.ok).toBe(false);
    expect(body.message).toBe('Já existe uma confirmação com esse telefone.');
  });
})
