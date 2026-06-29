import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const deleteRecado = vi.fn();
const getCurrentAdminSession = vi.fn();

vi.mock('@/lib/recados/service', () => ({
  deleteRecado,
}));

vi.mock('@/lib/auth/session', () => ({
  getCurrentAdminSession,
}));

function buildRequest(id: string) {
  return new NextRequest(`http://localhost:3000/api/recados/${id}`, {
    method: 'DELETE',
  });
}

describe('DELETE /api/recados/[id]', () => {
  beforeEach(() => {
    deleteRecado.mockReset();
    getCurrentAdminSession.mockReset();
  });

  it('retorna 401 quando não autenticado', async () => {
    getCurrentAdminSession.mockResolvedValue(null);

    const { DELETE } = await import('./route');
    const response = await DELETE(buildRequest('ckxyz'), {
      params: Promise.resolve({ id: 'ckxyz' }),
    });
    const body = await response.json();

    expect(response.status).toBe(401);
    expect(body.ok).toBe(false);
    expect(deleteRecado).not.toHaveBeenCalled();
  });

  it('retorna 200 quando admin remove recado existente', async () => {
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    deleteRecado.mockResolvedValue(true);

    const { DELETE } = await import('./route');
    const response = await DELETE(buildRequest('ckxyz'), {
      params: Promise.resolve({ id: 'ckxyz' }),
    });
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.ok).toBe(true);
    expect(deleteRecado).toHaveBeenCalledWith('ckxyz');
  });

  it('retorna 404 quando o recado não existe', async () => {
    getCurrentAdminSession.mockResolvedValue({ id: 'session-1' } as never);
    deleteRecado.mockResolvedValue(false);

    const { DELETE } = await import('./route');
    const response = await DELETE(buildRequest('missing'), {
      params: Promise.resolve({ id: 'missing' }),
    });
    const body = await response.json();

    expect(response.status).toBe(404);
    expect(body.ok).toBe(false);
  });
})
