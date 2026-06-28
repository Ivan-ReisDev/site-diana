import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useBackgroundMusic } from './useBackgroundMusic';

function createMockAudio() {
  const audio = {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    volume: 0,
    loop: false,
  } as unknown as HTMLAudioElement;
  return { current: audio };
}

describe('useBackgroundMusic', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    sessionStorage.clear();
  });

  it('C1: não chama play() durante a montagem', () => {
    const audioRef = createMockAudio();
    renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    expect(audioRef.current.play).not.toHaveBeenCalled();
    expect(audioRef.current.pause).not.toHaveBeenCalled();
  });

  it('C2: chama play() no primeiro gesto global', async () => {
    const audioRef = createMockAudio();
    renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await waitFor(() => {
      expect(audioRef.current.play).toHaveBeenCalledTimes(1);
    });
  });

  it('C8: não re-dispara play() em gestos subsequentes', async () => {
    const audioRef = createMockAudio();
    renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      window.dispatchEvent(new Event('click'));
    });
    act(() => {
      window.dispatchEvent(new Event('keydown'));
    });
    act(() => {
      window.dispatchEvent(new Event('touchstart'));
    });

    await waitFor(() => {
      expect(audioRef.current.play).toHaveBeenCalledTimes(1);
    });
  });

  it('C4/C5: toggle() alterna play/pause e atualiza isPlaying', async () => {
    const audioRef = createMockAudio();
    const { result } = renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      result.current.toggle();
    });

    expect(audioRef.current.play).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle();
    });

    expect(audioRef.current.pause).toHaveBeenCalledTimes(1);
    expect(result.current.isPlaying).toBe(false);
  });

  it('C3: respeita sessionStorage bgMusic="off" no primeiro gesto', async () => {
    sessionStorage.setItem('bgMusic', 'off');
    const audioRef = createMockAudio();
    renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(audioRef.current.play).not.toHaveBeenCalled();
  });

  it('grava "on" e "off" no sessionStorage ao alternar', () => {
    const audioRef = createMockAudio();
    const { result } = renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      result.current.toggle();
    });
    expect(sessionStorage.getItem('bgMusic')).toBe('on');

    act(() => {
      result.current.toggle();
    });
    expect(sessionStorage.getItem('bgMusic')).toBe('off');
  });

  it('C6: após desligar manualmente, novos gestos não religam automaticamente', async () => {
    const audioRef = createMockAudio();
    const { result } = renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isPlaying).toBe(true);

    act(() => {
      result.current.toggle();
    });
    expect(result.current.isPlaying).toBe(false);

    vi.clearAllMocks();

    act(() => {
      window.dispatchEvent(new Event('scroll'));
    });

    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(audioRef.current.play).not.toHaveBeenCalled();
    expect(result.current.isPlaying).toBe(false);
  });

  it('falha silenciosamente quando play() rejeita', async () => {
    const audioRef = createMockAudio();
    audioRef.current.play = vi.fn().mockRejectedValue(new Error('autoplay blocked'));

    const { result } = renderHook(() => useBackgroundMusic(audioRef, { volume: 0.3 }));

    act(() => {
      result.current.toggle();
    });

    await waitFor(() => {
      expect(audioRef.current.play).toHaveBeenCalledTimes(1);
    });

    expect(result.current.isPlaying).toBe(false);
  });
});
