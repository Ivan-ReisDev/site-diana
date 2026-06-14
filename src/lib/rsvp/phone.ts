export function normalizePhone(phone: string) {
  const digits = phone.replace(/\D/g, '');

  if (digits.length < 10 || digits.length > 15) {
    throw new Error('Telefone inválido.');
  }

  return digits;
}
