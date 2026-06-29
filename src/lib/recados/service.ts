import type { PrismaClient, Recado } from '@prisma/client';

import { getPrismaClient } from '@/lib/db/prisma';

import { recadoInputSchema, type RecadoInput } from './schema';

export type RecadoSummary = {
  id: string;
  nome: string;
  mensagem: string;
  createdAt: Date;
};

function toSummary(recado: Recado): RecadoSummary {
  return {
    id: recado.id,
    nome: recado.nome,
    mensagem: recado.mensagem,
    createdAt: recado.createdAt,
  };
}

export async function listRecados(db: PrismaClient = getPrismaClient()): Promise<RecadoSummary[]> {
  const rows = await db.recado.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return rows.map(toSummary);
}

export async function createRecado(
  input: unknown,
  db: PrismaClient = getPrismaClient(),
): Promise<RecadoSummary> {
  const parsed: RecadoInput = recadoInputSchema.parse(input);

  const recado = await db.recado.create({
    data: {
      nome: parsed.nome,
      mensagem: parsed.mensagem,
    },
  });

  return toSummary(recado);
}

export async function deleteRecado(
  id: string,
  db: PrismaClient = getPrismaClient(),
): Promise<boolean> {
  const result = await db.recado.deleteMany({
    where: { id },
  });

  return result.count > 0;
}
