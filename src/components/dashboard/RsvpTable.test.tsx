import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RsvpTable } from './RsvpTable';

describe('RsvpTable', () => {
  it('renderiza linhas de RSVP com adultos e crianças', () => {
    render(
      <RsvpTable
        rows={[
          {
            id: '1',
            name: 'João Reis',
            phone: '(21) 99999-0000',
            attendance: 'sim',
            adults: 2,
            children: 1,
            total: 3,
            adultsList: [
              { name: 'João Reis', age: 32 },
              { name: 'Ana Reis', age: 30 },
            ],
            childrenList: [{ name: 'Lia Reis', age: 7 }],
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            updatedAt: new Date('2026-01-01T10:00:00.000Z'),
          },
        ]}
      />,
    );

    expect(screen.getByText('João Reis', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText(/joão reis • 32 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/ana reis • 30 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/lia reis • 7 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmado/i)).toBeInTheDocument();
  });
})
