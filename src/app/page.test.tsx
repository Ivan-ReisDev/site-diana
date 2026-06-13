import { render, screen, fireEvent } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import InvitationSite from './InvitationSite';

describe('InvitationSite', () => {
  it('renderiza convite com informações principais, RSVP e Pix', () => {
    render(<InvitationSite />);

    expect(screen.getByRole('heading', { name: /diana faz 1 ano/i })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: /castelo rosado do convite real/i })).toBeInTheDocument();
    expect(screen.getAllByText(/11 de outubro/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/13 horas/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/est\. padre roser, 765/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('heading', { name: /confirme sua presença/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /presentes via pix/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /copiar chave pix/i })).toBeInTheDocument();
  });

  it('confirma presença com dados mínimos', () => {
    render(<InvitationSite />);

    fireEvent.change(screen.getByLabelText(/seu nome/i), { target: { value: 'Família Reis' } });
    fireEvent.change(screen.getByLabelText(/telefone/i), { target: { value: '(11) 99999-0000' } });
    fireEvent.click(screen.getByRole('button', { name: /confirmar presença/i }));

    expect(screen.getByText(/presença registrada/i)).toBeInTheDocument();
    expect(screen.getByText(/família reis/i)).toBeInTheDocument();
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
