import { describe, expect, it } from 'vitest';

import { calculatePresenceStats, toAttendanceEnum } from './service';

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
