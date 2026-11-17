'use client';

import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  BookmarkPlus,
  Check,
  Play,
  Plus,
  RotateCcw,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { BigActionButton } from '@/components/shared/BigActionButton';
import {
  getArasaacPictogramUrl,
  loadChildOrderDraft,
  saveChildOrderDraft,
  type RoutineCardItem,
} from '@/lib/rotinas/routinesConfig';
import { ArasaacCardAdder } from './ArasaacCardAdder';

interface ChildOrderBuilderProps {
  cardBank: RoutineCardItem[];
  onAddCardToBank: (card: RoutineCardItem) => void;
  onRemoveCardFromBank?: (id: string) => void;
  onStartRoutine: (title: string, steps: RoutineCardItem[]) => void;
  onSaveAsFixedRoutine?: (title: string, steps: RoutineCardItem[]) => void;
}

export function ChildOrderBuilder({
  cardBank,
  onAddCardToBank,
  onRemoveCardFromBank,
  onStartRoutine,
  onSaveAsFixedRoutine,
}: ChildOrderBuilderProps) {
  const [phase, setPhase] = useState<'parent_filter' | 'child_order'>(
    'parent_filter',
  );
  const [selectedIds, setSelectedIds] = useState<string[]>(() =>
    cardBank.slice(0, 5).map((c) => c.id),
  );
  const [orderedIds, setOrderedIds] = useState<string[]>([]);
  const [filterText, setFilterText] = useState('');
  const [filterTab, setFilterTab] = useState<'all' | 'selected' | 'custom'>(
    'all',
  );
  const [adderOpen, setAdderOpen] = useState(false);
  const [savingFixedOpen, setSavingFixedOpen] = useState(false);
  const [fixedTitle, setFixedTitle] = useState('');
  const [savedNotice, setSavedNotice] = useState(false);
  const draftLoadedRef = useRef(false);

  useEffect(() => {
    const draft = loadChildOrderDraft(cardBank);
    setPhase(draft.phase);
    setSelectedIds(draft.selectedIds);
    setOrderedIds(draft.orderedIds);
    draftLoadedRef.current = true;
    // Restore persisted draft on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!draftLoadedRef.current) return;
    saveChildOrderDraft({ phase, selectedIds, orderedIds });
  }, [phase, selectedIds, orderedIds]);

  const selectedCards = selectedIds
    .map((id) => cardBank.find((c) => c.id === id))
    .filter((c): c is RoutineCardItem => Boolean(c));

  const orderedCards = orderedIds
    .map((id) => selectedCards.find((c) => c.id === id))
    .filter((c): c is RoutineCardItem => Boolean(c));

  const remainingCards = selectedCards.filter(
    (c) => !orderedIds.includes(c.id),
  );

  const filteredBankCards = cardBank.filter((card) => {
    const matchesText = card.label
      .toLowerCase()
      .includes(filterText.trim().toLowerCase());
    if (!matchesText) return false;
    if (filterTab === 'selected') return selectedIds.includes(card.id);
    if (filterTab === 'custom') return card.id.startsWith('custom-');
    return true;
  });

  const scrollToTopSafe = () => {
    try {
      window.scrollTo?.({ top: 0, behavior: 'smooth' });
    } catch {
      // Ignore in test environments
    }
  };

  const toggleCardSelection = (id: string) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleGoToChildPhase = () => {
    if (selectedCards.length === 0) return;
    setOrderedIds([]);
    setPhase('child_order');
    scrollToTopSafe();
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
                onClick={() => {
                  setPhase('parent_filter');
                  scrollToTopSafe();
                }}
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

        {orderedCards.length > 0 && onSaveAsFixedRoutine ? (
          <div className="rounded-2xl bg-white border border-[#BAE6FD] p-4 flex flex-col gap-3">
            {savedNotice ? (
              <div className="flex items-center justify-between gap-2 text-sm font-bold text-[#0369A1]">
                <span className="inline-flex items-center gap-1.5">
                  <Check className="size-4" aria-hidden="true" />
                  Sequência salva em Rotinas Fixas!
                </span>
                <button
                  type="button"
                  onClick={() => setSavedNotice(false)}
                  className="text-xs underline text-[#475569] cursor-pointer"
                >
                  Fechar
                </button>
              </div>
            ) : savingFixedOpen ? (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const title = fixedTitle.trim();
                  if (!title) return;
                  onSaveAsFixedRoutine(title, orderedCards);
                  setFixedTitle('');
                  setSavingFixedOpen(false);
                  setSavedNotice(true);
                }}
                className="flex flex-col sm:flex-row gap-2"
              >
                <input
                  type="text"
                  required
                  value={fixedTitle}
                  onChange={(e) => setFixedTitle(e.target.value)}
                  placeholder="Nome da rotina (ex: Rotina da tarde)"
                  aria-label="Nome para salvar nas rotinas fixas"
                  className="flex-1 min-w-0 h-10 px-3 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF]/40 text-sm text-[#0F172A]"
                />
                <div className="flex items-center gap-2">
                  <button
                    type="submit"
                    disabled={!fixedTitle.trim()}
                    className="px-4 h-10 rounded-xl bg-[#0284C7] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
                  >
                    Salvar
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSavingFixedOpen(false);
                      setFixedTitle('');
                    }}
                    className="px-3 h-10 rounded-xl border border-[#BAE6FD] bg-white text-xs font-bold text-[#475569] cursor-pointer"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs text-[#475569]">
                  Gostou dessa sequência? Salve para reutilizar outros dias.
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setSavedNotice(false);
                    setSavingFixedOpen(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 h-9 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF] text-xs font-bold text-[#0284C7] hover:bg-[#E0F2FE] cursor-pointer"
                >
                  <BookmarkPlus className="size-4" aria-hidden="true" />
                  <span>Salvar nas rotinas fixas</span>
                </button>
              </div>
            )}
          </div>
        ) : null}
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
              Filtre e marque apenas os cartões que você quer liberar hoje. Depois a criança decide a ordem.
            </p>
          </div>
          <div className="flex items-center gap-2 shrink-0">
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

        {/* Selected tray: instant overview regardless of bank size */}
        {selectedCards.length > 0 ? (
          <div
            data-testid="selected-cards-tray"
            className="rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] p-3 flex flex-wrap items-center gap-2"
          >
            <span className="text-xs font-bold text-[#0369A1] mr-1">
              Selecionados para hoje:
            </span>
            {selectedCards.map((card) => (
              <button
                key={`tray-${card.id}`}
                type="button"
                onClick={() => toggleCardSelection(card.id)}
                title={`Remover ${card.label} da seleção`}
                className="inline-flex items-center gap-1.5 pl-1.5 pr-2.5 py-1 rounded-xl bg-white border border-[#BAE6FD] text-xs font-bold text-[#0F172A] hover:border-red-300 cursor-pointer"
              >
                <img
                  src={getArasaacPictogramUrl(card.arasaacId)}
                  alt=""
                  width={22}
                  height={22}
                  className="rounded-md object-contain"
                />
                <span>{card.label}</span>
                <X className="size-3.5 text-[#64748B]" aria-hidden="true" />
              </button>
            ))}
          </div>
        ) : null}

        {/* Smart Search & Filter Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="relative flex-1 min-w-0">
            <Search
              className="size-4 text-[#64748B] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
              aria-hidden="true"
            />
            <input
              type="search"
              aria-label="Filtrar cartões salvos"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              placeholder="Filtrar cartões pelo nome..."
              className="w-full min-w-0 h-10 pl-9 pr-3 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF]/40 text-sm text-[#0F172A]"
            />
          </div>

          <div className="flex flex-wrap items-center gap-1.5 shrink-0">
            {(
              [
                { id: 'all', label: `Todos (${cardBank.length})` },
                { id: 'selected', label: `Selecionados (${selectedCards.length})` },
                {
                  id: 'custom',
                  label: `Criados por mim (${
                    cardBank.filter((c) => c.id.startsWith('custom-')).length
                  })`,
                },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterTab(tab.id)}
                className={`px-3 h-9 rounded-xl text-xs font-bold border cursor-pointer transition ${
                  filterTab === tab.id
                    ? 'bg-[#0284C7] text-white border-[#0284C7]'
                    : 'bg-white text-[#475569] border-[#BAE6FD] hover:border-[#0284C7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Scroll-bounded card bank so button below stays reachable */}
        <div className="max-h-[340px] overflow-y-auto p-1 -mx-1">
          {filteredBankCards.length === 0 ? (
            <p className="text-sm text-[#64748B] text-center py-8">
              Nenhum cartão encontrado com esse filtro.
            </p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
              {filteredBankCards.map((card) => {
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
          )}
        </div>

        {/* Collapsible drawer to create new ARASAAC cards */}
        <div className="flex flex-col gap-3 pt-1 border-t border-[#BAE6FD]/60">
          <button
            type="button"
            onClick={() => setAdderOpen((v) => !v)}
            className="self-start inline-flex items-center gap-1.5 px-4 h-10 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-sm font-bold text-[#0284C7] hover:bg-[#E0F2FE] cursor-pointer"
          >
            {adderOpen ? (
              <>
                <X className="size-4" aria-hidden="true" />
                <span>Fechar busca ARASAAC</span>
              </>
            ) : (
              <>
                <Plus className="size-4" aria-hidden="true" />
                <span>Criar novo cartão na ARASAAC</span>
              </>
            )}
          </button>

          {adderOpen ? (
            <ArasaacCardAdder
              onAddCard={(card) => {
                onAddCardToBank(card);
                setSelectedIds((prev) => [...prev, card.id]);
              }}
            />
          ) : null}
        </div>
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
