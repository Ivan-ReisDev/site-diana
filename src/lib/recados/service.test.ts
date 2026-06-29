import type { Recado } from '@prisma/client';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { createRecado, deleteRecado, listRecados } from './service';

function buildPrismaStub() {
  const findMany = vi.fn();
  const create = vi.fn();
  const deleteMany = vi.fn();
  const prisma = {
    recado: { findMany, create, deleteMany },
  };

  return { prisma, findMany, create, deleteMany };
}

function buildRecado(overrides: Partial<Recado> = {}): Recado {
  return {
    id: 'ckxyz',
    nome: 'Tia Ana',
    mensagem: 'Felicidades!',
    createdAt: new Date('2026-06-29T12:00:00Z'),
    ...overrides,
  };
}

describe('recados service', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  describe('listRecados', () => {
    it('lista em ordem desc por createdAt', async () => {
      const { prisma, findMany } = buildPrismaStub();
      findMany.mockResolvedValue([
        buildRecado({ id: 'b' }),
        buildRecado({ id: 'a' }),
      ]);

      const result = await listRecados(prisma as never);

      expect(findMany).toHaveBeenCalledWith({ orderBy: { createdAt: 'desc' } });
      expect(result.map((r) => r.id)).toEqual(['b', 'a']);
    });
  });

  describe('createRecado', () => {
    it('persiste o recado após validação', async () => {
      const { prisma, create } = buildPrismaStub();
      create.mockResolvedValue(buildRecado());

      const result = await createRecado(
        { nome: 'Tia Ana', mensagem: 'Felicidades!' },
        prisma as never,
      );

      expect(create).toHaveBeenCalledOnce();
      const arg = create.mock.calls[0][0];
      expect(arg.data.nome).toBe('Tia Ana');
      expect(arg.data.mensagem).toBe('Felicidades!');
      expect(result.id).toBe('ckxyz');
    });

    it('lança erro quando nome é vazio', async () => {
      const { prisma, create } = buildPrismaStub();

      await expect(
        createRecado({ nome: '   ', mensagem: 'oi' }, prisma as never),
      ).rejects.toThrow();

      expect(create).not.toHaveBeenCalled();
    });

    it('lança erro quando mensagem é vazia', async () => {
      const { prisma, create } = buildPrismaStub();

      await expect(
        createRecado({ nome: 'Tia', mensagem: '' }, prisma as never),
      ).rejects.toThrow();

      expect(create).not.toHaveBeenCalled();
    });

    it('lança erro quando mensagem ultrapassa 240 caracteres', async () => {
      const { prisma, create } = buildPrismaStub();

      await expect(
        createRecado(
          { nome: 'Tia', mensagem: 'x'.repeat(241) },
          prisma as never,
        ),
      ).rejects.toThrow();

      expect(create).not.toHaveBeenCalled();
    });
  });

  describe('deleteRecado', () => {
    it('retorna true quando removeu', async () => {
      const { prisma, deleteMany } = buildPrismaStub();
      deleteMany.mockResolvedValue({ count: 1 });

      const result = await deleteRecado('ckxyz', prisma as never);

      expect(result).toBe(true);
      expect(deleteMany).toHaveBeenCalledWith({ where: { id: 'ckxyz' } });
    });

    it('retorna false quando nada foi removido', async () => {
      const { prisma, deleteMany } = buildPrismaStub();
      deleteMany.mockResolvedValue({ count: 0 });

      const result = await deleteRecado('ckxyz', prisma as never);

      expect(result).toBe(false);
    });
  });
})
