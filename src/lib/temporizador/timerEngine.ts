export type AvatarPhase =
  | 'anticipation'
  | 'mouth_open'
  | 'bite'
  | 'chewing'
  | 'celebration';

export type TimerStatus =
  | 'idle'
  | 'approaching'
  | 'running'
  | 'paused'
  | 'finished';

export interface TimerSnapshot {
  status: TimerStatus;
  totalSeconds: number;
  remainingSeconds: number;
  totalChips: number;
  activeChipIndex: number;
  chipProgress: number; // 0 to 1 within current 10s chip
  avatarPhase: AvatarPhase;
}

const SECONDS_PER_CHIP = 10;
const CHIP_DURATION_MS = SECONDS_PER_CHIP * 1000;
const APPROACH_DURATION_MS = 1000;
const TICK_MS = 100;

export function createTimerEngine(onUpdate: (snap: TimerSnapshot) => void) {
  let totalSeconds = 60;
  let totalChips = 6;
  let status: TimerStatus = 'idle';
  let activeChipIndex = 0;
  let chipElapsedMs = 0;
  let approachElapsedMs = 0;
  let intervalId: ReturnType<typeof setInterval> | null = null;

  function computeAvatarPhase(): AvatarPhase {
    if (status === 'finished') return 'celebration';
    if (status === 'approaching' || status === 'idle' || status === 'paused') {
      return 'anticipation';
    }
    const msInSecond = chipElapsedMs % 1000;
    if (msInSecond < 333) return 'mouth_open';
    if (msInSecond < 666) return 'bite';
    return 'chewing';
  }

  function emit() {
    const totalElapsedSeconds =
      activeChipIndex * SECONDS_PER_CHIP + Math.floor(chipElapsedMs / 1000);
    const remainingSeconds = Math.max(0, totalSeconds - totalElapsedSeconds);
    const chipProgress = Math.min(1, chipElapsedMs / CHIP_DURATION_MS);

    onUpdate({
      status,
      totalSeconds,
      remainingSeconds,
      totalChips,
      activeChipIndex,
      chipProgress,
      avatarPhase: computeAvatarPhase(),
    });
  }

  function clearTicker() {
    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }
  }

  function tick() {
    if (status === 'approaching') {
      approachElapsedMs += TICK_MS;
      if (approachElapsedMs >= APPROACH_DURATION_MS) {
        approachElapsedMs = 0;
        status = 'running';
      }
      emit();
      return;
    }

    if (status === 'running') {
      chipElapsedMs += TICK_MS;
      const chipSecondsLimit =
        activeChipIndex === totalChips - 1
          ? Math.max(1, totalSeconds - activeChipIndex * SECONDS_PER_CHIP) * 1000
          : CHIP_DURATION_MS;

      if (chipElapsedMs >= chipSecondsLimit) {
        if (activeChipIndex < totalChips - 1) {
          activeChipIndex += 1;
          chipElapsedMs = 0;
          approachElapsedMs = 0;
          status = 'approaching';
        } else {
          chipElapsedMs = chipSecondsLimit;
          status = 'finished';
          clearTicker();
        }
      }
      emit();
    }
  }

  function configure(seconds: number) {
    clearTicker();
    totalSeconds = Math.max(10, Math.round(seconds));
    totalChips = Math.max(1, Math.ceil(totalSeconds / SECONDS_PER_CHIP));
    activeChipIndex = 0;
    chipElapsedMs = 0;
    approachElapsedMs = 0;
    status = 'idle';
    emit();
  }

  function start() {
    clearTicker();
    activeChipIndex = 0;
    chipElapsedMs = 0;
    approachElapsedMs = 0;
    status = 'approaching';
    emit();
    intervalId = setInterval(tick, TICK_MS);
  }

  function pause() {
    if (status === 'running' || status === 'approaching') {
      clearTicker();
      status = 'paused';
      emit();
    }
  }

  function resume() {
    if (status === 'paused') {
      status = 'running';
      emit();
      intervalId = setInterval(tick, TICK_MS);
    }
  }

  function reset() {
    configure(totalSeconds);
  }

  function destroy() {
    clearTicker();
  }

  return {
    configure,
    start,
    pause,
    resume,
    reset,
    destroy,
  };
}
