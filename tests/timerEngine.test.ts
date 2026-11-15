import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createTimerEngine, type TimerSnapshot } from '@/lib/temporizador/timerEngine';
import { soundEngine } from '@/lib/temporizador/soundEngine';

describe('timerEngine & soundEngine', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('configures 10s per chip and starts with 1000ms anticipation before counting', () => {
    const snapshots: TimerSnapshot[] = [];
    const engine = createTimerEngine((s) => snapshots.push(s));

    engine.configure(20);
    expect(snapshots.at(-1)?.totalChips).toBe(2);

    engine.start();
    expect(snapshots.at(-1)?.status).toBe('approaching');
    expect(snapshots.at(-1)?.avatarPhase).toBe('anticipation');
    expect(snapshots.at(-1)?.remainingSeconds).toBe(20);

    vi.advanceTimersByTime(1000);
    expect(snapshots.at(-1)?.status).toBe('running');

    engine.destroy();
  });

  it('cycles mouth_open -> bite -> chewing within 1000ms during countdown', () => {
    const snapshots: TimerSnapshot[] = [];
    const engine = createTimerEngine((s) => snapshots.push(s));

    engine.configure(10);
    engine.start();
    vi.advanceTimersByTime(1000); // finish initial 1s approach

    const phases: string[] = [];
    for (let i = 0; i < 10; i++) {
      vi.advanceTimersByTime(100);
      phases.push(snapshots.at(-1)!.avatarPhase);
    }

    expect(phases).toContain('mouth_open');
    expect(phases).toContain('bite');
    expect(phases).toContain('chewing');

    engine.destroy();
  });

  it('enters 1000ms approaching phase when transitioning to next chip at 10s and finishes with celebration', () => {
    const snapshots: TimerSnapshot[] = [];
    const engine = createTimerEngine((s) => snapshots.push(s));

    engine.configure(20);
    engine.start();
    vi.advanceTimersByTime(1000); // approach chip 0
    vi.advanceTimersByTime(10000); // finish chip 0

    expect(snapshots.at(-1)?.status).toBe('approaching');
    expect(snapshots.at(-1)?.avatarPhase).toBe('anticipation');
    expect(snapshots.at(-1)?.activeChipIndex).toBe(1);

    vi.advanceTimersByTime(1000); // approach chip 1
    vi.advanceTimersByTime(10000); // finish chip 1

    expect(snapshots.at(-1)?.status).toBe('finished');
    expect(snapshots.at(-1)?.avatarPhase).toBe('celebration');

    engine.destroy();
  });

  it('soundEngine.init does not throw when AudioContext is missing or rejects', () => {
    expect(() => soundEngine.init()).not.toThrow();
  });
});
