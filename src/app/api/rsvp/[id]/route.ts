import { ZodError } from 'zod';

import { getCurrentAdminSession } from '@/lib/auth/session';
import {
  deleteRsvp,
  RsvpNotFoundError,
  RsvpPhoneConflictError,
  updateRsvp,
} from '@/lib/rsvp/service';

/**
 * Guard compartilhado pelos handlers por `id`: garante sessão de admin.
 * Retorna a sessão quando válida ou uma `Response` 401 pronta para ser devolvida.
 */
async function requireAdminSession() {
  const session = await getCurrentAdminSession();

  if (!session) {
    return {
      session: null,
      unauthorized: Response.json(
        { ok: false, message: 'Não autorizado.' },
        { status: 401 },
      ),
    } as const;
  }

  return { session, unauthorized: null } as const;
}

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;
  const removed = await deleteRsvp(id);

  if (!removed) {
    return Response.json(
      { ok: false, message: 'Confirmação não encontrada.' },
      { status: 404 },
    );
  }

  return Response.json({ ok: true, message: 'Confirmação removida.' });
}

export async function PATCH(request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { unauthorized } = await requireAdminSession();
  if (unauthorized) return unauthorized;

  const { id } = await ctx.params;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json(
      { ok: false, message: 'Corpo da requisição inválido.' },
      { status: 400 },
    );
  }

  try {
    const rsvp = await updateRsvp(id, payload);
    return Response.json({ ok: true, rsvp, message: 'Confirmação atualizada.' });
  } catch (error) {
    if (error instanceof ZodError) {
      const message = error.issues[0]?.message ?? 'Dados inválidos.';
      return Response.json({ ok: false, message }, { status: 400 });
    }

    if (error instanceof RsvpNotFoundError) {
      return Response.json({ ok: false, message: error.message }, { status: 404 });
    }

    if (error instanceof RsvpPhoneConflictError) {
      return Response.json({ ok: false, message: error.message }, { status: 409 });
    }

    throw error;
  }
}
