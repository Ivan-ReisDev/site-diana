import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { RsvpSummary } from '@/lib/rsvp/service';

import { RsvpEditForm } from './RsvpEditForm';

const row: RsvpSummary = {
  id: 'r1',
  name: 'Maria Silva',
  phone: '(21) 99999-0000',
  attendance: 'sim',
  adults: 1,
  children: 1,
  total: 2,
  adultsList: [{ name: 'Maria Silva' }],
  childrenList: [{ name: 'João Silva', age: 4 }],
  createdAt: new Date('2026-01-01T10:00:00.000Z'),
  updatedAt: new Date('2026-01-01T10:00:00.000Z'),
};

describe('RsvpEditForm', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('renderiza pré-preenchido a partir da linha', () => {
    render(<RsvpEditForm row={row} onSaved={vi.fn()} onCancel={vi.fn()} />);

    expect(screen.getByLabelText('Nome completo')).toHaveValue('Maria Silva');
    expect(screen.getByLabelText('Telefone')).toHaveValue('(21) 99999-0000');
    expect(screen.getByDisplayValue('João Silva')).toBeInTheDocument();
  });

  it('bloqueia o submit quando o nome fica vazio', async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal('fetch', fetchMock);
    const onSaved = vi.fn();

    render(<RsvpEditForm row={row} onSaved={onSaved} onCancel={vi.fn()} />);

    fireEvent.change(screen.getByLabelText('Nome completo'), { target: { value: '' } });
    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(screen.getAllByText('Informe seu nome completo.').length).toBeGreaterThan(0),
    );
    expect(fetchMock).not.toHaveBeenCalled();
    expect(onSaved).not.toHaveBeenCalled();
  });

  it('envia PATCH com o corpo válido ao salvar', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ ok: true, rsvp: { ...row }, message: 'Confirmação atualizada.' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const onSaved = vi.fn();

    render(<RsvpEditForm row={row} onSaved={onSaved} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledTimes(1));
    expect(fetchMock).toHaveBeenCalledWith(
      '/api/rsvp/r1',
      expect.objectContaining({ method: 'PATCH' }),
    );
    await waitFor(() => expect(onSaved).toHaveBeenCalledTimes(1));
  });

  it('exibe conflito de telefone (409) sem chamar onSaved', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: async () => ({ ok: false, message: 'Já existe uma confirmação com esse telefone.' }),
    });
    vi.stubGlobal('fetch', fetchMock);
    const onSaved = vi.fn();

    render(<RsvpEditForm row={row} onSaved={onSaved} onCancel={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /salvar/i }));

    await waitFor(() =>
      expect(screen.getAllByText(/já existe uma confirmação com esse telefone/i).length).toBeGreaterThan(0),
    );
    expect(onSaved).not.toHaveBeenCalled();
  });
});
