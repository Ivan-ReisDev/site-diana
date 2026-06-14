import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { PresenceStats } from './PresenceStats';

describe('PresenceStats', () => {
  it('renderiza métricas principais', () => {
    render(
      <PresenceStats
        stats={{
          confirmedGroups: 3,
          declinedGroups: 1,
          confirmedAdults: 5,
          confirmedChildren: 2,
          confirmedTotal: 7,
        }}
      />,
    );

    expect(screen.getByText(/grupos confirmados/i)).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText(/total confirmado/i)).toBeInTheDocument();
    expect(screen.getByText('7')).toBeInTheDocument();
  });
});
