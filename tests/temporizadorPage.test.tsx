import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import TemporizadorPage from '@/app/temporizador/page';

describe('Temporizador page (iPad Safari & positioning)', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
  });

  it('starts the timer immediately even when requestFullscreen is missing or rejects (iPad Safari)', () => {
    Object.defineProperty(document.documentElement, 'requestFullscreen', {
      value: () => Promise.reject(new Error('Not supported on iPad Safari')),
      configurable: true,
    });

    render(<TemporizadorPage />);

    const startBtn = screen.getByRole('button', { name: /iniciar/i });
    fireEvent.click(startBtn);

    expect(screen.getByTestId('timer-stage')).toBeInTheDocument();
    expect(screen.getByTestId('stage-avatar-wrapper')).toBeInTheDocument();
  });

  it('keeps avatar inside safe stage bounds on column 1 and advances horizontally with bites', () => {
    render(<TemporizadorPage />);
    fireEvent.click(screen.getByRole('button', { name: /iniciar/i }));

    const avatarWrapper = screen.getByTestId('stage-avatar-wrapper');
    const initialLeft = parseFloat(avatarWrapper.style.left || '0');
    expect(initialLeft).toBeGreaterThanOrEqual(0);

    // Advance past 1s approach + 5s of eating
    act(() => {
      vi.advanceTimersByTime(6000);
    });
    const progressedLeft = parseFloat(
      screen.getByTestId('stage-avatar-wrapper').style.left || '0',
    );
    expect(progressedLeft).toBeGreaterThan(initialLeft);
  });

  it('shows mobile holding instruction on Pausar / Sair and allows re-locking controls', () => {
    render(<TemporizadorPage />);
    fireEvent.click(screen.getByRole('button', { name: /iniciar/i }));

    const lockBtn = screen.getByRole('button', { name: /pausar \/ sair/i });
    fireEvent.pointerDown(lockBtn);

    expect(
      screen.getByText(/continue segurando por 2 segundos/i),
    ).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(2000);
    });

    const relockBtn = screen.getByRole('button', { name: /bloquear/i });
    expect(relockBtn).toBeInTheDocument();

    fireEvent.click(relockBtn);
    expect(
      screen.getByRole('button', { name: /pausar \/ sair/i }),
    ).toBeInTheDocument();
  });

  it('supports free time selection from 10 seconds to 60 minutes', () => {
    render(<TemporizadorPage />);

    const minsInput = screen.getByLabelText(/^minutos$/i);
    const secsInput = screen.getByLabelText(/^segundos$/i);

    fireEvent.change(minsInput, { target: { value: '0' } });
    fireEvent.change(secsInput, { target: { value: '5' } });
    expect(screen.getByTestId('selected-duration-badge')).toHaveTextContent('00:10');

    fireEvent.change(minsInput, { target: { value: '60' } });
    expect(screen.getByTestId('selected-duration-badge')).toHaveTextContent('60:00');
  });
});
