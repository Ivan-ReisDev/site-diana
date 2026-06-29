import { ZodError } from 'zod';

import { upsertRsvp } from '@/lib/rsvp/service';

function getErrorMessage(error: unknown) {
  if (error instanceof ZodError) {
    return 'Informe seu nome completo, telefone e o nome de cada adulto.';
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Não foi possível registrar sua presença agora.';
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rsvp = await upsertRsvp(body);

    return Response.json({
      ok: true,
      rsvp,
      message: 'Presença registrada com carinho.',
    });
  } catch (error) {
    const message = getErrorMessage(error);
    const status = error instanceof ZodError || message.toLowerCase().includes('telefone') ? 400 : 500;

    return Response.json(
      {
        ok: false,
        message,
      },
      { status },
    );
  }
}
