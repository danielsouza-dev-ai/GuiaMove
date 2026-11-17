import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import RotinasPage from '@/app/rotinas/page';
import {
  DEFAULT_CARD_BANK,
  ROTINAS_STORAGE_KEY,
  loadRoutinesData,
} from '@/lib/rotinas/routinesConfig';

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

  it('uses updated ARASAAC IDs and filters saved cards smoothly in ChildOrderBuilder', () => {
    const expectedIds: Record<string, number> = {
      vaso: 16709,
      vestir: 37816,
      sabonete: 35729,
      toalha: 2566,
      banho: 26803,
      'guardar-brinquedos': 5514,
      brincar: 6537,
      escola: 36473,
    };

    for (const [id, arasaacId] of Object.entries(expectedIds)) {
      expect(DEFAULT_CARD_BANK.find((c) => c.id === id)?.arasaacId).toBe(
        arasaacId,
      );
    }

    // Legacy cached IDs in localStorage should auto-sync to updated pictograms
    localStorage.setItem(
      ROTINAS_STORAGE_KEY,
      JSON.stringify({
        cardBank: [{ id: 'guardar-brinquedos', label: 'Guardar os brinquedos', arasaacId: 34657 }],
      }),
    );
    const synced = loadRoutinesData();
    expect(synced.cardBank[0].arasaacId).toBe(5514);
    localStorage.clear();

    render(<RotinasPage />);
    fireEvent.click(
      screen.getByRole('button', { name: /criança escolhe a ordem/i }),
    );

    const filterInput = screen.getByLabelText(/filtrar cartões salvos/i);
    fireEvent.change(filterInput, { target: { value: 'escola' } });

    expect(
      screen.getByRole('button', { name: /ir para a escola/i }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole('button', { name: /escovar os dentes/i }),
    ).not.toBeInTheDocument();
  });

  it('persists child-order draft across reload and allows saving it as a fixed routine', () => {
    const firstRender = render(<RotinasPage />);
    fireEvent.click(
      screen.getByRole('button', { name: /criança escolhe a ordem/i }),
    );

    fireEvent.click(screen.getByRole('button', { name: /limpar seleção/i }));
    fireEvent.click(screen.getByRole('button', { name: /hora de comer/i }));
    fireEvent.click(screen.getByRole('button', { name: /tempo de brincar/i }));

    fireEvent.click(
      screen.getByRole('button', {
        name: /entregar para a criança escolher a ordem \(2\)/i,
      }),
    );

    // Child picks order
    fireEvent.click(screen.getByRole('button', { name: /tempo de brincar/i }));
    fireEvent.click(screen.getByRole('button', { name: /hora de comer/i }));

    // Simulate closing/reloading page
    firstRender.unmount();

    render(<RotinasPage />);
    fireEvent.click(
      screen.getByRole('button', { name: /criança escolhe a ordem/i }),
    );

    // Draft should restore directly to child_order with both cards ordered
    expect(screen.getByTestId('child-order-phase')).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /começar minha rotina! \(2 de 2\)/i }),
    ).toBeInTheDocument();

    // Save sequence as a fixed routine
    fireEvent.click(
      screen.getByRole('button', { name: /salvar nas rotinas fixas/i }),
    );
    fireEvent.change(
      screen.getByLabelText(/nome para salvar nas rotinas fixas/i),
      { target: { value: 'Rotina da Tarde' } },
    );
    fireEvent.click(screen.getByRole('button', { name: /^salvar$/i }));

    expect(
      screen.getByText(/sequência salva em rotinas fixas!/i),
    ).toBeInTheDocument();

    // Switch to Fixed Routines tab and verify it is listed
    fireEvent.click(screen.getByRole('button', { name: /rotinas fixas/i }));
    expect(screen.getByText('Rotina da Tarde')).toBeInTheDocument();
  });
});
