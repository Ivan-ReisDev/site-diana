import { describe, expect, it } from 'vitest';

import { createSessionToken, getSessionExpiresAt, hashSessionToken, SESSION_COOKIE_NAME } from './session';

describe('session helpers', () => {
  it('usa um nome fixo para o cookie', () => {
    expect(SESSION_COOKIE_NAME).toBe('site_diana_admin_session');
  });

  it('gera hash estável para o mesmo token', () => {
    expect(hashSessionToken('abc')).toBe(hashSessionToken('abc'));
  });

  it('gera token opaco não vazio', () => {
    expect(createSessionToken()).toMatch(/[a-f0-9-]{20,}/i);
  });

  it('expira a sessão no futuro', () => {
    const now = new Date('2026-01-01T00:00:00.000Z');
    const expiresAt = getSessionExpiresAt(now);

    expect(expiresAt.getTime()).toBeGreaterThan(now.getTime());
  });
});
