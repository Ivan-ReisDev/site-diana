import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { createInMemoryRateLimiter } from './rate-limit';

describe('createInMemoryRateLimiter', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('bloqueia após N envios na janela por dispositivo', () => {
    const limiter = createInMemoryRateLimiter({ limit: 3, windowMs: 60_000 });
    const key = 'device-1';

    expect(limiter.check(key)).toEqual({ allowed: true, remaining: 2 });
    expect(limiter.check(key)).toEqual({ allowed: true, remaining: 1 });
    expect(limiter.check(key)).toEqual({ allowed: true, remaining: 0 });
    expect(limiter.check(key)).toEqual({ allowed: false, remaining: 0 });
  });

  it('limites são independentes por dispositivo', () => {
    const limiter = createInMemoryRateLimiter({ limit: 1, windowMs: 60_000 });

    expect(limiter.check('device-1').allowed).toBe(true);
    expect(limiter.check('device-2').allowed).toBe(true);
    expect(limiter.check('device-1').allowed).toBe(false);
    expect(limiter.check('device-2').allowed).toBe(false);
  });

  it('libera após a janela passar', () => {
    const limiter = createInMemoryRateLimiter({ limit: 1, windowMs: 60_000 });
    const key = 'device-1';

    expect(limiter.check(key).allowed).toBe(true);
    expect(limiter.check(key).allowed).toBe(false);

    vi.advanceTimersByTime(60_001);

    expect(limiter.check(key).allowed).toBe(true);
  });

  it('reset limpa o estado de um dispositivo', () => {
    const limiter = createInMemoryRateLimiter({ limit: 1, windowMs: 60_000 });
    const key = 'device-1';

    expect(limiter.check(key).allowed).toBe(true);
    expect(limiter.check(key).allowed).toBe(false);

    limiter.reset(key);

    expect(limiter.check(key).allowed).toBe(true);
  });
})
