import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Sidebar } from './Sidebar';

type MockState = { pathname: string };

const mockState: MockState = { pathname: '/dashboard' };

vi.mock('next/navigation', () => ({
  usePathname: () => mockState.pathname,
}));

afterEach(() => {
  mockState.pathname = '/dashboard';
});

describe('Sidebar', () => {
  const labels: Array<{ label: string; href: string }> = [
    { label: 'Visão geral', href: '/dashboard' },
    { label: 'Cadastro manual', href: '/dashboard/cadastro-manual' },
    { label: 'Lista de confirmações', href: '/dashboard/confirmacoes' },
    { label: 'Mural de recados', href: '/dashboard/mural' },
  ];

  function activeLabels() {
    return screen
      .getAllByRole('link')
      .filter((link) => link.getAttribute('aria-current') === 'page')
      .map((link) => link.textContent);
  }

  it.each([
    {
      pathname: '/dashboard',
      expected: 'Visão geral',
      description: 'raiz do dashboard',
    },
    {
      pathname: '/dashboard/cadastro-manual',
      expected: 'Cadastro manual',
      description: 'rota de cadastro manual',
    },
    {
      pathname: '/dashboard/confirmacoes',
      expected: 'Lista de confirmações',
      description: 'rota de confirmações sem query',
    },
    {
      pathname: '/dashboard/confirmacoes',
      expected: 'Lista de confirmações',
      description: 'rota de confirmações permanece ativa com query de filtro',
    },
    {
      pathname: '/dashboard/mural',
      expected: 'Mural de recados',
      description: 'rota do mural',
    },
  ])('marca apenas o item correspondente em $description', ({ pathname, expected }) => {
    mockState.pathname = pathname;

    render(<Sidebar />);

    const active = activeLabels();
    expect(active).toEqual([expected]);

    labels
      .filter((link) => link.label !== expected)
      .forEach((link) => {
        const item = screen.getByRole('link', { name: link.label });
        expect(item).not.toHaveAttribute('aria-current');
      });
  });

  it('não destaca item de Visão geral quando estiver em uma subrota', () => {
    mockState.pathname = '/dashboard/cadastro-manual';

    render(<Sidebar />);

    const overview = screen.getByRole('link', { name: 'Visão geral' });
    expect(overview).not.toHaveAttribute('aria-current');
    expect(screen.getByRole('link', { name: 'Cadastro manual' })).toHaveAttribute('aria-current', 'page');
  });

  it('renderiza todos os 4 itens de navegação como links', () => {
    render(<Sidebar />);

    labels.forEach((link) => {
      const item = screen.getByRole('link', { name: link.label });
      expect(item).toHaveAttribute('href', link.href);
    });
  });
});