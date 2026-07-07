import { Prisma } from '@prisma/client';
import { ZodError } from 'zod';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  calculatePresenceStats,
  deleteRsvp,
  RsvpNotFoundError,
  RsvpPhoneConflictError,
  toAttendanceEnum,
  updateRsvp,
  upsertRsvp,
} from './service';

describe('rsvp service helpers', () => {
  it('converte attendance do formulário para enum', () => {
    expect(toAttendanceEnum('sim')).toBe('YES');
    expect(toAttendanceEnum('nao')).toBe('NO');
  });

  it('calcula totais ignorando grupos que não irão', () => {
    const stats = calculatePresenceStats([
      { attendance: 'YES', adults: 2, children: 1 },
      { attendance: 'NO', adults: 4, children: 2 },
      { attendance: 'YES', adults: 1, children: 0 },
    ]);

    expect(stats.confirmedGroups).toBe(2);
    expect(stats.declinedGroups).toBe(1);
    expect(stats.confirmedAdults).toBe(3);
    expect(stats.confirmedChildren).toBe(1);
    expect(stats.confirmedTotal).toBe(4);
  });
})

describe('upsertRsvp', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  function buildPrismaStub() {
    const upsert = vi.fn();
    const prisma = {
      rsvp: { upsert },
    };

    return { prisma, upsert };
  }

  it('persiste adultos sem idade e crianças com idade', async () => {
    const { prisma, upsert } = buildPrismaStub();

    upsert.mockResolvedValue({
      id: 'r1',
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'YES',
      adults: 2,
      children: 1,
      participants: {
        adults: [{ name: 'João Reis' }, { name: 'Ana Reis' }],
        children: [{ name: 'Lia Reis', age: 7 }],
      },
      createdAt: new Date('2026-06-29T12:00:00Z'),
      updatedAt: new Date('2026-06-29T12:00:00Z'),
    });

    const result = await upsertRsvp(
      {
        name: 'João Reis',
        phone: '(21) 99999-0000',
        attendance: 'sim',
        adults: [{ name: 'João Reis' }, { name: 'Ana Reis' }],
        children: [{ name: 'Lia Reis', age: '7' }],
      },
      prisma as never,
    );

    expect(upsert).toHaveBeenCalledOnce();
    const persisted = upsert.mock.calls[0][0];
    expect(persisted.create.participants).toEqual({
      adults: [{ name: 'João Reis' }, { name: 'Ana Reis' }],
      children: [{ name: 'Lia Reis', age: 7 }],
    });
    expect(persisted.create.adults).toBe(2);
    expect(persisted.create.children).toBe(1);

    expect(result.adultsList).toEqual([{ name: 'João Reis' }, { name: 'Ana Reis' }]);
    expect(result.childrenList).toEqual([{ name: 'Lia Reis', age: 7 }]);
  });

  it('ignora idade de adulto em dado antigo (serialização sem expor)', async () => {
    const { prisma, upsert } = buildPrismaStub();

    upsert.mockResolvedValue({
      id: 'r2',
      name: 'João Reis',
      phone: '(21) 99999-0000',
      attendance: 'YES',
      adults: 1,
      children: 0,
      participants: {
        adults: [{ name: 'João Reis', age: 32 }],
        children: [],
      },
      createdAt: new Date('2026-06-29T12:00:00Z'),
      updatedAt: new Date('2026-06-29T12:00:00Z'),
    });

    const result = await upsertRsvp(
      {
        name: 'João Reis',
        phone: '(21) 99999-0000',
        attendance: 'sim',
        adults: [{ name: 'João Reis' }],
      },
      prisma as never,
    );

    expect(result.adultsList).toEqual([{ name: 'João Reis' }]);
    expect(result.childrenList).toEqual([]);
  });

  it('contadores adultos/crianças refletem tamanhos das listas', async () => {
    const { prisma, upsert } = buildPrismaStub();

    upsert.mockResolvedValue({
      id: 'r3',
      name: 'Família',
      phone: '(21) 99999-0000',
      attendance: 'YES',
      adults: 3,
      children: 2,
      participants: {
        adults: [
          { name: 'A1' },
          { name: 'A2' },
          { name: 'A3' },
        ],
        children: [
          { name: 'C1', age: 3 },
          { name: 'C2', age: 5 },
        ],
      },
      createdAt: new Date('2026-06-29T12:00:00Z'),
      updatedAt: new Date('2026-06-29T12:00:00Z'),
    });

    const result = await upsertRsvp(
      {
        name: 'Família',
        phone: '(21) 99999-0000',
        attendance: 'sim',
        adults: [{ name: 'A1' }, { name: 'A2' }, { name: 'A3' }],
        children: [
          { name: 'C1', age: 3 },
          { name: 'C2', age: 5 },
        ],
      },
      prisma as never,
    );

    expect(result.adults).toBe(3);
    expect(result.children).toBe(2);
    expect(result.total).toBe(5);
  });
})

describe('deleteRsvp', () => {
  it('retorna true e remove quando o id existe', async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 1 });
    const prisma = { rsvp: { deleteMany } };

    const result = await deleteRsvp('r1', prisma as never);

    expect(result).toBe(true);
    expect(deleteMany).toHaveBeenCalledWith({ where: { id: 'r1' } });
  });

  it('retorna false quando o id não existe', async () => {
    const deleteMany = vi.fn().mockResolvedValue({ count: 0 });
    const prisma = { rsvp: { deleteMany } };

    const result = await deleteRsvp('missing', prisma as never);

    expect(result).toBe(false);
  });
})

describe('updateRsvp', () => {
  const validInput = {
    name: 'Maria Silva',
    phone: '(21) 99999-0000',
    attendance: 'sim' as const,
    adults: [{ name: 'Maria Silva' }],
    children: [{ name: 'João Silva', age: '4' }],
  };

  it('atualiza e retorna o RsvpSummary serializado', async () => {
    const update = vi.fn().mockResolvedValue({
      id: 'r1',
      name: 'Maria Silva',
      phone: '(21) 99999-0000',
      attendance: 'YES',
      adults: 1,
      children: 1,
      participants: {
        adults: [{ name: 'Maria Silva' }],
        children: [{ name: 'João Silva', age: 4 }],
      },
      createdAt: new Date('2026-06-29T12:00:00Z'),
      updatedAt: new Date('2026-06-30T12:00:00Z'),
    });
    const prisma = { rsvp: { update } };

    const result = await updateRsvp('r1', validInput, prisma as never);

    expect(update).toHaveBeenCalledOnce();
    const args = update.mock.calls[0][0];
    expect(args.where).toEqual({ id: 'r1' });
    expect(args.data.adults).toBe(1);
    expect(args.data.children).toBe(1);
    expect(args.data.phoneNormalized).toBe('21999990000');
    expect(args.data).not.toHaveProperty('message');
    expect(args.data).not.toHaveProperty('groupName');
    expect(result.id).toBe('r1');
    expect(result.childrenList).toEqual([{ name: 'João Silva', age: 4 }]);
  });

  it('lança RsvpNotFoundError quando o Prisma retorna P2025', async () => {
    const update = vi.fn().mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('not found', {
        code: 'P2025',
        clientVersion: 'test',
      }),
    );
    const prisma = { rsvp: { update } };

    await expect(updateRsvp('missing', validInput, prisma as never)).rejects.toBeInstanceOf(
      RsvpNotFoundError,
    );
  });

  it('lança RsvpPhoneConflictError quando o Prisma retorna P2002', async () => {
    const update = vi.fn().mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError('unique', {
        code: 'P2002',
        clientVersion: 'test',
      }),
    );
    const prisma = { rsvp: { update } };

    await expect(updateRsvp('r1', validInput, prisma as never)).rejects.toBeInstanceOf(
      RsvpPhoneConflictError,
    );
  });

  it('lança ZodError quando a entrada é inválida', async () => {
    const update = vi.fn();
    const prisma = { rsvp: { update } };

    await expect(
      updateRsvp('r1', { ...validInput, name: '' }, prisma as never),
    ).rejects.toBeInstanceOf(ZodError);
    expect(update).not.toHaveBeenCalled();
  });
})
