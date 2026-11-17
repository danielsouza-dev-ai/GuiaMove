'use client';

import { useEffect, useRef, useState } from 'react';
import {
  CheckCircle2,
  Lock,
  PartyPopper,
  RotateCcw,
  Undo2,
  Volume2,
} from 'lucide-react';
import { BigActionButton } from '@/components/shared/BigActionButton';
import { ParentalLock } from '@/components/shared/ParentalLock';
import {
  getArasaacPictogramUrl,
  type RoutineCardItem,
} from '@/lib/rotinas/routinesConfig';
import { soundEngine } from '@/lib/temporizador/soundEngine';

interface RoutinePlayerProps {
  title: string;
  steps: RoutineCardItem[];
  muted: boolean;
  onExit: () => void;
}

function speakStepLabel(label: string, muted: boolean): void {
  if (muted || typeof window === 'undefined') return;
  try {
    if (!('speechSynthesis' in window) || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utter = new SpeechSynthesisUtterance(label);
    utter.lang = 'pt-BR';
    utter.rate = 0.95;
    window.speechSynthesis.speak(utter);
  } catch {
    // Ignore restricted speech synthesis errors
  }
}

export function RoutinePlayer({
  title,
  steps,
  muted,
  onExit,
}: RoutinePlayerProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [holdingCardIdx, setHoldingCardIdx] = useState<number | null>(null);
  const [resetMenuOpen, setResetMenuOpen] = useState(false);
  const [holdingTopLock, setHoldingTopLock] = useState(false);

  const cardHoldTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const stepRefs = useRef<Array<HTMLDivElement | null>>([]);

  const clearCardHold = () => {
    if (cardHoldTimerRef.current) {
      clearTimeout(cardHoldTimerRef.current);
      cardHoldTimerRef.current = null;
    }
    setHoldingCardIdx(null);
  };

  useEffect(() => {
    return () => {
      if (cardHoldTimerRef.current) clearTimeout(cardHoldTimerRef.current);
    };
  }, []);

  useEffect(() => {
    const activeEl = stepRefs.current[activeIndex];
    if (activeEl && typeof activeEl.scrollIntoView === 'function') {
      activeEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [activeIndex]);

  const handleCompleteStep = () => {
    if (activeIndex >= steps.length) return;
    const nextIdx = activeIndex + 1;
    if (!muted) {
      soundEngine.init();
      soundEngine.setMuted(false);
      if (nextIdx >= steps.length) {
        soundEngine.playCelebration();
      } else {
        soundEngine.playBite();
      }
    }
    setActiveIndex(nextIdx);
  };

  const handleStartCardHold = (idx: number) => {
    clearCardHold();
    setHoldingCardIdx(idx);
    cardHoldTimerRef.current = setTimeout(() => {
      cardHoldTimerRef.current = null;
      setHoldingCardIdx(null);
      setActiveIndex(idx);
    }, 900);
  };

  const completedCount = Math.min(activeIndex, steps.length);
  const progressPct =
    steps.length > 0 ? Math.round((completedCount / steps.length) * 100) : 0;

  if (steps.length === 0) {
    return (
      <div className="flex-1 max-w-2xl w-full mx-auto px-4 py-8 flex flex-col items-center justify-center text-center gap-4">
        <p className="text-lg font-bold text-[#0F172A]">
          Esta rotina não possui passos configurados.
        </p>
        <BigActionButton onClick={onExit} variant="primary">
          Voltar para Rotinas
        </BigActionButton>
      </div>
    );
  }

  if (activeIndex >= steps.length) {
    return (
      <div
        data-testid="routine-player-celebration"
        className="flex-1 flex flex-col items-center justify-center p-6 text-center"
      >
        <div className="rounded-3xl bg-white border-2 border-[#BAE6FD] p-8 max-w-md w-full flex flex-col items-center gap-5 shadow-sm">
          <div className="size-20 rounded-3xl bg-[#FEF3C7] border border-[#F59E0B] flex items-center justify-center text-[#B45309]">
            <PartyPopper className="size-10" aria-hidden="true" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#0F172A] text-balance">
              Parabéns! Rotina concluída!
            </h2>
            <p className="mt-1.5 text-sm text-[#475569] text-pretty">
              Todos os {steps.length} passos de <strong className="text-[#0F172A]">{title}</strong> foram concluídos.
            </p>
          </div>
          <div className="flex flex-col gap-2.5 w-full">
            <BigActionButton
              onClick={() => setActiveIndex(0)}
              variant="amber"
              className="w-full"
            >
              <RotateCcw className="size-5" aria-hidden="true" />
              <span>Repetir rotina</span>
            </BigActionButton>
            <BigActionButton
              onClick={() => setActiveIndex(Math.max(0, steps.length - 1))}
              variant="outline"
              className="w-full"
            >
              <Undo2 className="size-5" aria-hidden="true" />
              <span>Voltar 1 passo</span>
            </BigActionButton>
            <BigActionButton
              onClick={onExit}
              variant="primary"
              className="w-full"
            >
              <span>Voltar para Rotinas</span>
            </BigActionButton>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-testid="routine-player"
      className="flex-1 max-w-3xl w-full mx-auto px-4 py-4 flex flex-col gap-4"
    >
      {/* Top Progress Bar & Recovery Controls */}
      <div className="rounded-2xl bg-white border border-[#BAE6FD] px-4 py-3 flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <h2 className="font-bold text-[#0F172A] text-base sm:text-lg truncate">
              {title}
            </h2>
            <span
              data-testid="routine-progress-badge"
              className="px-3 py-1 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] font-bold text-sm text-[#0284C7] tabular-nums shrink-0"
            >
              {completedCount} de {steps.length}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeIndex > 0 ? (
              <button
                type="button"
                onClick={() => setActiveIndex((i) => Math.max(0, i - 1))}
                className="inline-flex items-center gap-1.5 px-3.5 h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] font-bold text-sm hover:bg-[#E0F2FE] cursor-pointer"
              >
                <Undo2 className="size-4 text-[#0284C7]" aria-hidden="true" />
                <span>Voltar 1 passo</span>
              </button>
            ) : null}

            {!resetMenuOpen ? (
              <ParentalLock
                label="Resetar / Opções"
                holdMs={1500}
                onHoldingChange={setHoldingTopLock}
                onUnlock={() => {
                  setHoldingTopLock(false);
                  setResetMenuOpen(true);
                }}
              />
            ) : (
              <div className="flex flex-wrap items-center gap-2">
                <button
                  type="button"
                  onClick={() => setActiveIndex(0)}
                  className="inline-flex items-center gap-1.5 px-3.5 h-11 rounded-2xl bg-[#F59E0B] text-[#0F172A] font-bold text-sm cursor-pointer"
                >
                  <RotateCcw className="size-4" aria-hidden="true" />
                  <span>Reiniciar rotina</span>
                </button>
                <button
                  type="button"
                  onClick={() => setResetMenuOpen(false)}
                  className="inline-flex items-center gap-1.5 px-3.5 h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0284C7] font-bold text-sm cursor-pointer"
                >
                  <Lock className="size-4" aria-hidden="true" />
                  <span>Bloquear</span>
                </button>
                <button
                  type="button"
                  onClick={onExit}
                  className="inline-flex items-center px-3.5 h-11 rounded-2xl border border-[#BAE6FD] bg-white text-[#0F172A] font-bold text-sm cursor-pointer"
                >
                  Sair
                </button>
              </div>
            )}
          </div>
        </div>

        <div
          aria-hidden="true"
          className="w-full h-2.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] overflow-hidden"
        >
          <div
            className="h-full bg-[#0284C7] transition-all duration-200 ease-out"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {holdingTopLock && !resetMenuOpen ? (
        <div
          role="status"
          className="rounded-2xl bg-[#E0F2FE] border-2 border-[#0284C7] px-4 py-2.5 text-center text-sm font-bold text-[#0F172A]"
        >
          Continue segurando para abrir opções de retorno/reset...
        </div>
      ) : null}

      {activeIndex > 0 ? (
        <p className="text-xs text-[#475569] text-center">
          Dica: tocou sem querer? Use <strong>Voltar 1 passo</strong> ou segure no cartão concluído para voltar a ele.
        </p>
      ) : null}

      {/* Sequenced Cards List */}
      <div className="flex flex-col gap-3 pb-6">
        {steps.map((step, idx) => {
          const isCompleted = idx < activeIndex;
          const isCurrent = idx === activeIndex;
          const isHoldingThis = holdingCardIdx === idx;

          if (isCompleted) {
            return (
              <div
                key={`${step.id}-${idx}`}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                data-testid={`routine-step-${idx}`}
                data-status="completed"
                onPointerDown={() => handleStartCardHold(idx)}
                onPointerUp={clearCardHold}
                onPointerCancel={clearCardHold}
                onPointerLeave={clearCardHold}
                onContextMenu={(e) => e.preventDefault()}
                className={`relative overflow-hidden rounded-3xl border-2 border-[#10B981] bg-[#ECFDF5]/60 p-4 flex items-center justify-between gap-4 select-none touch-pan-y transition ${
                  isHoldingThis ? 'ring-2 ring-[#F59E0B]' : ''
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`absolute inset-y-0 left-0 bg-[#F59E0B]/20 transition-all ${
                    isHoldingThis ? 'w-full' : 'w-0'
                  }`}
                  style={{ transitionDuration: isHoldingThis ? '900ms' : '150ms' }}
                />

                <div className="relative z-10 flex items-center gap-4 min-w-0">
                  <div className="size-16 rounded-2xl bg-white border border-[#10B981]/50 p-1.5 flex items-center justify-center shrink-0">
                    <img
                      src={getArasaacPictogramUrl(step.arasaacId)}
                      alt={step.label}
                      width={52}
                      height={52}
                      className="object-contain opacity-50 grayscale-[20%]"
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[#065F46]">
                      <CheckCircle2 className="size-4 text-[#10B981]" aria-hidden="true" />
                      <span>Concluído</span>
                    </div>
                    <p className="text-base font-bold text-[#0F172A]/75 line-through truncate">
                      {step.label}
                    </p>
                    <p className="text-[11px] text-[#475569]">
                      {isHoldingThis
                        ? 'Voltando para este passo...'
                        : 'Segure no cartão concluído para voltar a este passo'}
                    </p>
                  </div>
                </div>

                {resetMenuOpen ? (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveIndex(idx);
                    }}
                    className="relative z-10 px-3 h-10 rounded-xl bg-white border border-[#10B981] text-xs font-bold text-[#065F46] shrink-0 cursor-pointer"
                  >
                    Voltar aqui
                  </button>
                ) : null}
              </div>
            );
          }

          if (isCurrent) {
            return (
              <div
                key={`${step.id}-${idx}`}
                ref={(el) => {
                  stepRefs.current[idx] = el;
                }}
                data-testid={`routine-step-${idx}`}
                data-status="current"
                className="rounded-3xl border-4 border-[#0284C7] bg-white p-5 sm:p-6 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm"
              >
                <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                  <div className="size-28 rounded-3xl bg-[#F0F9FF] border-2 border-[#BAE6FD] p-2 flex items-center justify-center shrink-0">
                    <img
                      src={getArasaacPictogramUrl(step.arasaacId)}
                      alt={step.label}
                      width={92}
                      height={92}
                      className="object-contain select-none"
                    />
                  </div>
                  <div className="flex flex-col items-center sm:items-start gap-2">
                    <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold uppercase">
                      AGORA · Passo {idx + 1}
                    </span>
                    <h3 className="text-2xl font-bold text-[#0F172A] text-balance">
                      {step.label}
                    </h3>
                    <button
                      type="button"
                      onClick={() => speakStepLabel(step.label, muted)}
                      className="inline-flex items-center gap-1.5 px-3 h-9 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] cursor-pointer"
                    >
                      <Volume2 className="size-4" aria-hidden="true" />
                      <span>Ouvir</span>
                    </button>
                  </div>
                </div>

                <BigActionButton
                  data-testid="complete-active-step-btn"
                  onClick={handleCompleteStep}
                  variant="amber"
                  className="w-full sm:w-auto shrink-0"
                >
                  <CheckCircle2 className="size-5" aria-hidden="true" />
                  <span>Concluir passo</span>
                </BigActionButton>
              </div>
            );
          }

          return (
            <div
              key={`${step.id}-${idx}`}
              ref={(el) => {
                stepRefs.current[idx] = el;
              }}
              data-testid={`routine-step-${idx}`}
              data-status="upcoming"
              className="rounded-3xl border border-[#BAE6FD] bg-white/75 p-4 flex items-center gap-4 opacity-85"
            >
              <span className="size-9 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center font-bold text-sm text-[#475569] tabular-nums shrink-0">
                {idx + 1}º
              </span>
              <div className="size-14 rounded-2xl bg-white border border-[#BAE6FD] p-1 flex items-center justify-center shrink-0">
                <img
                  src={getArasaacPictogramUrl(step.arasaacId)}
                  alt={step.label}
                  width={44}
                  height={44}
                  className="object-contain"
                />
              </div>
              <span className="font-bold text-base text-[#0F172A] truncate">
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
