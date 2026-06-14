import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RsvpTable } from './RsvpTable';

describe('RsvpTable', () => {
  it('renderiza linhas de RSVP com participantes individuais', () => {
    render(
      <RsvpTable
        rows={[
          {
            id: '1',
            name: 'Família Reis — João Reis, Lia Reis',
            displayName: 'Família Reis',
            groupName: 'Família Reis',
            phone: '(21) 99999-0000',
            attendance: 'sim',
            adults: 1,
            children: 1,
            total: 2,
            participants: [
              { name: 'João Reis', type: 'adulto', age: 35 },
              { name: 'Lia Reis', type: 'crianca', age: 7 },
            ],
            message: 'Estaremos lá',
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            updatedAt: new Date('2026-01-01T10:00:00.000Z'),
          },
        ]}
      />,
    );

    expect(screen.getAllByText(/família reis/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/joão reis • adulto • 35 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/lia reis • criança • 7 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/estaremos lá/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmado/i)).toBeInTheDocument();
  });
})
