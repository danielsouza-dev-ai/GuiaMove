'use client';

import { useState } from 'react';
import {
  ArrowRight,
  CheckCircle2,
  Pencil,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { BigActionButton } from '@/components/shared/BigActionButton';
import {
  getArasaacPictogramUrl,
  type FirstThenConfig,
  type RoutineCardItem,
} from '@/lib/rotinas/routinesConfig';
import { soundEngine } from '@/lib/temporizador/soundEngine';
import { ArasaacCardAdder } from './ArasaacCardAdder';

interface FirstThenBoardProps {
  firstThen: FirstThenConfig;
  cardBank: RoutineCardItem[];
  muted: boolean;
  onUpdateFirstThen: (next: FirstThenConfig) => void;
  onAddCardToBank: (card: RoutineCardItem) => void;
}

export function FirstThenBoard({
  firstThen,
  cardBank,
  muted,
  onUpdateFirstThen,
  onAddCardToBank,
}: FirstThenBoardProps) {
  const [firstDone, setFirstDone] = useState(false);
  const [editing, setEditing] = useState(false);
  const [editingSlot, setEditingSlot] = useState<'first' | 'then'>('first');

  const handleCompleteFirst = () => {
    setFirstDone(true);
    if (!muted) {
      soundEngine.init();
      soundEngine.setMuted(false);
      soundEngine.playCelebration();
    }
  };

  const handleSelectCard = (card: RoutineCardItem) => {
    const next: FirstThenConfig = {
      ...firstThen,
      [editingSlot]: card,
    };
    onUpdateFirstThen(next);
    setFirstDone(false);
  };

  return (
    <div data-testid="first-then-board" className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-[#0F172A] text-balance">
            Quadro Primeiro / Depois
          </h2>
          <p className="text-sm text-[#475569] text-pretty">
            Mostre o combinado visual: primeiro a tarefa, depois a recompensa.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setEditing((v) => !v)}
          className="inline-flex items-center gap-1.5 px-4 h-11 rounded-2xl border border-[#BAE6FD] bg-white text-sm font-bold text-[#0284C7] hover:bg-[#F0F9FF] cursor-pointer"
        >
          <Pencil className="size-4" aria-hidden="true" />
          <span>
            {editing ? 'Fechar edição' : 'Trocar cartões Primeiro / Depois'}
          </span>
        </button>
      </div>

      {/* Two side-by-side cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        {/* 1º PRIMEIRO */}
        <div
          data-testid="first-then-first-card"
          data-done={firstDone ? 'true' : 'false'}
          className={`rounded-3xl border-4 p-6 flex flex-col items-center justify-between text-center gap-4 transition ${
            firstDone
              ? 'border-[#10B981] bg-[#ECFDF5]/60'
              : 'border-[#0284C7] bg-white shadow-sm'
          }`}
        >
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase ${
              firstDone
                ? 'bg-[#D1FAE5] text-[#065F46]'
                : 'bg-[#E0F2FE] text-[#0369A1]'
            }`}
          >
            1º Primeiro
          </span>

          <div className="size-32 rounded-3xl bg-white border-2 border-[#BAE6FD] p-2 flex items-center justify-center">
            <img
              src={getArasaacPictogramUrl(firstThen.first.arasaacId)}
              alt={firstThen.first.label}
              width={104}
              height={104}
              className={`object-contain transition ${
                firstDone ? 'opacity-45 grayscale-[25%]' : ''
              }`}
            />
          </div>

          <p
            className={`text-xl font-bold text-[#0F172A] ${
              firstDone ? 'line-through opacity-75' : ''
            }`}
          >
            {firstThen.first.label}
          </p>

          {!firstDone ? (
            <BigActionButton
              variant="amber"
              onClick={handleCompleteFirst}
              className="w-full"
            >
              <CheckCircle2 className="size-5" aria-hidden="true" />
              <span>Concluir Primeiro</span>
            </BigActionButton>
          ) : (
            <div className="flex flex-col items-center gap-2 w-full">
              <div className="inline-flex items-center gap-1.5 text-sm font-bold text-[#065F46]">
                <CheckCircle2 className="size-5 text-[#10B981]" aria-hidden="true" />
                <span>Primeiro concluído!</span>
              </div>
              <button
                type="button"
                onClick={() => setFirstDone(false)}
                className="inline-flex items-center gap-1.5 px-4 h-10 rounded-xl border border-[#10B981] bg-white text-xs font-bold text-[#065F46] cursor-pointer"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Desfazer / Resetar</span>
              </button>
            </div>
          )}
        </div>

        {/* 2º DEPOIS */}
        <div
          data-testid="first-then-then-card"
          data-unlocked={firstDone ? 'true' : 'false'}
          className={`rounded-3xl border-4 p-6 flex flex-col items-center justify-between text-center gap-4 transition ${
            firstDone
              ? 'border-[#F59E0B] bg-[#FFFBEB] shadow-md'
              : 'border-[#BAE6FD] bg-white/80 opacity-85'
          }`}
        >
          <span
            className={`px-3.5 py-1 rounded-full text-xs font-bold uppercase inline-flex items-center gap-1 ${
              firstDone
                ? 'bg-[#FEF3C7] text-[#92400E]'
                : 'bg-[#F0F9FF] text-[#475569]'
            }`}
          >
            <ArrowRight className="size-3.5" aria-hidden="true" />
            <span>2º Depois</span>
          </span>

          <div className="size-32 rounded-3xl bg-white border-2 border-[#BAE6FD] p-2 flex items-center justify-center">
            <img
              src={getArasaacPictogramUrl(firstThen.then.arasaacId)}
              alt={firstThen.then.label}
              width={104}
              height={104}
              className="object-contain"
            />
          </div>

          <p className="text-xl font-bold text-[#0F172A]">
            {firstThen.then.label}
          </p>

          <div className="min-h-[56px] flex items-center justify-center w-full">
            {firstDone ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#F59E0B] text-[#0F172A] font-bold text-base">
                <Sparkles className="size-5" aria-hidden="true" />
                <span>Agora é a vez do Depois!</span>
              </div>
            ) : (
              <span className="text-sm font-medium text-[#64748B]">
                Conclua o 1º passo para liberar
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Editor drawer */}
      {editing ? (
        <div className="rounded-3xl bg-white border-2 border-[#BAE6FD] p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => setEditingSlot('first')}
              className={`px-3 py-1.5 min-h-10 rounded-xl text-sm font-bold border cursor-pointer text-left ${
                editingSlot === 'first'
                  ? 'bg-[#0284C7] text-white border-[#0284C7]'
                  : 'bg-[#F0F9FF] text-[#0F172A] border-[#BAE6FD]'
              }`}
            >
              Editando: 1º Primeiro ({firstThen.first.label})
            </button>
            <button
              type="button"
              onClick={() => setEditingSlot('then')}
              className={`px-3 py-1.5 min-h-10 rounded-xl text-sm font-bold border cursor-pointer text-left ${
                editingSlot === 'then'
                  ? 'bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]'
                  : 'bg-[#F0F9FF] text-[#0F172A] border-[#BAE6FD]'
              }`}
            >
              Editando: 2º Depois ({firstThen.then.label})
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-2.5">
            {cardBank.map((card) => {
              const isSelected = firstThen[editingSlot].id === card.id;
              return (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => handleSelectCard(card)}
                  className={`rounded-2xl border-2 p-2.5 flex flex-col items-center gap-1.5 text-center cursor-pointer transition ${
                    isSelected
                      ? 'border-[#0284C7] bg-[#F0F9FF]'
                      : 'border-[#BAE6FD] bg-white hover:border-[#0284C7]'
                  }`}
                >
                  <img
                    src={getArasaacPictogramUrl(card.arasaacId)}
                    alt={card.label}
                    width={48}
                    height={48}
                    className="object-contain"
                  />
                  <span className="text-xs font-bold text-[#0F172A] line-clamp-2">
                    {card.label}
                  </span>
                </button>
              );
            })}
          </div>

          <ArasaacCardAdder
            title="Ou busque outro pictograma ARASAAC para usar aqui"
            onAddCard={(card) => {
              onAddCardToBank(card);
              handleSelectCard(card);
            }}
          />
        </div>
      ) : null}
    </div>
  );
}
