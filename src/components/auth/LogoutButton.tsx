"use client";

import { useState } from 'react';

export function LogoutButton() {
  const [isLoading, setIsLoading] = useState(false);

  async function handleLogout() {
    setIsLoading(true);

    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
      });
    } finally {
      window.location.href = '/login';
    }
  }

  return (
    <button
      className="rounded-full border border-[#df7894]/25 px-5 py-3 font-bold text-[#c76a85] transition hover:bg-[#fff0f4] disabled:cursor-not-allowed disabled:opacity-70"
      type="button"
      onClick={handleLogout}
      disabled={isLoading}
    >
      {isLoading ? 'Saindo...' : 'Sair'}
    </button>
  );
}
