import { cookies } from 'next/headers';

import { deleteSessionByToken, isHttpsRequest, SESSION_COOKIE_NAME } from '@/lib/auth/session';

export async function POST(request: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

  if (token) {
    await deleteSessionByToken(token);
  }

  const response = Response.json({ ok: true, redirectTo: '/login' });
  response.headers.append(
    'Set-Cookie',
    `${SESSION_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0${isHttpsRequest(request) ? '; Secure' : ''}`,
  );

  return response;
}
