import type { Attendance, Prisma, PrismaClient, Rsvp } from '@prisma/client';
import { z } from 'zod';

import { getPrismaClient } from '@/lib/db/prisma';

import { normalizePhone } from './phone';
import {
  type RsvpAdultInput,
  type RsvpChildInput,
  type RsvpInput,
  rsvpAdultSchema,
  rsvpChildSchema,
  rsvpInputSchema,
} from './schema';

export type DashboardStatusFilter = 'all' | 'yes' | 'no';
export type RsvpAdult = RsvpAdultInput;
export type RsvpChild = RsvpChildInput;

export type RsvpSummary = {
  id: string;
  name: string;
  phone: string;
  attendance: 'sim' | 'nao';
  adults: number;
  children: number;
  total: number;
  adultsList: RsvpAdult[];
  childrenList: RsvpChild[];
  createdAt: Date;
  updatedAt: Date;
};

export type PresenceStats = {
  confirmedGroups: number;
  declinedGroups: number;
  confirmedAdults: number;
  confirmedChildren: number;
  confirmedTotal: number;
};

export function toAttendanceEnum(attendance: string): Attendance {
  return attendance === 'nao' ? 'NO' : 'YES';
}

export function fromAttendanceEnum(attendance: Attendance): 'sim' | 'nao' {
  return attendance === 'NO' ? 'nao' : 'sim';
}

export function calculatePresenceStats(
  rsvps: Array<Pick<Rsvp, 'attendance' | 'adults' | 'children'>>,
): PresenceStats {
  return rsvps.reduce<PresenceStats>(
    (stats, current) => {
      if (current.attendance === 'YES') {
        stats.confirmedGroups += 1;
        stats.confirmedAdults += current.adults;
        stats.confirmedChildren += current.children;
        stats.confirmedTotal += current.adults + current.children;
      } else {
        stats.declinedGroups += 1;
      }

      return stats;
    },
    {
      confirmedGroups: 0,
      declinedGroups: 0,
      confirmedAdults: 0,
      confirmedChildren: 0,
      confirmedTotal: 0,
    },
  );
}

const adultsStoredSchema = rsvpAdultSchema.array().default([]);
const childrenStoredSchema = rsvpChildSchema.array().default([]);

const participantsSchema = z.object({
  adults: adultsStoredSchema,
  children: childrenStoredSchema,
});

function parseStoredParticipants(value: Prisma.JsonValue): { adults: RsvpAdult[]; children: RsvpChild[] } {
  const parsed = participantsSchema.safeParse(value);
  return parsed.success ? parsed.data : { adults: [], children: [] };
}

function serializeRsvp(rsvp: Rsvp): RsvpSummary {
  const participants = parseStoredParticipants(rsvp.participants as Prisma.JsonValue);

  return {
    id: rsvp.id,
    name: rsvp.name,
    phone: rsvp.phone,
    attendance: fromAttendanceEnum(rsvp.attendance),
    adults: rsvp.adults,
    children: rsvp.children,
    total: rsvp.adults + rsvp.children,
    adultsList: participants.adults,
    childrenList: participants.children,
    createdAt: rsvp.createdAt,
    updatedAt: rsvp.updatedAt,
  };
}

export async function upsertRsvp(input: unknown, db: PrismaClient = getPrismaClient()) {
  const parsed = rsvpInputSchema.parse(input);
  const phoneNormalized = normalizePhone(parsed.phone);

  const rsvp = await db.rsvp.upsert({
    where: { phoneNormalized },
    update: buildRsvpMutation(parsed, phoneNormalized),
    create: buildRsvpMutation(parsed, phoneNormalized),
  });

  return serializeRsvp(rsvp);
}

function buildRsvpMutation(parsed: RsvpInput, phoneNormalized: string) {
  return {
    name: parsed.name.trim(),
    groupName: null,
    phone: parsed.phone,
    phoneNormalized,
    attendance: toAttendanceEnum(parsed.attendance),
    adults: parsed.adults.length,
    children: parsed.children.length,
    participants: { adults: parsed.adults, children: parsed.children },
    message: null,
  };
}

export async function listRsvps(
  params: { status?: DashboardStatusFilter; q?: string },
  db: PrismaClient = getPrismaClient(),
) {
  const status = params.status ?? 'all';
  const q = params.q?.trim() ?? '';

  const where: Prisma.RsvpWhereInput = {
    ...(status === 'yes' ? { attendance: 'YES' } : {}),
    ...(status === 'no' ? { attendance: 'NO' } : {}),
    ...(q
      ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { phone: { contains: q } },
            { phoneNormalized: { contains: q.replace(/\D/g, '') } },
          ],
        }
      : {}),
  };

  const rows = await db.rsvp.findMany({
    where,
    orderBy: [{ attendance: 'asc' }, { updatedAt: 'desc' }],
  });

  return rows.map(serializeRsvp);
}

export async function getDashboardData(
  params: { status?: DashboardStatusFilter; q?: string },
  db: PrismaClient = getPrismaClient(),
) {
  const rows = await listRsvps(params, db);
  const stats = calculatePresenceStats(
    rows.map((row) => ({
      attendance: toAttendanceEnum(row.attendance),
      adults: row.adults,
      children: row.children,
    })),
  );

  return { rows, stats };
}
