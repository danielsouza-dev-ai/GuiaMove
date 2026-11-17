import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import RotinasPage from '@/app/rotinas/page';

describe('Módulo de Rotinas & Primeiro/Depois', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('opens Rotina do Xixi, marks steps done with check, supports Voltar 1 passo and hold-on-completed-card to rewind', () => {
    vi.useFakeTimers();
    render(<RotinasPage />);

    expect(screen.getByText('Rotina do Xixi')).toBeInTheDocument();

    // Start Rotina do Xixi (first fixed routine card)
    const startBtns = screen.getAllByRole('button', { name: /iniciar rotina/i });
    fireEvent.click(startBtns[0]);

    expect(screen.getByTestId('routine-player')).toBeInTheDocument();
    expect(screen.getByTestId('routine-progress-badge')).toHaveTextContent('0 de 6');
    expect(screen.getByTestId('routine-step-0')).toHaveAttribute('data-status', 'current');

    // Complete step 0 -> advances to step 1
    fireEvent.click(screen.getByTestId('complete-active-step-btn'));
    expect(screen.getByTestId('routine-progress-badge')).toHaveTextContent('1 de 6');
    expect(screen.getByTestId('routine-step-0')).toHaveAttribute('data-status', 'completed');
    expect(screen.getByTestId('routine-step-1')).toHaveAttribute('data-status', 'current');

    // Complete step 1 -> advances to step 2
    fireEvent.click(screen.getByTestId('complete-active-step-btn'));
    expect(screen.getByTestId('routine-progress-badge')).toHaveTextContent('2 de 6');

    // Immediate undo via "Voltar 1 passo"
    fireEvent.click(screen.getByRole('button', { name: /voltar 1 passo/i }));
    expect(screen.getByTestId('routine-progress-badge')).toHaveTextContent('1 de 6');
    expect(screen.getByTestId('routine-step-1')).toHaveAttribute('data-status', 'current');

    // Hold completed step 0 for 900ms to jump back to step 0
    const completedStep0 = screen.getByTestId('routine-step-0');
    fireEvent.pointerDown(completedStep0);
    act(() => {
      vi.advanceTimersByTime(900);
    });

    expect(screen.getByTestId('routine-progress-badge')).toHaveTextContent('0 de 6');
    expect(screen.getByTestId('routine-step-0')).toHaveAttribute('data-status', 'current');
  });

  it('allows parent to filter cards and child to pick chronological order before starting', () => {
    render(<RotinasPage />);

    fireEvent.click(screen.getByRole('button', { name: /criança escolhe a ordem/i }));
    expect(screen.getByTestId('parent-filter-phase')).toBeInTheDocument();

    // Clear default selection and select exactly 2 specific cards
    fireEvent.click(screen.getByRole('button', { name: /limpar seleção/i }));
    fireEvent.click(screen.getByRole('button', { name: /hora de comer/i }));
    fireEvent.click(screen.getByRole('button', { name: /tempo de brincar/i }));

    fireEvent.click(
      screen.getByRole('button', {
        name: /entregar para a criança escolher a ordem \(2\)/i,
      }),
    );

    expect(screen.getByTestId('child-order-phase')).toBeInTheDocument();

    // Child picks "Tempo de brincar" first, then "Hora de comer" second
    fireEvent.click(screen.getByRole('button', { name: /tempo de brincar/i }));
    fireEvent.click(screen.getByRole('button', { name: /hora de comer/i }));

    fireEvent.click(
      screen.getByRole('button', { name: /começar minha rotina!/i }),
    );

    expect(screen.getByTestId('routine-player')).toBeInTheDocument();
    expect(screen.getByTestId('routine-step-0')).toHaveTextContent(
      /tempo de brincar/i,
    );
    expect(screen.getByTestId('routine-step-1')).toHaveTextContent(
      /hora de comer/i,
    );
  });

  it('supports First/Then board completion and undo/reset on accidental tap', () => {
    render(<RotinasPage />);

    fireEvent.click(screen.getByRole('button', { name: /primeiro \/ depois/i }));
    expect(screen.getByTestId('first-then-board')).toBeInTheDocument();
    expect(screen.getByTestId('first-then-first-card')).toHaveAttribute(
      'data-done',
      'false',
    );
    expect(screen.getByTestId('first-then-then-card')).toHaveAttribute(
      'data-unlocked',
      'false',
    );

    fireEvent.click(screen.getByRole('button', { name: /concluir primeiro/i }));
    expect(screen.getByTestId('first-then-first-card')).toHaveAttribute(
      'data-done',
      'true',
    );
    expect(screen.getByTestId('first-then-then-card')).toHaveAttribute(
      'data-unlocked',
      'true',
    );

    fireEvent.click(screen.getByRole('button', { name: /desfazer \/ resetar/i }));
    expect(screen.getByTestId('first-then-first-card')).toHaveAttribute(
      'data-done',
      'false',
    );
  });
});
