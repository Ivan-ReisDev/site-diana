import { beforeEach, describe, expect, it, vi } from 'vitest';

import {
  calculatePresenceStats,
  toAttendanceEnum,
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
