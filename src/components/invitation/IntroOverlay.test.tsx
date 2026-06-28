import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { IntroOverlay } from './IntroOverlay';

afterEach(() => {
  cleanup();
});

async function clickStartAndWaitForVideo() {
  await act(async () => {
    fireEvent.click(screen.getByRole('button', { name: /abrir o vídeo do convite/i }));
  });
  await waitFor(() => {
    expect(screen.getByLabelText(/Vídeo do convite/i)).toBeInTheDocument();
  });
}

describe('IntroOverlay', () => {
  it('C1: etapa invite renderiza a mensagem da Convocação Real e o botão de início', () => {
    render(<IntroOverlay onComplete={() => {}} inviteMessage="Mensagem de teste de convocação" />);

    expect(screen.getByText(/Mensagem de teste de convocação/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /abrir o vídeo do convite/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Convocação Real/i)).toBeInTheDocument();
  });

  it('C2: clicar em iniciar mostra a etapa de vídeo com botão Pular', async () => {
    render(<IntroOverlay onComplete={() => {}} videoSrc="/convite-video.mp4" />);

    await clickStartAndWaitForVideo();

    expect(screen.getAllByRole('button', { name: /pular vídeo/i })[0]).toBeInTheDocument();
    expect(
      screen.getAllByRole('button', { name: /silenciar vídeo|ativar som do vídeo/i })[0]
    ).toBeInTheDocument();
  });

  it('C3: onEnded do vídeo avança para a etapa final com Confirmar Presença', async () => {
    render(<IntroOverlay onComplete={() => {}} videoSrc="/convite-video.mp4" />);

    await clickStartAndWaitForVideo();

    const video = screen.getByLabelText(/Vídeo do convite/i);
    await act(async () => {
      fireEvent.ended(video);
    });
    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /confirmar presença/i })
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Convocação Real/i)).toBeInTheDocument();
  });

  it('C4: clicar em Pular avança direto para a etapa final', async () => {
    render(<IntroOverlay onComplete={() => {}} videoSrc="/convite-video.mp4" />);

    await clickStartAndWaitForVideo();
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /pular vídeo/i })[0]);
    });
    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: /confirmar presença/i })
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
  });

  it('C5: clicar em Confirmar Presença chama onComplete', async () => {
    const onComplete = vi.fn();
    render(<IntroOverlay onComplete={onComplete} videoSrc="/convite-video.mp4" />);

    await clickStartAndWaitForVideo();
    await act(async () => {
      fireEvent.click(screen.getAllByRole('button', { name: /pular vídeo/i })[0]);
    });
    await waitFor(
      () => {
        expect(
          screen.getByRole('button', { name: /confirmar presença/i })
        ).toBeInTheDocument();
      },
      { timeout: 1500 }
    );
    await act(async () => {
      fireEvent.click(screen.getByRole('button', { name: /confirmar presença/i }));
    });

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('C6: onError do vídeo mantém caminho visível para a etapa final', async () => {
    render(<IntroOverlay onComplete={() => {}} videoSrc="/convite-video.mp4" />);

    await clickStartAndWaitForVideo();

    const video = screen.getByLabelText(/Vídeo do convite/i);
    await act(async () => {
      fireEvent.error(video);
    });

    await waitFor(() => {
      expect(
        screen.getByRole('button', { name: /avançar sem assistir o vídeo/i })
      ).toBeInTheDocument();
    });
  });

  it('C7: toggle de som alterna aria-pressed', async () => {
    render(<IntroOverlay onComplete={() => {}} videoSrc="/convite-video.mp4" />);

    await clickStartAndWaitForVideo();

    const soundButton = screen.getAllByRole('button', { name: /silenciar vídeo/i })[0];
    expect(soundButton).toHaveAttribute('aria-pressed', 'true');

    await act(async () => {
      fireEvent.click(soundButton);
    });

    const newSoundButton = screen.getAllByRole('button', { name: /ativar som do vídeo/i })[0];
    expect(newSoundButton).toHaveAttribute('aria-pressed', 'false');
  });
});
