import { NextRequest } from 'next/server';
import { beforeEach, describe, expect, it, vi } from 'vitest';

const findUnique = vi.fn();
const createAdminSession = vi.fn();
const verifyPassword = vi.fn();

vi.mock('@/lib/db/prisma', () => ({
  getPrismaClient: () => ({
    adminUser: {
      findUnique,
    },
  }),
}));

vi.mock('@/lib/auth/session', () => ({
  SESSION_COOKIE_NAME: 'site_diana_admin_session',
  createAdminSession,
}));

vi.mock('@/lib/auth/password', () => ({
  verifyPassword,
}));

describe('POST /api/auth/login', () => {
  beforeEach(() => {
    findUnique.mockReset();
    createAdminSession.mockReset();
    verifyPassword.mockReset();
  });

  it('retorna 401 quando credenciais são inválidas', async () => {
    findUnique.mockResolvedValue(null);

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@example.com', password: '12345678' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
  });

  it('cria sessão e define cookie quando login é válido', async () => {
    findUnique.mockResolvedValue({ id: 'admin-1', passwordHash: 'hash' });
    verifyPassword.mockResolvedValue(true);
    createAdminSession.mockResolvedValue({
      token: 'token-seguro',
      expiresAt: new Date('2026-01-10T00:00:00.000Z'),
    });

    const { POST } = await import('./route');
    const request = new NextRequest('http://localhost:3000/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: 'admin@example.com', password: '12345678' }),
      headers: { 'content-type': 'application/json' },
    });

    const response = await POST(request);

    expect(response.status).toBe(200);
    expect(response.headers.get('set-cookie')).toContain('site_diana_admin_session=token-seguro');
  });
});
