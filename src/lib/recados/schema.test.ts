import { describe, expect, it } from 'vitest';

import { recadoInputSchema } from './schema';

describe('recadoInputSchema', () => {
  it('aceita payload válido', () => {
    const result = recadoInputSchema.parse({
      nome: 'Tia Ana',
      mensagem: 'Felicidades para a princesa Diana!',
    });

    expect(result).toEqual({
      nome: 'Tia Ana',
      mensagem: 'Felicidades para a princesa Diana!',
    });
  });

  it('faz trim nos campos', () => {
    const result = recadoInputSchema.parse({
      nome: '   Tia Ana   ',
      mensagem: '  Muito carinho!  ',
    });

    expect(result.nome).toBe('Tia Ana');
    expect(result.mensagem).toBe('Muito carinho!');
  });

  it('rejeita nome vazio', () => {
    const result = recadoInputSchema.safeParse({
      nome: '   ',
      mensagem: 'Mensagem',
    });

    expect(result.success).toBe(false);
  });

  it('rejeita mensagem vazia', () => {
    const result = recadoInputSchema.safeParse({
      nome: 'Tia Ana',
      mensagem: '   ',
    });

    expect(result.success).toBe(false);
  });

  it('rejeita mensagem acima de 240 caracteres', () => {
    const result = recadoInputSchema.safeParse({
      nome: 'Tia Ana',
      mensagem: 'x'.repeat(241),
    });

    expect(result.success).toBe(false);
  });

  it('aceita mensagem com exatamente 240 caracteres', () => {
    const result = recadoInputSchema.safeParse({
      nome: 'Tia Ana',
      mensagem: 'x'.repeat(240),
    });

    expect(result.success).toBe(true);
  });
})
