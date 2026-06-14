import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import { LoginForm } from './LoginForm';

describe('LoginForm', () => {
  it('renderiza campos de e-mail e senha', () => {
    render(<LoginForm />);

    expect(screen.getByLabelText(/e-mail/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/senha/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /entrar na dashboard/i })).toBeInTheDocument();
  });
});
