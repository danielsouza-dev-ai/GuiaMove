import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';
import { ParentalLock } from '@/components/shared/ParentalLock';

describe('shared components', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('ParentalLock does not unlock if pointerup happens before 2000ms', () => {
    const onUnlock = vi.fn();
    render(<ParentalLock onUnlock={onUnlock} label="Configurações" />);
    const btn = screen.getByRole('button', { name: /configurações/i });

    fireEvent.pointerDown(btn);
    act(() => {
      vi.advanceTimersByTime(1000);
    });
    fireEvent.pointerUp(btn);
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('ParentalLock unlocks after holding continuously for 2000ms', () => {
    const onUnlock = vi.fn();
    render(<ParentalLock onUnlock={onUnlock} label="Configurações" />);
    const btn = screen.getByRole('button', { name: /configurações/i });

    fireEvent.pointerDown(btn);
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(onUnlock).toHaveBeenCalledTimes(1);
  });

  it('ParentalLock cancels unlock on pointercancel', () => {
    const onUnlock = vi.fn();
    render(<ParentalLock onUnlock={onUnlock} label="Configurações" />);
    const btn = screen.getByRole('button', { name: /configurações/i });

    fireEvent.pointerDown(btn);
    act(() => {
      vi.advanceTimersByTime(1200);
    });
    fireEvent.pointerCancel(btn);
    act(() => {
      vi.advanceTimersByTime(1500);
    });

    expect(onUnlock).not.toHaveBeenCalled();
  });

  it('GuiaMoveHeader renders back link when backHref is provided', () => {
    render(<GuiaMoveHeader title="Temporizador" backHref="/" />);
    const link = screen.getByRole('link', { name: /voltar/i });
    expect(link).toHaveAttribute('href', '/');
    expect(screen.getByText('Temporizador')).toBeInTheDocument();
  });
});
