"use client";

import { Menu, X } from 'lucide-react';
import { useState } from 'react';

import { LogoutButton } from '@/components/auth/LogoutButton';

const NAV_LINKS = [
  { href: '#visao-geral', label: 'Visão geral' },
  { href: '#cadastro-manual', label: 'Cadastro manual' },
  { href: '#confirmacoes', label: 'Lista de confirmações' },
];

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(false);

  function close() {
    setIsOpen(false);
  }

  return (
    <>
      <div className="flex items-center justify-between bg-white/80 px-5 py-4 shadow-[0_8px_24px_rgba(185,75,105,.08)] lg:hidden">
        <p className="font-serif text-xl font-black text-[#b85f78]">Diana — Painel</p>
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Abrir menu"
          aria-expanded={isOpen}
          aria-controls="dashboard-sidebar"
          className="rounded-full border border-[#df7894]/25 p-2 text-[#c76a85] transition hover:bg-[#fff0f4]"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden" onClick={close} aria-hidden="true" />
      )}

      <aside
        id="dashboard-sidebar"
        className={`fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white shadow-[0_18px_60px_rgba(185,75,105,.12)] transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:translate-x-0 lg:shadow-none lg:border-r lg:border-[#f1c4d0]/60 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between px-6 py-6 lg:py-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[.3em] text-[#d36f8a]">Painel</p>
            <p className="mt-1 font-serif text-2xl font-black text-[#b85f78]">Diana 🎀</p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar menu"
            className="rounded-full border border-[#df7894]/25 p-2 text-[#c76a85] transition hover:bg-[#fff0f4] lg:hidden"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <nav aria-label="Navegação do painel" className="flex flex-1 flex-col gap-1 px-4">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={close}
              className="rounded-2xl px-4 py-3 font-semibold text-[#8b5f6b] transition hover:bg-[#fff0f4] hover:text-[#c76a85]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="px-4 pb-6 pt-4">
          <LogoutButton />
        </div>
      </aside>
    </>
  );
}
