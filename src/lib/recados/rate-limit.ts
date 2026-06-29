export type RateLimitConfig = {
  limit: number;
  windowMs: number;
};

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
};

const defaultConfig: RateLimitConfig = {
  limit: 5,
  windowMs: 10 * 60 * 1000,
};

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return fallback;
  }
  return Math.floor(parsed);
}

export function resolveRateLimitConfig(env: NodeJS.ProcessEnv = process.env): RateLimitConfig {
  return {
    limit: parsePositiveInt(env.RECADO_RATE_LIMIT, defaultConfig.limit),
    windowMs:
      parsePositiveInt(env.RECADO_RATE_WINDOW_MINUTES, defaultConfig.windowMs / 60_000) *
      60_000,
  };
}

export type RateLimiter = {
  check(key: string): RateLimitResult;
  reset(key: string): void;
};

export function createInMemoryRateLimiter(config: RateLimitConfig): RateLimiter {
  const timestamps = new Map<string, number[]>();

  function check(key: string): RateLimitResult {
    const now = Date.now();
    const since = now - config.windowMs;
    const current = (timestamps.get(key) ?? []).filter((entry) => entry > since);

    if (current.length >= config.limit) {
      timestamps.set(key, current);
      return { allowed: false, remaining: 0 };
    }

    current.push(now);
    timestamps.set(key, current);

    return {
      allowed: true,
      remaining: Math.max(0, config.limit - current.length),
    };
  }

  function reset(key: string) {
    timestamps.delete(key);
  }

  return { check, reset };
}

let cachedLimiter: { config: RateLimitConfig; limiter: RateLimiter } | null = null;

export function createRecadoRateLimiter(env: NodeJS.ProcessEnv = process.env): RateLimiter {
  const config = resolveRateLimitConfig(env);

  if (!cachedLimiter || cachedLimiter.config.limit !== config.limit || cachedLimiter.config.windowMs !== config.windowMs) {
    cachedLimiter = {
      config,
      limiter: createInMemoryRateLimiter(config),
    };
  }

  return cachedLimiter.limiter;
}
