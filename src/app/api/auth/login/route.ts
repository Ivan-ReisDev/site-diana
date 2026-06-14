import { loginSchema } from '@/lib/auth/schema';
import { createAdminSession, isHttpsRequest, SESSION_COOKIE_NAME } from '@/lib/auth/session';
import { verifyPassword } from '@/lib/auth/password';
import { getPrismaClient } from '@/lib/db/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = loginSchema.parse(body);

    const adminUser = await getPrismaClient().adminUser.findUnique({ where: { email } });

    if (!adminUser) {
      return Response.json({ ok: false, message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const passwordMatches = await verifyPassword(password, adminUser.passwordHash);

    if (!passwordMatches) {
      return Response.json({ ok: false, message: 'Credenciais inválidas.' }, { status: 401 });
    }

    const { token, expiresAt } = await createAdminSession(adminUser.id);
    const response = Response.json({ ok: true, redirectTo: '/dashboard' });

    response.headers.append(
      'Set-Cookie',
      `${SESSION_COOKIE_NAME}=${token}; Path=/; HttpOnly; SameSite=Lax; Expires=${expiresAt.toUTCString()}${isHttpsRequest(request) ? '; Secure' : ''}`,
    );

    return response;
  } catch {
    return Response.json({ ok: false, message: 'Não foi possível entrar agora.' }, { status: 400 });
  }
}
