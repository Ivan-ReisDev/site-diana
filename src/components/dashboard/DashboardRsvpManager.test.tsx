import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardRsvpManager } from './DashboardRsvpManager';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    refresh,
  }),
}));

describe('DashboardRsvpManager', () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
  });

  it('permite adicionar pessoas e salvar um grupo pela dashboard', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<DashboardRsvpManager initialRows={[]} />);

    fireEvent.change(screen.getByPlaceholderText('Ex.: Família Souza'), { target: { value: 'Família Prado' } });
    fireEvent.change(screen.getByPlaceholderText('(21) 99999-9999'), { target: { value: '(21) 98888-1111' } });
    fireEvent.change(screen.getByPlaceholderText('Pessoa 1'), { target: { value: 'Paula Prado' } });
    fireEvent.change(screen.getByPlaceholderText('0'), { target: { value: '36' } });

    fireEvent.click(screen.getByRole('button', { name: /adicionar pessoa/i }));
    fireEvent.change(screen.getByPlaceholderText('Pessoa 2'), { target: { value: 'Theo Prado' } });
    fireEvent.change(screen.getAllByRole('combobox')[1], { target: { value: 'crianca' } });
    fireEvent.change(screen.getAllByPlaceholderText('0')[1], { target: { value: '5' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar grupo na dashboard/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/rsvp',
      expect.objectContaining({ method: 'POST' }),
    );
    expect(refresh).toHaveBeenCalledTimes(1);
    expect(screen.getByText(/grupo adicionado com sucesso/i)).toBeInTheDocument();
  });
});
