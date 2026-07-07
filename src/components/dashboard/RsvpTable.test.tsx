import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { RsvpTable } from './RsvpTable';

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh: vi.fn() }),
}));

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

  it('renderiza uma região de ações por linha', () => {
    render(
      <RsvpTable
        rows={[
          {
            id: 'a1',
            name: 'Grupo A',
            phone: '(21) 90000-0001',
            attendance: 'sim',
            adults: 1,
            children: 0,
            total: 1,
            adultsList: [{ name: 'Grupo A' }],
            childrenList: [],
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            updatedAt: new Date('2026-01-01T10:00:00.000Z'),
          },
          {
            id: 'b2',
            name: 'Grupo B',
            phone: '(21) 90000-0002',
            attendance: 'nao',
            adults: 2,
            children: 0,
            total: 2,
            adultsList: [{ name: 'Grupo B' }, { name: 'Par B' }],
            childrenList: [],
            createdAt: new Date('2026-01-01T10:00:00.000Z'),
            updatedAt: new Date('2026-01-01T10:00:00.000Z'),
          },
        ]}
      />,
    );

    expect(screen.getAllByTestId('rsvp-row-actions')).toHaveLength(2);
  });
})
