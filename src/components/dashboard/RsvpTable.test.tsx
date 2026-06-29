import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { RsvpTable } from './RsvpTable';

describe('RsvpTable', () => {
  it('renderiza linhas de RSVP com adultos sem idade e crianças com idade', () => {
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
            adultsList: [{ name: 'João Reis' }, { name: 'Ana Reis' }],
            childrenList: [{ name: 'Lia Reis', age: 7 }],
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            updatedAt: new Date('2026-01-01T10:00:00.000Z'),
          },
        ]}
      />,
    );

    expect(screen.getByText('João Reis', { selector: 'p' })).toBeInTheDocument();
    expect(screen.getByText('João Reis', { selector: 'li' })).toBeInTheDocument();
    expect(screen.getByText('Ana Reis', { selector: 'li' })).toBeInTheDocument();
    expect(screen.getByText(/lia reis • 7 anos/i)).toBeInTheDocument();
    expect(screen.getByText(/confirmado/i)).toBeInTheDocument();
  });

  it('exibe adultos de confirmação antiga sem mostrar idade', () => {
    render(
      <RsvpTable
        rows={[
          {
            id: '2',
            name: 'Família Antiga',
            phone: '(21) 99999-0000',
            attendance: 'sim',
            adults: 1,
            children: 0,
            total: 1,
            adultsList: [{ name: 'João Antigo', age: 32 }],
            childrenList: [],
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            updatedAt: new Date('2026-01-01T10:00:00.000Z'),
          },
        ]}
      />,
    );

    expect(screen.getByText('João Antigo', { selector: 'li' })).toBeInTheDocument();
    expect(screen.queryByText(/32 anos/)).not.toBeInTheDocument();
  });
})
