'use client';

import { useEffect, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Lightbulb,
  PartyPopper,
  RotateCcw,
  Volume2,
} from 'lucide-react';
import { BigActionButton } from '@/components/shared/BigActionButton';
import {
  getSequencingPictogramUrl,
  shuffleSteps,
  type SequencingChallenge,
  type SequencingStep,
} from '@/lib/sequenciamento/sequencingConfig';
import { soundEngine } from '@/lib/temporizador/soundEngine';

interface SequencingGameProps {
  challenge: SequencingChallenge;
  muted: boolean;
  onBack: () => void;
  onNextChallenge?: () => void;
}

function speakTextPtBr(text: string, muted: boolean): void {
  if (muted || typeof window === 'undefined') return;
  try {
    if (!('speechSynthesis' in window) || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'pt-BR';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore restricted speech synthesis errors
  }
}

export function SequencingGame({
  challenge,
  muted,
  onBack,
  onNextChallenge,
}: SequencingGameProps) {
  const [slots, setSlots] = useState<Array<SequencingStep | null>>(() =>
    Array(challenge.steps.length).fill(null),
  );
  const [lockedSlots, setLockedSlots] = useState<boolean[]>(() =>
    Array(challenge.steps.length).fill(false),
  );
  const [tray, setTray] = useState<SequencingStep[]>(() =>
    shuffleSteps(challenge.steps),
  );
  const [hintStepId, setHintStepId] = useState<string | null>(null);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [solved, setSolved] = useState(false);

  // Reset state whenever the active challenge changes
  useEffect(() => {
    setSlots(Array(challenge.steps.length).fill(null));
    setLockedSlots(Array(challenge.steps.length).fill(false));
    setTray(shuffleSteps(challenge.steps));
    setHintStepId(null);
    setFeedback(null);
    setSolved(false);
  }, [challenge]);

  const handleRestart = () => {
    setSlots(Array(challenge.steps.length).fill(null));
    setLockedSlots(Array(challenge.steps.length).fill(false));
    setTray(shuffleSteps(challenge.steps));
    setHintStepId(null);
    setFeedback(null);
    setSolved(false);
  };

  const handlePlaceFromTray = (step: SequencingStep) => {
    if (solved) return;
    const emptyIdx = slots.findIndex((s) => s === null);
    if (emptyIdx === -1) return;

    const nextSlots = [...slots];
    nextSlots[emptyIdx] = step;
    setSlots(nextSlots);
    setTray((prev) => prev.filter((item) => item.id !== step.id));
    setHintStepId(null);
    setFeedback(null);

    if (!muted) {
      soundEngine.init();
      soundEngine.setMuted(false);
      soundEngine.playBite();
    }
  };

  const handleRemoveFromSlot = (idx: number) => {
    if (solved || lockedSlots[idx]) return;
    const step = slots[idx];
    if (!step) return;

    const nextSlots = [...slots];
    nextSlots[idx] = null;
    setSlots(nextSlots);
    setTray((prev) => [...prev, step]);
    setFeedback(null);
  };

  const handleCheckOrder = () => {
    if (solved) return;
    const nextSlots = [...slots];
    const nextLocked = [...lockedSlots];
    const returnedToTray: SequencingStep[] = [];
    let correctCount = 0;

    for (let i = 0; i < challenge.steps.length; i++) {
      const placed = nextSlots[i];
      const expected = challenge.steps[i];
      if (placed && placed.id === expected.id) {
        nextLocked[i] = true;
        correctCount++;
      } else {
        if (placed) {
          returnedToTray.push(placed);
          nextSlots[i] = null;
        }
        nextLocked[i] = false;
      }
    }

    setSlots(nextSlots);
    setLockedSlots(nextLocked);
    if (returnedToTray.length > 0) {
      setTray((prev) => [...prev, ...returnedToTray]);
    }
    setHintStepId(null);

    if (correctCount === challenge.steps.length) {
      setSolved(true);
      setFeedback(null);
      if (!muted) {
        soundEngine.init();
        soundEngine.setMuted(false);
        soundEngine.playCelebration();
      }
    } else {
      setFeedback(
        correctCount > 0
          ? 'Quase lá! Os cartões verdes já estão no lugar certo. O que vem agora?'
          : 'Tente pensar no que acontece primeiro nessa situação.',
      );
    }
  };

  const handleGiveHint = () => {
    if (solved) return;
    const targetIdx = challenge.steps.findIndex(
      (expected, idx) => slots[idx]?.id !== expected.id,
    );
    if (targetIdx === -1) return;

    const targetStep = challenge.steps[targetIdx];
    // If the target card is sitting in a wrong slot, move it back to tray so the child sees it highlighted
    const wrongSlotIdx = slots.findIndex((s) => s?.id === targetStep.id);
    if (wrongSlotIdx !== -1) {
      const nextSlots = [...slots];
      nextSlots[wrongSlotIdx] = null;
      setSlots(nextSlots);
      setTray((prev) => [...prev, targetStep]);
    }

    setHintStepId(targetStep.id);
    setFeedback(`Dica: procure o cartão "${targetStep.label}" para o ${targetIdx + 1}º lugar.`);
  };

  const allSlotsFilled = slots.every((s) => s !== null);

  return (
    <div
      data-testid="sequencing-game"
      className="flex-1 max-w-4xl w-full mx-auto px-4 py-5 flex flex-col gap-5"
    >
      {/* Top bar */}
      <div className="rounded-2xl bg-white border border-[#BAE6FD] px-4 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-1.5 px-3 h-10 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-xs font-bold text-[#0F172A] cursor-pointer shrink-0"
          >
            <ArrowLeft className="size-4" aria-hidden="true" />
            <span>Desafios</span>
          </button>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-[#0284C7] block">
              {challenge.levelLabel}
            </span>
            <h2 className="text-base sm:text-lg font-bold text-[#0F172A] truncate">
              {challenge.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleGiveHint}
            disabled={solved}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl border border-[#FCD34D] bg-[#FEF3C7] text-xs font-bold text-[#92400E] disabled:opacity-50 cursor-pointer"
          >
            <Lightbulb className="size-4" aria-hidden="true" />
            <span>Me dá uma dica</span>
          </button>
          <button
            type="button"
            onClick={handleRestart}
            aria-label="Reiniciar desafio"
            className="inline-flex items-center justify-center size-10 rounded-xl border border-[#BAE6FD] bg-white text-[#475569] hover:text-[#0F172A] cursor-pointer"
          >
            <RotateCcw className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      {/* Numbered Slots */}
      <section className="rounded-3xl bg-white border border-[#BAE6FD] p-4 sm:p-5 flex flex-col gap-4">
        <p className="text-sm font-semibold text-[#475569] text-pretty">
          Coloque os cartões na ordem lógica do que acontece primeiro até o final:
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {challenge.steps.map((_, idx) => {
            const placed = slots[idx];
            const isLocked = lockedSlots[idx];

            if (placed) {
              return (
                <button
                  key={`slot-${idx}-${placed.id}`}
                  type="button"
                  onClick={() => handleRemoveFromSlot(idx)}
                  disabled={isLocked || solved}
                  data-testid={`seq-slot-${idx}`}
                  data-locked={isLocked ? 'true' : 'false'}
                  aria-label={`${idx + 1}º passo: ${placed.label}`}
                  className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-2 text-center transition ${
                    isLocked
                      ? 'border-[#10B981] bg-[#ECFDF5] cursor-default'
                      : 'border-[#0284C7] bg-[#F0F9FF] cursor-pointer active:scale-95'
                  }`}
                >
                  <div className="flex items-center justify-between w-full">
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                        isLocked
                          ? 'bg-[#10B981] text-white'
                          : 'bg-[#0284C7] text-white'
                      }`}
                    >
                      {idx + 1}º
                    </span>
                    {isLocked ? (
                      <CheckCircle2
                        className="size-4 text-[#10B981]"
                        aria-hidden="true"
                      />
                    ) : null}
                  </div>
                  <img
                    src={getSequencingPictogramUrl(placed.arasaacId)}
                    alt={placed.label}
                    width={64}
                    height={64}
                    className="object-contain bg-white rounded-xl p-1"
                  />
                  <span className="text-xs font-bold text-[#0F172A] leading-tight">
                    {placed.label}
                  </span>
                </button>
              );
            }

            return (
              <div
                key={`empty-slot-${idx}`}
                data-testid={`seq-slot-${idx}`}
                data-locked="false"
                className="rounded-2xl border-2 border-dashed border-[#BAE6FD] bg-[#F0F9FF]/40 p-3 min-h-[136px] flex flex-col items-center justify-center gap-1.5 text-center"
              >
                <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#BAE6FD] text-xs font-bold text-[#475569] tabular-nums">
                  {idx + 1}º
                </span>
                <span className="text-[11px] text-[#64748B]">
                  Toque abaixo
                </span>
              </div>
            );
          })}
        </div>

        {feedback && !solved ? (
          <div
            role="status"
            data-testid="sequencing-feedback"
            className="rounded-2xl bg-[#FEF3C7]/70 border border-[#FCD34D] px-4 py-3 text-sm font-semibold text-[#92400E] text-center"
          >
            {feedback}
          </div>
        ) : null}

        {allSlotsFilled && !solved ? (
          <BigActionButton
            data-testid="verify-sequence-btn"
            variant="amber"
            onClick={handleCheckOrder}
            className="w-full"
          >
            <CheckCircle2 className="size-5" aria-hidden="true" />
            <span>Verificar ordem</span>
          </BigActionButton>
        ) : null}
      </section>

      {/* Celebration Card */}
      {solved ? (
        <section
          data-testid="sequencing-celebration"
          className="rounded-3xl bg-white border-4 border-[#10B981] p-6 flex flex-col items-center text-center gap-4 shadow-sm"
        >
          <div className="size-16 rounded-3xl bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center text-[#B45309]">
            <PartyPopper className="size-8" aria-hidden="true" />
          </div>
          <div>
            <h3 className="text-2xl font-bold text-[#0F172A] text-balance">
              Sequência certa!
            </h3>
            <p className="mt-1.5 text-base text-[#334155] max-w-lg text-pretty">
              {challenge.explanation}
            </p>
          </div>

          <button
            type="button"
            onClick={() => speakTextPtBr(challenge.explanation, muted)}
            className="inline-flex items-center gap-2 px-4 h-10 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-sm font-bold text-[#0284C7] cursor-pointer"
          >
            <Volume2 className="size-4" aria-hidden="true" />
            <span>Ouvir explicação</span>
          </button>

          <div className="flex flex-col sm:flex-row gap-3 w-full max-w-md pt-1">
            {onNextChallenge ? (
              <BigActionButton
                variant="amber"
                onClick={onNextChallenge}
                className="flex-1"
              >
                <span>Próximo desafio</span>
                <ArrowRight className="size-5" aria-hidden="true" />
              </BigActionButton>
            ) : null}
            <BigActionButton
              variant="outline"
              onClick={handleRestart}
              className="flex-1"
            >
              <RotateCcw className="size-5" aria-hidden="true" />
              <span>Jogar novamente</span>
            </BigActionButton>
          </div>
        </section>
      ) : null}

      {/* Shuffled Tray */}
      {tray.length > 0 && !solved ? (
        <section
          aria-label="Cartões embaralhados"
          className="rounded-3xl bg-white border border-[#BAE6FD] p-4 sm:p-5 flex flex-col gap-3"
        >
          <h3 className="text-sm font-bold text-[#0F172A]">
            Cartões disponíveis ({tray.length})
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {tray.map((step) => {
              const isHinted = hintStepId === step.id;
              return (
                <button
                  key={`tray-${step.id}`}
                  type="button"
                  data-testid={`seq-tray-${step.id}`}
                  onClick={() => handlePlaceFromTray(step)}
                  className={`rounded-2xl border-2 p-3 flex flex-col items-center gap-2 text-center cursor-pointer active:scale-95 transition ${
                    isHinted
                      ? 'border-[#F59E0B] bg-[#FEF3C7]/60 ring-2 ring-[#F59E0B]'
                      : 'border-[#BAE6FD] bg-white hover:border-[#0284C7]'
                  }`}
                >
                  <img
                    src={getSequencingPictogramUrl(step.arasaacId)}
                    alt={step.label}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                  <span className="text-xs sm:text-sm font-bold text-[#0F172A] leading-tight">
                    {step.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>
      ) : null}
    </div>
  );
}
