import { z } from 'zod';

/**
 * Remove tudo que não é dígito e limita a 11 dígitos (DDD + número).
 */
export function unmaskPhone(value: string): string {
  return value.replace(/\D/g, '').slice(0, 11);
}

/**
 * Aplica a máscara de telefone brasileiro de forma progressiva conforme o usuário digita.
 * - Celular (11 dígitos): (99) 99999-9999
 * - Fixo (10 dígitos):    (99) 9999-9999
 */
export function maskPhone(value: string): string {
  const digits = unmaskPhone(value);
  const len = digits.length;

  if (len === 0) return '';
  if (len <= 2) return `(${digits}`;
  if (len <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (len <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

/**
 * Considera válido um telefone brasileiro com DDD e 10 (fixo) ou 11 (celular) dígitos.
 */
export function isValidBrazilianPhone(value: string): boolean {
  const len = unmaskPhone(value).length;
  return len === 10 || len === 11;
}

/**
 * Schema zod compartilhado para telefone brasileiro. Aceita o valor mascarado
 * ou só dígitos; valida que há DDD + número (10 ou 11 dígitos).
 */
export const phoneSchema = z
  .string()
  .trim()
  .min(1, 'Preencha o telefone.')
  .refine(isValidBrazilianPhone, 'Informe um telefone válido com DDD.');
