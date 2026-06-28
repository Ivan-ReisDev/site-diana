import { act, renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { useIntroSequence } from './useIntroSequence';

function createMockVideo() {
  return {
    play: vi.fn().mockResolvedValue(undefined),
    pause: vi.fn(),
    muted: false,
    currentTime: 0,
    duration: 30,
  } as unknown as HTMLVideoElement;
}

describe('useIntroSequence', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  it('C1: inicia na etapa invite', () => {
    const { result } = renderHook(() => useIntroSequence());

    expect(result.current.stage).toBe('invite');
    expect(result.current.videoStatus).toBe('idle');
    expect(result.current.soundOn).toBe(true);
  });

  it('C2: start() avança de invite para video e dispara play com som', async () => {
    const video = createMockVideo();
    const { result } = renderHook(() => useIntroSequence());
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    expect(result.current.stage).toBe('video');
    expect(result.current.videoStatus).toBe('playing');
    expect(video.play).toHaveBeenCalledTimes(1);
    expect(video.muted).toBe(false);
  });

  it('C3: falha de play mantém caminho para a etapa final', async () => {
    const video = createMockVideo();
    video.play = vi.fn().mockRejectedValue(new Error('autoplay blocked'));
    const { result } = renderHook(() => useIntroSequence());
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    expect(result.current.stage).toBe('video');
    expect(result.current.videoStatus).toBe('error');

    act(() => {
      result.current.skip();
    });

    expect(result.current.stage).toBe('final');
  });

  it('C4: onVideoEnded avança para final', async () => {
    const video = createMockVideo();
    const { result } = renderHook(() => useIntroSequence());
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    act(() => {
      result.current.onVideoEnded();
    });

    expect(result.current.stage).toBe('final');
    expect(result.current.videoStatus).toBe('ended');
  });

  it('C5: skip() avança de video para final', async () => {
    const video = createMockVideo();
    const { result } = renderHook(() => useIntroSequence());
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    act(() => {
      result.current.skip();
    });

    expect(video.pause).toHaveBeenCalledTimes(1);
    expect(result.current.stage).toBe('final');
    expect(result.current.videoStatus).toBe('ended');
  });

  it('C6: onVideoError marca videoStatus como error', async () => {
    const video = createMockVideo();
    const { result } = renderHook(() => useIntroSequence());
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    act(() => {
      result.current.onVideoError();
    });

    expect(result.current.videoStatus).toBe('error');
    expect(result.current.stage).toBe('video');
  });

  it('C7: toggleSound alterna muted e soundOn', async () => {
    const video = createMockVideo();
    const { result } = renderHook(() => useIntroSequence());
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    expect(result.current.soundOn).toBe(true);
    expect(video.muted).toBe(false);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.soundOn).toBe(false);
    expect(video.muted).toBe(true);

    act(() => {
      result.current.toggleSound();
    });

    expect(result.current.soundOn).toBe(true);
    expect(video.muted).toBe(false);
  });

  it('C8: ações fora da etapa correta não alteram o estado', async () => {
    const { result } = renderHook(() => useIntroSequence());

    act(() => {
      result.current.skip();
    });
    expect(result.current.stage).toBe('invite');

    act(() => {
      result.current.onVideoEnded();
    });
    expect(result.current.stage).toBe('invite');

    act(() => {
      result.current.onVideoError();
    });
    expect(result.current.videoStatus).toBe('idle');
  });

  it('C9: som desligado por padrão é refletido no elemento de vídeo', async () => {
    const { result } = renderHook(() => useIntroSequence());
    const video = createMockVideo();
    video.muted = true;
    result.current.videoRef.current = video;

    await act(async () => {
      result.current.start();
    });

    expect(video.muted).toBe(false);
  });
});
