import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import HomePage from '@/app/page';

describe('GuiaMove Hub', () => {
  it('renders GuiaMove brand, @dansouza.move signature, and Wave 1 tool links', () => {
    render(<HomePage />);
    expect(screen.getByText('Guia')).toBeInTheDocument();
    expect(screen.getByText('Move')).toBeInTheDocument();
    expect(screen.getAllByText(/@dansouza\.move/i).length).toBeGreaterThan(0);

    const timerLink = screen.getByRole('link', { name: /temporizador/i });
    expect(timerLink).toHaveAttribute('href', '/temporizador');

    const thermoLink = screen.getByRole('link', { name: /termômetro/i });
    expect(thermoLink).toHaveAttribute('href', '/termometro');

    const rotinasLink = screen.getByRole('link', { name: /rotinas/i });
    expect(rotinasLink).toHaveAttribute('href', '/rotinas');

    const seqLink = screen.getByRole('link', { name: /sequenciamento/i });
    expect(seqLink).toHaveAttribute('href', '/sequenciamento');
  });
});
