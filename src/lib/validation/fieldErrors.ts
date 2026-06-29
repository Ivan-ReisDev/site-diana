import type { ZodError } from 'zod';

/**
 * Converte um ZodError no mapa de erros por campo de topo (path[0]),
 * mantendo a primeira mensagem encontrada para cada campo.
 */
export function toFieldErrors(error: ZodError): Record<string, string> {
  const result: Record<string, string> = {};

  for (const issue of error.issues) {
    const key = issue.path[0];
    if (key === undefined) continue;
    const name = String(key);
    if (!(name in result)) {
      result[name] = issue.message;
    }
  }

  return result;
}
