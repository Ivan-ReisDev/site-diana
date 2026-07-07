import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RsvpSummary } from '@/lib/rsvp/service';

import { RsvpRowActions } from './RsvpRowActions';

const refresh = vi.fn();

vi.mock('next/navigation', () => ({
  useRouter: () => ({ refresh }),
}));

const row: RsvpSummary = {
  id: 'r1',
  name: 'Maria Silva',
  phone: '(21) 99999-0000',
  attendance: 'sim',
  adults: 1,
  children: 0,
  total: 1,
  adultsList: [{ name: 'Maria Silva' }],
  childrenList: [],
  createdAt: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-01T10:00:00.000Z'),
};

describe('RsvpRowActions — excluir', () => {
  beforeEach(() => {
    refresh.mockReset();
    vi.restoreAllMocks();
  });

  it('abre a confirmação ao clicar em Excluir', () => {
    render(<RsvpRowActions row={row} />);

    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));

    expect(screen.getByRole('dialog')).toBeInTheDocument();
  });

  it('não chama fetch ao cancelar a confirmação', () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);

    render(<RsvpRowActions row={row} />);

    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    fireEvent.click(screen.getByRole('button', { name: /cancelar/i }));

    expect(fetchMock).not.toHaveBeenCalled();
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('chama DELETE e atualiza a lista ao confirmar', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true, message: 'Confirmação removida.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<RsvpRowActions row={row} />);

    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    fireEvent.click(screen.getByRole('button', { name: /^confirmar/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/rsvp/r1',
      expect.objectContaining({ method: 'DELETE' }),
    );
    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
  });

  it('trata item já removido (404) atualizando a lista com aviso', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 404,
      json: async () => ({ ok: false, message: 'Confirmação não encontrada.' }),
    });
    vi.stubGlobal('fetch', fetchMock);

    render(<RsvpRowActions row={row} />);

    fireEvent.click(screen.getByRole('button', { name: /excluir/i }));
    fireEvent.click(screen.getByRole('button', { name: /^confirmar/i }));

    await waitFor(() => expect(refresh).toHaveBeenCalledTimes(1));
    expect(await screen.findByRole('alert')).toHaveTextContent(/não encontrada/i);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });
});
