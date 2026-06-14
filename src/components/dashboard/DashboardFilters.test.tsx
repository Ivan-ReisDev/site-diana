import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { DashboardFilters } from './DashboardFilters';

describe('DashboardFilters', () => {
  it('renderiza campo de busca e seletor de status', () => {
    render(<DashboardFilters q="Reis" status="yes" />);

    expect(screen.getByLabelText(/buscar por nome ou telefone/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/status de presença/i)).toBeInTheDocument();
    expect(screen.getByDisplayValue('Reis')).toBeInTheDocument();
  });
});
