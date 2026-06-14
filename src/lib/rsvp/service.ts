import type { Attendance, Prisma, PrismaClient, Rsvp } from '@prisma/client';

import { getPrismaClient } from '@/lib/db/prisma';

import { normalizePhone } from './phone';
import {
  type RsvpInput,
  type RsvpParticipantInput,
  rsvpInputSchema,
  rsvpParticipantSchema,
} from './schema';

export type DashboardStatusFilter = 'all' | 'yes' | 'no';
export type RsvpParticipant = RsvpParticipantInput;

export type RsvpSummary = {
  id: string;
  name: string;
  displayName: string;
  groupName?: string;
  phone: string;
  attendance: 'sim' | 'nao';
  adults: number;
  children: number;
  total: number;
  participants: RsvpParticipant[];
  message?: string;
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

export function countParticipants(participants: RsvpParticipant[]) {
  return participants.reduce(
    (acc, participant) => {
      if (participant.type === 'adulto') {
        acc.adults += 1;
      } else {
        acc.children += 1;
      }

      acc.total += 1;
      return acc;
    },
    { adults: 0, children: 0, total: 0 },
  );
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

function parseStoredParticipants(value: Prisma.JsonValue): RsvpParticipant[] {
  const parsed = PrismaParticipantArraySchema.safeParse(value);
  return parsed.success ? parsed.data : [];
}

function serializeRsvp(rsvp: Rsvp): RsvpSummary {
  const participants = parseStoredParticipants(rsvp.participants as Prisma.JsonValue);
  const displayName = rsvp.groupName?.trim() || participants.map((participant) => participant.name).join(', ') || rsvp.name;

  return {
    id: rsvp.id,
    name: rsvp.name,
    displayName,
    groupName: rsvp.groupName ?? undefined,
    phone: rsvp.phone,
    attendance: fromAttendanceEnum(rsvp.attendance),
    adults: rsvp.adults,
    children: rsvp.children,
    total: rsvp.adults + rsvp.children,
    participants,
    message: rsvp.message ?? undefined,
    createdAt: rsvp.createdAt,
    updatedAt: rsvp.updatedAt,
  };
}

const PrismaParticipantArraySchema = rsvpParticipantSchema.array();

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
  const normalizedGroupName = parsed.groupName?.trim() || null;
  const participantNames = parsed.participants.map((participant) => participant.name.trim()).join(', ');
  const counts = countParticipants(parsed.participants);

  return {
    name: normalizedGroupName ? `${normalizedGroupName} — ${participantNames}` : participantNames,
    groupName: normalizedGroupName,
    phone: parsed.phone,
    phoneNormalized,
    attendance: toAttendanceEnum(parsed.attendance),
    adults: counts.adults,
    children: counts.children,
    participants: parsed.participants,
    message: parsed.message?.trim() || null,
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
            { groupName: { contains: q, mode: 'insensitive' } },
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
