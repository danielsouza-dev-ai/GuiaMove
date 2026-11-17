'use client';

import { useState } from 'react';
import { ArrowLeft, Check, Play, RotateCcw, Trash2 } from 'lucide-react';
import { BigActionButton } from '@/components/shared/BigActionButton';
import {
  getArasaacPictogramUrl,
  type RoutineCardItem,
} from '@/lib/rotinas/routinesConfig';
import { ArasaacCardAdder } from './ArasaacCardAdder';

interface ChildOrderBuilderProps {
  cardBank: RoutineCardItem[];
  onAddCardToBank: (card: RoutineCardItem) => void;
  onRemoveCardFromBank?: (id: string) => void;
  onStartRoutine: (title: string, steps: RoutineCardItem[]) => void;
}

export function ChildOrderBuilder({
  cardBank,
  onAddCardToBank,
  onRemoveCardFromBank,
  onStartRoutine,
}: ChildOrderBuilderProps) {
  const [phase, setPhase] = useState<'parent_filter' | 'child_order'>(
    'parent_filter',
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    cardBank.slice(0, 5).map((c) => c.id),
  );
  const [orderedIds, setOrderedIds] = useState<string[]>([]);

  const selectedCards = selectedIds
    .map((id) => cardBank.find((c) => c.id === id))
    .filter((c): c is RoutineCardItem => Boolean(c));

  const orderedCards = orderedIds
    .map((id) => selectedCards.find((c) => c.id === id))
    .filter((c): c is RoutineCardItem => Boolean(c));

  const remainingCards = selectedCards.filter(
    (c) => !orderedIds.includes(c.id),
  );

  const toggleCardSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleGoToChildPhase = () => {
    if (selectedCards.length === 0) return;
    setOrderedIds([]);
    setPhase('child_order');
  };

  if (phase === 'child_order') {
    return (
      <div
        data-testid="child-order-phase"
        className="flex flex-col gap-5"
      >
        <div className="rounded-3xl bg-white border border-[#BAE6FD] p-5 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] text-balance">
                Qual você quer fazer primeiro?
              </h2>
              <p className="text-sm text-[#475569] text-pretty">
                Toque nos cartões abaixo na ordem que preferir. Toque no número lá em cima para tirar.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setOrderedIds([])}
                className="inline-flex items-center gap-1.5 px-3 h-10 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-xs font-bold text-[#0F172A] cursor-pointer"
              >
                <RotateCcw className="size-3.5" aria-hidden="true" />
                <span>Limpar ordem</span>
              </button>
              <button
                type="button"
                onClick={() => setPhase('parent_filter')}
                className="inline-flex items-center gap-1.5 px-3 h-10 rounded-xl border border-[#BAE6FD] bg-white text-xs font-bold text-[#475569] cursor-pointer"
              >
                <ArrowLeft className="size-3.5" aria-hidden="true" />
                <span>Ajustar cartões</span>
              </button>
            </div>
          </div>

          {/* Numbered chronological slots */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {selectedCards.map((_, slotIdx) => {
              const placed = orderedCards[slotIdx];
              return placed ? (
                <button
                  key={`slot-${slotIdx}-${placed.id}`}
                  type="button"
                  onClick={() =>
                    setOrderedIds((prev) =>
                      prev.filter((id) => id !== placed.id),
                    )
                  }
                  aria-label={`Remover ${placed.label} da posição ${slotIdx + 1}`}
                  className="rounded-2xl border-2 border-[#0284C7] bg-[#F0F9FF] p-3 flex flex-col items-center gap-2 text-center cursor-pointer active:scale-95 transition"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-[#0284C7] text-white text-xs font-bold tabular-nums">
                    {slotIdx + 1}º
                  </span>
                  <img
                    src={getArasaacPictogramUrl(placed.arasaacId)}
                    alt={placed.label}
                    width={56}
                    height={56}
                    className="object-contain bg-white rounded-xl p-1"
                  />
                  <span className="text-xs font-bold text-[#0F172A] line-clamp-2">
                    {placed.label}
                  </span>
                </button>
              ) : (
                <div
                  key={`empty-slot-${slotIdx}`}
                  className="rounded-2xl border-2 border-dashed border-[#BAE6FD] bg-[#F0F9FF]/40 p-3 min-h-[124px] flex flex-col items-center justify-center gap-1 text-center"
                >
                  <span className="px-2.5 py-0.5 rounded-full bg-white border border-[#BAE6FD] text-[#475569] text-xs font-bold tabular-nums">
                    {slotIdx + 1}º
                  </span>
                  <span className="text-[11px] text-[#64748B]">
                    Toque abaixo
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Remaining pool to pick from */}
        {remainingCards.length > 0 ? (
          <div className="rounded-3xl bg-white border border-[#BAE6FD] p-5 flex flex-col gap-3">
            <h3 className="text-sm font-bold text-[#0F172A]">
              Cartões disponíveis ({remainingCards.length})
            </h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {remainingCards.map((card) => (
                <button
                  key={card.id}
                  type="button"
                  onClick={() => setOrderedIds((prev) => [...prev, card.id])}
                  className="rounded-2xl border-2 border-[#BAE6FD] hover:border-[#0284C7] bg-white p-3 flex flex-col items-center gap-2 text-center cursor-pointer active:scale-95 transition"
                >
                  <img
                    src={getArasaacPictogramUrl(card.arasaacId)}
                    alt={card.label}
                    width={64}
                    height={64}
                    className="object-contain"
                  />
                  <span className="text-sm font-bold text-[#0F172A]">
                    {card.label}
                  </span>
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <BigActionButton
          variant="amber"
          disabled={orderedCards.length === 0}
          onClick={() =>
            onStartRoutine('Minha Rotina Escolhida', orderedCards)
          }
          className="w-full"
        >
          <Play className="size-5 fill-current" aria-hidden="true" />
          <span>
            Começar minha rotina! ({orderedCards.length} de {selectedCards.length})
          </span>
        </BigActionButton>
      </div>
    );
  }

  return (
    <div
      data-testid="parent-filter-phase"
      className="flex flex-col gap-5"
    >
      <div className="rounded-3xl bg-white border border-[#BAE6FD] p-5 flex flex-col gap-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-[#0F172A] text-balance">
              1. Escolha quais cartões ficam disponíveis hoje
            </h2>
            <p className="text-sm text-[#475569] text-pretty">
              Marque apenas os cartões que você quer liberar (ex.: 7 demandas). Depois a criança decide a ordem.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSelectedIds([])}
              className="px-3 h-9 rounded-xl border border-[#BAE6FD] bg-white text-xs font-bold text-[#475569] cursor-pointer"
            >
              Limpar seleção
            </button>
            <span className="px-3 py-1 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-bold text-[#0284C7] tabular-nums">
              {selectedCards.length} selecionados
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {cardBank.map((card) => {
            const isSelected = selectedIds.includes(card.id);
            const isCustom = card.id.startsWith('custom-');
            return (
              <div
                key={card.id}
                className={`relative rounded-2xl border-2 p-3 flex flex-col items-center gap-2 text-center transition ${
                  isSelected
                    ? 'border-[#0284C7] bg-[#F0F9FF]'
                    : 'border-[#BAE6FD] bg-white hover:border-[#0284C7]/60'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleCardSelection(card.id)}
                  aria-pressed={isSelected}
                  className="flex flex-col items-center gap-2 w-full cursor-pointer"
                >
                  <span
                    className={`self-start size-6 rounded-full flex items-center justify-center border ${
                      isSelected
                        ? 'bg-[#0284C7] border-[#0284C7] text-white'
                        : 'bg-white border-[#BAE6FD] text-transparent'
                    }`}
                  >
                    <Check className="size-3.5" aria-hidden="true" />
                  </span>
                  <img
                    src={getArasaacPictogramUrl(card.arasaacId)}
                    alt={card.label}
                    width={56}
                    height={56}
                    className="object-contain bg-white rounded-xl p-1"
                  />
                  <span className="text-xs font-bold text-[#0F172A]">
                    {card.label}
                  </span>
                </button>

                {isCustom && onRemoveCardFromBank ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIds((prev) =>
                        prev.filter((id) => id !== card.id),
                      );
                      onRemoveCardFromBank(card.id);
                    }}
                    aria-label={`Remover cartão ${card.label}`}
                    className="absolute top-2 right-2 size-7 rounded-full bg-white border border-[#BAE6FD] flex items-center justify-center text-[#64748B] hover:text-red-600 cursor-pointer"
                  >
                    <Trash2 className="size-3.5" aria-hidden="true" />
                  </button>
                ) : null}
              </div>
            );
          })}
        </div>

        <ArasaacCardAdder
          onAddCard={(card) => {
            onAddCardToBank(card);
            setSelectedIds((prev) => [...prev, card.id]);
          }}
        />
      </div>

      <BigActionButton
        variant="primary"
        disabled={selectedCards.length === 0}
        onClick={handleGoToChildPhase}
        className="w-full"
      >
        <span>
          Entregar para a criança escolher a ordem ({selectedCards.length})
        </span>
      </BigActionButton>
    </div>
  );
}
