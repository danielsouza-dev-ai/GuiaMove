'use client';

import { useEffect, useRef, useState } from 'react';
import { Pause, Play, RotateCcw } from 'lucide-react';
import type { TimerSnapshot } from '@/lib/temporizador/timerEngine';
import type { ChildProfile } from '@/utils/storage';
import { CharacterAvatar } from './CharacterAvatar';
import { ChocolateRewardSvg, WavyChipSvg } from './FoodSprites';
import { ParentalLock } from '@/components/shared/ParentalLock';
import { BigActionButton } from '@/components/shared/BigActionButton';

interface TimerStageProps {
  snapshot: TimerSnapshot;
  profile: ChildProfile;
  onPause: () => void;
  onResume: () => void;
  onExit: () => void;
  onRestart: () => void;
}

function formatClock(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export function TimerStage({
  snapshot,
  profile,
  onPause,
  onResume,
  onExit,
  onRestart,
}: TimerStageProps) {
  const stageRef = useRef<HTMLDivElement | null>(null);
  const [stageWidth, setStageWidth] = useState(640);
  const [controlsUnlocked, setControlsUnlocked] = useState(false);

  useEffect(() => {
    const update = () => {
      if (stageRef.current?.clientWidth) {
        setStageWidth(stageRef.current.clientWidth);
      }
    };
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const avatarSize = stageWidth < 480 ? 68 : 88;
  const chipSize = stageWidth < 480 ? 52 : 64;
  const gap = 14;
  const safeLeftPadding = avatarSize + 12;
  const usableWidth = Math.max(chipSize + gap, stageWidth - safeLeftPadding - 16);
  const cols = Math.max(1, Math.min(6, Math.floor(usableWidth / (chipSize + gap))));

  const activeCol = snapshot.activeChipIndex % cols;
  const activeRow = Math.floor(snapshot.activeChipIndex / cols);

  const chipLeft = safeLeftPadding + activeCol * (chipSize + gap);
  const chipTop = 16 + activeRow * (chipSize + gap);

  // Progressive approach: character advances toward remaining edge of chip as bites increase
  const biteOffset =
    snapshot.status === 'approaching'
      ? 0
      : Math.round(snapshot.chipProgress * chipSize * 0.55);

  const avatarLeft = Math.max(0, chipLeft - avatarSize + 10 + biteOffset);
  const avatarTop = Math.max(0, chipTop + (chipSize - avatarSize) / 2);

  if (snapshot.status === 'finished') {
    return (
      <div
        data-testid="timer-stage"
        className="flex-1 flex flex-col items-center justify-center p-6 text-center gap-6"
      >
        <div className="rounded-3xl bg-white border-2 border-[#BAE6FD] p-8 max-w-md w-full flex flex-col items-center gap-5 shadow-sm">
          <div className="flex items-center gap-4">
            <CharacterAvatar
              phase="celebration"
              config={profile.avatarConfig}
              photoData={profile.photoData}
              size={104}
            />
            <ChocolateRewardSvg size={108} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Tempo concluído!
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              {profile.name} completou toda a contagem.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <BigActionButton onClick={onRestart} variant="amber" className="flex-1">
              <RotateCcw className="w-5 h-5" />
              <span>Repetir</span>
            </BigActionButton>
            <BigActionButton onClick={onExit} variant="outline" className="flex-1">
              <span>Voltar</span>
            </BigActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="timer-stage"
      className="flex-1 flex flex-col max-w-4xl w-full mx-auto px-4 py-4 gap-4"
    >
      {/* Top status bar */}
      <div className="rounded-2xl bg-white border border-[#BAE6FD] px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className="font-bold text-[#0F172A]">{profile.name}</span>
          <span className="px-3 py-1 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] font-bold text-lg text-[#0284C7] tabular-nums">
            {formatClock(snapshot.remainingSeconds)}
          </span>
        </div>

        {!controlsUnlocked ? (
          <ParentalLock
            label="Pausar / Sair"
            onUnlock={() => setControlsUnlocked(true)}
          />
        ) : (
          <div className="flex items-center gap-2">
            {snapshot.status === 'paused' ? (
              <button
                type="button"
                onClick={onResume}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-2xl bg-[#0284C7] text-white font-bold text-sm"
              >
                <Play className="w-4 h-4" />
                <span>Retomar</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={onPause}
                className="inline-flex items-center gap-1.5 px-4 h-11 rounded-2xl bg-[#F59E0B] text-[#0F172A] font-bold text-sm"
              >
                <Pause className="w-4 h-4" />
                <span>Pausar</span>
              </button>
            )}
            <button
              type="button"
              onClick={onExit}
              className="inline-flex items-center px-4 h-11 rounded-2xl border border-[#BAE6FD] bg-white text-[#0F172A] font-bold text-sm"
            >
              Sair
            </button>
          </div>
        )}
      </div>

      {/* Food & Character Stage */}
      <div
        ref={stageRef}
        className="relative flex-1 min-h-[340px] rounded-3xl bg-white border-2 border-[#BAE6FD] overflow-hidden p-4"
      >
        <div
          className="grid"
          style={{
            paddingLeft: `${safeLeftPadding}px`,
            paddingTop: '16px',
            gridTemplateColumns: `repeat(${cols}, ${chipSize}px)`,
            gap: `${gap}px`,
          }}
        >
          {Array.from({ length: snapshot.totalChips }).map((_, idx) => {
            const isPast = idx < snapshot.activeChipIndex;
            const isCurrent = idx === snapshot.activeChipIndex;
            const bites = isPast
              ? 10
              : isCurrent
                ? Math.min(10, Math.floor(snapshot.chipProgress * 10))
                : 0;

            return (
              <div
                key={idx}
                style={{ width: chipSize, height: chipSize }}
                className={`flex items-center justify-center transition-opacity ${
                  isPast ? 'opacity-15' : 'opacity-100'
                }`}
              >
                <WavyChipSvg bitesTaken={bites} maxBites={10} size={chipSize} />
              </div>
            );
          })}
        </div>

        {/* Moving character anchored by mouth to active chip */}
        <div
          data-testid="stage-avatar-wrapper"
          style={{
            position: 'absolute',
            left: `${avatarLeft}px`,
            top: `${avatarTop}px`,
            width: `${avatarSize}px`,
            height: `${avatarSize}px`,
            transition: 'left 250ms ease-out, top 300ms ease-out',
            pointerEvents: 'none',
          }}
        >
          <CharacterAvatar
            phase={snapshot.avatarPhase}
            config={profile.avatarConfig}
            photoData={profile.photoData}
            size={avatarSize}
          />
        </div>
      </div>
    </div>
  );
}
