import { createHash, randomUUID } from 'node:crypto';

import type { AdminSession, AdminUser, PrismaClient } from '@prisma/client';
import { cookies } from 'next/headers';

import { getPrismaClient } from '@/lib/db/prisma';

export const SESSION_COOKIE_NAME = 'site_diana_admin_session';
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;

export function createSessionToken() {
  return `${randomUUID()}${randomUUID().replace(/-/g, '')}`;
}

export function hashSessionToken(token: string) {
  const secret = process.env.SESSION_SECRET ?? 'dev-session-secret';
  return createHash('sha256').update(`${token}:${secret}`).digest('hex');
}

export function getSessionExpiresAt(now = new Date()) {
  return new Date(now.getTime() + SESSION_MAX_AGE_SECONDS * 1000);
}

export function getSessionCookieOptions(expiresAt: Date) {
  return {
    httpOnly: true,
    sameSite: 'lax' as const,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    expires: expiresAt,
  };
}

export type SessionWithUser = AdminSession & {
  adminUser: AdminUser;
};

export async function createAdminSession(adminUserId: string, db: PrismaClient = getPrismaClient()) {
  const token = createSessionToken();
  const tokenHash = hashSessionToken(token);
  const expiresAt = getSessionExpiresAt();

  await db.adminSession.create({
    data: {
      adminUserId,
      tokenHash,
      expiresAt,
    },
  });

  return { token, expiresAt };
}

export async function getCurrentAdminSession(db: PrismaClient = getPrismaClient()): Promise<SessionWithUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return null;
  }

  return getSessionByToken(token, db);
}

export async function getSessionByToken(token: string, db: PrismaClient = getPrismaClient()): Promise<SessionWithUser | null> {
  const session = await db.adminSession.findUnique({
    where: { tokenHash: hashSessionToken(token) },
    include: { adminUser: true },
  });

  if (!session) {
    return null;
  }

  if (session.expiresAt.getTime() <= Date.now()) {
    await db.adminSession.delete({ where: { id: session.id } }).catch(() => undefined);
    return null;
  }

  return session;
}

export async function deleteSessionByToken(token: string, db: PrismaClient = getPrismaClient()) {
  await db.adminSession.deleteMany({
    where: { tokenHash: hashSessionToken(token) },
  });
}
