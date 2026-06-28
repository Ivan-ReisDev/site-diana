import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { BackgroundMusic } from './BackgroundMusic';

describe('BackgroundMusic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('renderiza o elemento áudio oculto com loop e preload="none"', () => {
    render(<BackgroundMusic />);

    const audio = document.querySelector('audio');
    expect(audio).toBeInTheDocument();
    expect(audio).toHaveAttribute('loop');
    expect(audio).toHaveAttribute('preload', 'none');
    expect(audio).toHaveAttribute('src', '/musica-convite.mp3');
  });

  it('botão renderiza com aria-label dinâmico e aria-pressed', () => {
    render(<BackgroundMusic />);

    const button = screen.getByRole('button');
    expect(button).toHaveAttribute('aria-label', 'Ligar música');
    expect(button).toHaveAttribute('aria-pressed', 'false');
  });

  it('clicar no botão liga e desliga a música, alternando ícone', async () => {
    render(<BackgroundMusic />);

    const button = screen.getByRole('button', { name: /ligar música/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /desligar música/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true');

    fireEvent.click(screen.getByRole('button', { name: /desligar música/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /ligar música/i })).toBeInTheDocument();
    });

    expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'false');
  });
});
