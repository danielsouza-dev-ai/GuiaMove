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
});
