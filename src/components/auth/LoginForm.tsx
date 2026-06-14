"use client";

import { FormEvent, useState } from 'react';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const body = await response.json();

      if (!response.ok || !body.ok) {
        setError(body.message ?? 'Não foi possível entrar agora.');
        return;
      }

      window.location.href = body.redirectTo ?? '/dashboard';
    } catch {
      setError('Não foi possível entrar agora.');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
        <span>E-mail</span>
        <input
          className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="admin@familia.com"
        />
      </label>

      <label className="grid gap-2 text-sm font-semibold text-[#8b5f6b]">
        <span>Senha</span>
        <input
          className="rounded-2xl border border-[#f1c4d0] bg-white px-4 py-3 outline-none transition focus:border-[#df7894] focus:ring-4 focus:ring-pink-100"
          type="password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Sua senha"
        />
      </label>

      {error && <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">{error}</p>}

      <button
        className="w-full rounded-full bg-[#df7894] px-5 py-3 font-bold text-white transition hover:brightness-105 disabled:cursor-not-allowed disabled:opacity-70"
        type="submit"
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Entrando...' : 'Entrar na dashboard'}
      </button>
    </form>
  );
}
