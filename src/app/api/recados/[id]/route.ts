import { getCurrentAdminSession } from '@/lib/auth/session';
import { deleteRecado } from '@/lib/recados/service';

export async function DELETE(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const session = await getCurrentAdminSession();

  if (!session) {
    return Response.json(
      { ok: false, message: 'Não autorizado.' },
      { status: 401 },
    );
  }

  const { id } = await ctx.params;
  const removed = await deleteRecado(id);

  if (!removed) {
    return Response.json(
      { ok: false, message: 'Recado não encontrado.' },
      { status: 404 },
    );
  }

  return Response.json({ ok: true, message: 'Recado removido.' });
}
