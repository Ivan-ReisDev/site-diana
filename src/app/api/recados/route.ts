import { ZodError } from 'zod';

import { createRecadoRateLimiter } from '@/lib/recados/rate-limit';
import { recadoInputSchema } from '@/lib/recados/schema';
import { createRecado, listRecados } from '@/lib/recados/service';

export const dynamic = 'force-dynamic';

function getRequestDeviceId(request: Request): string {
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  return '127.0.0.1';
}

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return 'Informe seu nome e uma mensagem (até 240 caracteres).';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível processar a requisição.';
}

export async function GET() {
  try {
    const recados = await listRecados();

    return Response.json({ ok: true, recados });
  } catch {
    return Response.json(
      {
        ok: false,
        message: 'Não foi possível carregar os recados agora.',
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const limiter = createRecadoRateLimiter();
  const deviceId = getRequestDeviceId(request);

  if (!limiter.check(deviceId).allowed) {
    return Response.json(
      {
        ok: false,
        message: 'Você enviou muitos recados em pouco tempo. Tente novamente em alguns minutos.',
      },
      { status: 429 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
    recadoInputSchema.parse(body);
  } catch (error) {
    const message = getErrorMessage(error);
    return Response.json({ ok: false, message }, { status: 400 });
  }

  try {
    const recado = await createRecado(body);

    return Response.json({
      ok: true,
      recado,
      message: 'Recado enviado com carinho.',
    });
  } catch {
    return Response.json(
      { ok: false, message: 'Não foi possível enviar seu recado agora.' },
      { status: 500 },
    );
  }
}
