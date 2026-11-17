'use client';

import { useEffect, useRef, useState } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';
import { SoundToggle } from '@/components/shared/SoundToggle';
import { BigActionButton } from '@/components/shared/BigActionButton';
import { CharacterAvatar } from '@/components/temporizador/CharacterAvatar';
import { ProfileModal } from '@/components/temporizador/ProfileModal';
import { TimerStage } from '@/components/temporizador/TimerStage';
import {
  createTimerEngine,
  type TimerSnapshot,
} from '@/lib/temporizador/timerEngine';
import { soundEngine } from '@/lib/temporizador/soundEngine';
import {
  deleteProfile,
  getProfiles,
  saveProfile,
  type ChildProfile,
} from '@/utils/storage';

const DEFAULT_PROFILE: ChildProfile = {
  id: 'default-child',
  name: 'Criança',
  avatarConfig: {
    skinTone: '#E0AC69',
    hairStyle: 'short',
    hairColor: '#1E1B18',
    bodyBuild: 'medium',
  },
  createdAt: 0,
};

const DURATION_OPTIONS = [
  { label: '10 seg', seconds: 10 },
  { label: '30 seg', seconds: 30 },
  { label: '1 min', seconds: 60 },
  { label: '3 min', seconds: 180 },
  { label: '5 min', seconds: 300 },
  { label: '10 min', seconds: 600 },
  { label: '30 min', seconds: 1800 },
  { label: '60 min', seconds: 3600 },
];

function clampDuration(seconds: number): number {
  if (!Number.isFinite(seconds)) return 60;
  return Math.min(3600, Math.max(10, Math.round(seconds)));
}

function formatDurationDisplay(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60);
  const s = totalSeconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function TemporizadorPage() {
  const [profiles, setProfiles] = useState<ChildProfile[]>([DEFAULT_PROFILE]);
  const [selectedProfileId, setSelectedProfileId] = useState(DEFAULT_PROFILE.id);
  const [selectedSeconds, setSelectedSeconds] = useState(60);
  const [muted, setMuted] = useState(false);
  const [runningScreen, setRunningScreen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const [snapshot, setSnapshot] = useState<TimerSnapshot>({
    status: 'idle',
    totalSeconds: 60,
    remainingSeconds: 60,
    totalChips: 6,
    activeChipIndex: 0,
    chipProgress: 0,
    avatarPhase: 'anticipation',
  });

  const engineRef = useRef<ReturnType<typeof createTimerEngine> | null>(null);
  const prevStatusRef = useRef<TimerSnapshot['status']>('idle');
  const prevPhaseRef = useRef<TimerSnapshot['avatarPhase']>('anticipation');

  useEffect(() => {
    getProfiles().then((saved) => {
      if (saved.length > 0) {
        setProfiles([DEFAULT_PROFILE, ...saved]);
      }
    });
  }, []);

  useEffect(() => {
    const engine = createTimerEngine((snap) => {
      setSnapshot(snap);
      if (snap.avatarPhase === 'bite' && prevPhaseRef.current !== 'bite') {
        soundEngine.playBite();
      }
      if (snap.status === 'finished' && prevStatusRef.current !== 'finished') {
        soundEngine.playCelebration();
      }
      prevPhaseRef.current = snap.avatarPhase;
      prevStatusRef.current = snap.status;
    });
    engine.configure(selectedSeconds);
    engineRef.current = engine;
    return () => engine.destroy();
  }, [selectedSeconds]);

  const activeProfile =
    profiles.find((p) => p.id === selectedProfileId) ?? DEFAULT_PROFILE;

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const handleStart = () => {
    // Non-blocking hardware/browser requests so iPad Safari never stalls
    soundEngine.init();
    try {
      const fs = document.documentElement.requestFullscreen?.();
      if (fs && typeof fs.catch === 'function') {
        fs.catch(() => {});
      }
    } catch {
      // Ignore fullscreen errors on iPadOS Safari
    }
    try {
      const wl = (
        navigator as unknown as {
          wakeLock?: { request: (type: 'screen') => Promise<unknown> };
        }
      ).wakeLock?.request('screen');
      if (wl && typeof wl.catch === 'function') {
        wl.catch(() => {});
      }
    } catch {
      // Ignore wakeLock errors
    }

    engineRef.current?.configure(selectedSeconds);
    setRunningScreen(true);
    engineRef.current?.start();
  };

  const handleExit = () => {
    engineRef.current?.reset();
    setRunningScreen(false);
    try {
      if (document.fullscreenElement) {
        document.exitFullscreen?.().catch(() => {});
      }
    } catch {
      // Ignore
    }
  };

  const handleSaveProfile = async (profile: ChildProfile) => {
    await saveProfile(profile);
    const saved = await getProfiles();
    setProfiles([DEFAULT_PROFILE, ...saved]);
    setSelectedProfileId(profile.id);
    setModalOpen(false);
  };

  const handleDeleteProfile = async (id: string) => {
    await deleteProfile(id);
    const saved = await getProfiles();
    setProfiles([DEFAULT_PROFILE, ...saved]);
    if (selectedProfileId === id) {
      setSelectedProfileId(DEFAULT_PROFILE.id);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        title="Temporizador Visual"
        backHref={runningScreen ? undefined : '/'}
        rightSlot={<SoundToggle muted={muted} onToggle={handleToggleMute} />}
      />

      {runningScreen ? (
        <TimerStage
          snapshot={snapshot}
          profile={activeProfile}
          onPause={() => engineRef.current?.pause()}
          onResume={() => engineRef.current?.resume()}
          onExit={handleExit}
          onRestart={() => {
            engineRef.current?.configure(selectedSeconds);
            engineRef.current?.start();
          }}
        />
      ) : (
        <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Profile selector */}
          <section className="rounded-3xl bg-white border border-[#BAE6FD] p-5 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">
                1. Escolha quem vai usar
              </h2>
              <button
                type="button"
                onClick={() => setModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE] shrink-0 whitespace-nowrap"
              >
                <Plus className="w-4 h-4" />
                <span>Novo perfil</span>
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {profiles.map((p) => {
                const selected = p.id === selectedProfileId;
                return (
                  <div
                    key={p.id}
                    className={`relative rounded-2xl border-2 p-3 flex flex-col items-center gap-2 transition ${
                      selected
                        ? 'border-[#0284C7] bg-[#F0F9FF]'
                        : 'border-[#BAE6FD] bg-white hover:bg-[#F0F9FF]/50'
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedProfileId(p.id)}
                      className="flex flex-col items-center gap-2 w-full"
                    >
                      <CharacterAvatar
                        phase="anticipation"
                        config={p.avatarConfig}
                        photoData={p.photoData}
                        size={64}
                      />
                      <span className="font-bold text-sm text-[#0F172A] truncate max-w-full">
                        {p.name}
                      </span>
                    </button>
                    {p.id !== DEFAULT_PROFILE.id ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteProfile(p.id)}
                        aria-label={`Excluir perfil ${p.name}`}
                        className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-[#BAE6FD] flex items-center justify-center text-[#64748B] hover:text-red-600"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                );
              })}
            </div>
          </section>

          {/* Time selector */}
          <section className="rounded-3xl bg-white border border-[#BAE6FD] p-5 sm:p-6">
            <div className="flex items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-bold text-[#0F172A]">
                2. Escolha o tempo
              </h2>
              <span
                data-testid="selected-duration-badge"
                className="px-3.5 py-1 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] font-bold text-lg text-[#0284C7] tabular-nums"
              >
                {formatDurationDisplay(selectedSeconds)}
              </span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 mb-5">
              {DURATION_OPTIONS.map((opt) => {
                const active = selectedSeconds === opt.seconds;
                return (
                  <button
                    key={opt.seconds}
                    type="button"
                    onClick={() => setSelectedSeconds(opt.seconds)}
                    className={`h-12 rounded-2xl font-bold text-xs sm:text-sm border-2 transition touch-manipulation ${
                      active
                        ? 'bg-[#0284C7] text-white border-[#0284C7]'
                        : 'bg-[#F0F9FF] text-[#0F172A] border-[#BAE6FD] hover:border-[#0284C7]'
                    }`}
                  >
                    {opt.label}
                  </button>
                );
              })}
            </div>

            <div className="rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] p-4 flex flex-col gap-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm font-semibold text-[#0F172A]">
                  Tempo livre (10 seg a 60 min)
                </span>
                <div className="flex items-center gap-2">
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-[#475569]">
                    <input
                      type="number"
                      aria-label="Minutos"
                      min={0}
                      max={60}
                      value={Math.floor(selectedSeconds / 60)}
                      onChange={(e) => {
                        const mins = Math.max(0, Math.min(60, Number(e.target.value) || 0));
                        const secs = mins === 60 ? 0 : selectedSeconds % 60;
                        setSelectedSeconds(clampDuration(mins * 60 + secs));
                      }}
                      className="w-16 h-10 rounded-xl border border-[#BAE6FD] bg-white px-2 text-center font-bold text-[#0F172A] tabular-nums"
                    />
                    <span>min</span>
                  </label>
                  <label className="flex items-center gap-1.5 text-sm font-semibold text-[#475569]">
                    <input
                      type="number"
                      aria-label="Segundos"
                      min={0}
                      max={59}
                      value={selectedSeconds % 60}
                      onChange={(e) => {
                        const mins = Math.floor(selectedSeconds / 60);
                        const secs = Math.max(0, Math.min(59, Number(e.target.value) || 0));
                        setSelectedSeconds(clampDuration(mins * 60 + secs));
                      }}
                      className="w-16 h-10 rounded-xl border border-[#BAE6FD] bg-white px-2 text-center font-bold text-[#0F172A] tabular-nums"
                    />
                    <span>seg</span>
                  </label>
                </div>
              </div>

              <input
                type="range"
                aria-label="Ajustar tempo em segundos"
                min={10}
                max={3600}
                step={10}
                value={selectedSeconds}
                onChange={(e) => setSelectedSeconds(clampDuration(Number(e.target.value)))}
                className="w-full accent-[#0284C7] cursor-pointer"
              />
            </div>
          </section>

          <BigActionButton
            onClick={handleStart}
            variant="amber"
            className="w-full text-xl py-4"
          >
            <Play className="w-6 h-6 fill-current" />
            <span>Iniciar Temporizador</span>
          </BigActionButton>
        </main>
      )}

      {modalOpen ? (
        <ProfileModal
          onSave={handleSaveProfile}
          onClose={() => setModalOpen(false)}
        />
      ) : null}
    </div>
  );
}
