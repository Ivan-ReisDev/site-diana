import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import InvitationSite from './InvitationSite';

describe('InvitationSite', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza convite com informações principais, RSVP e Pix', () => {
    render(<InvitationSite />);

    expect(screen.getByRole('heading', { name: /diana faz 1 ano/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /confirme sua presença/i })).toBeInTheDocument();
    expect(screen.getAllByText(/11 de outubro/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/13 horas/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('button', { name: /copiar chave pix/i })).toBeInTheDocument();
  });

  it('envia RSVP com adultos e crianças e mostra feedback de sucesso', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({
        ok: true,
        rsvp: {
          name: 'João Reis',
          attendance: 'sim',
          adults: 2,
          children: 1,
          adultsList: [
            { name: 'João Reis', age: 32 },
            { name: 'Ana Reis', age: 30 },
          ],
          childrenList: [{ name: 'Lia Reis', age: 7 }],
        },
        message: 'Presença registrada com carinho.',
      }),
    });

    vi.stubGlobal('fetch', fetchMock);

    render(<InvitationSite />);

    fireEvent.change(screen.getByPlaceholderText('Seu nome completo'), { target: { value: 'João Reis' } });
    fireEvent.change(screen.getByPlaceholderText('(21) 99999-9999'), { target: { value: '(21) 99999-0000' } });

    fireEvent.change(screen.getByPlaceholderText('Adulto 1'), { target: { value: 'João Reis' } });
    fireEvent.change(screen.getAllByPlaceholderText('0')[0], { target: { value: '32' } });

    fireEvent.click(screen.getByRole('button', { name: /adicionar adulto/i }));
    fireEvent.change(screen.getByPlaceholderText('Adulto 2'), { target: { value: 'Ana Reis' } });
    fireEvent.change(screen.getAllByPlaceholderText('0')[1], { target: { value: '30' } });

    fireEvent.click(screen.getByRole('button', { name: /adicionar criança/i }));
    fireEvent.change(screen.getByPlaceholderText('Criança 1'), { target: { value: 'Lia Reis' } });
    fireEvent.change(screen.getAllByPlaceholderText('0')[2], { target: { value: '7' } });

    fireEvent.click(screen.getByRole('button', { name: /confirmar presença/i }));

    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledWith('/api/rsvp', expect.objectContaining({ method: 'POST' }));
    });

    expect(await screen.findByText(/presença registrada/i)).toBeInTheDocument();
    expect(screen.getByText(/joão reis/i)).toBeInTheDocument();
    expect(screen.getByText(/crianças: lia reis/i)).toBeInTheDocument();
  });

  it('mostra feedback ao copiar chave Pix', async () => {
    Object.assign(navigator, {
      clipboard: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });

    render(<InvitationSite />);
    fireEvent.click(screen.getByRole('button', { name: /copiar chave pix/i }));

    expect(await screen.findByText(/chave pix copiada/i)).toBeInTheDocument();
  });
});
