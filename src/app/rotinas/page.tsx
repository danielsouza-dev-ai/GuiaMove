'use client';

import { useEffect, useState } from 'react';
import {
  ArrowDown,
  ArrowUp,
  ListChecks,
  Play,
  Plus,
  Shuffle,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';
import { SoundToggle } from '@/components/shared/SoundToggle';
import { BigActionButton } from '@/components/shared/BigActionButton';
import { ArasaacCardAdder } from '@/components/rotinas/ArasaacCardAdder';
import { ChildOrderBuilder } from '@/components/rotinas/ChildOrderBuilder';
import { FirstThenBoard } from '@/components/rotinas/FirstThenBoard';
import { RoutinePlayer } from '@/components/rotinas/RoutinePlayer';
import {
  DEFAULT_FIXED_ROUTINES,
  getArasaacPictogramUrl,
  getDefaultRoutinesData,
  loadRoutinesData,
  saveRoutinesData,
  type FirstThenConfig,
  type FixedRoutine,
  type RoutineCardItem,
  type RoutinesStorageData,
} from '@/lib/rotinas/routinesConfig';
import { soundEngine } from '@/lib/temporizador/soundEngine';

type RotinasTab = 'fixed' | 'child_order' | 'first_then';

export default function RotinasPage() {
  const [data, setData] = useState<RoutinesStorageData>(getDefaultRoutinesData);
  const [activeTab, setActiveTab] = useState<RotinasTab>('fixed');
  const [muted, setMuted] = useState(false);
  const [runningRoutine, setRunningRoutine] = useState<{
    title: string;
    steps: RoutineCardItem[];
  } | null>(null);

  // New fixed routine builder state
  const [creatingFixed, setCreatingFixed] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSteps, setNewSteps] = useState<RoutineCardItem[]>([]);

  useEffect(() => {
    setData(loadRoutinesData());
  }, []);

  const persistData = (next: RoutinesStorageData) => {
    setData(next);
    saveRoutinesData(next);
  };

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const handleAddCardToBank = (card: RoutineCardItem) => {
    persistData({
      ...data,
      cardBank: [...data.cardBank, card],
    });
  };

  const handleRemoveCardFromBank = (id: string) => {
    persistData({
      ...data,
      cardBank: data.cardBank.filter((c) => c.id !== id),
    });
  };

  const handleUpdateFirstThen = (firstThen: FirstThenConfig) => {
    persistData({
      ...data,
      firstThen,
    });
  };

  const handleSaveFixedRoutine = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = newTitle.trim();
    if (!cleanTitle || newSteps.length === 0) return;

    const created: FixedRoutine = {
      id: `fixed-${Date.now()}`,
      title: cleanTitle,
      description:
        newDescription.trim() || `${newSteps.length} passos sequenciados`,
      steps: newSteps,
    };

    persistData({
      ...data,
      fixedRoutines: [created, ...data.fixedRoutines],
    });
    setCreatingFixed(false);
    setNewTitle('');
    setNewDescription('');
    setNewSteps([]);
  };

  const handleDeleteFixedRoutine = (id: string) => {
    persistData({
      ...data,
      fixedRoutines: data.fixedRoutines.filter((r) => r.id !== id),
    });
  };

  const moveNewStep = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= newSteps.length) return;
    const copy = [...newSteps];
    const [moved] = copy.splice(idx, 1);
    copy.splice(target, 0, moved);
    setNewSteps(copy);
  };

  const isDefaultFixed = (id: string) =>
    DEFAULT_FIXED_ROUTINES.some((r) => r.id === id);

  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        title="Rotinas & Primeiro/Depois"
        backHref={runningRoutine ? undefined : '/'}
        rightSlot={<SoundToggle muted={muted} onToggle={handleToggleMute} />}
      />

      {runningRoutine ? (
        <RoutinePlayer
          title={runningRoutine.title}
          steps={runningRoutine.steps}
          muted={muted}
          onExit={() => setRunningRoutine(null)}
        />
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
          {/* Mode selector tabs */}
          <nav
            aria-label="Modos de rotina"
            className="grid grid-cols-1 sm:grid-cols-3 gap-2.5"
          >
            <button
              type="button"
              onClick={() => setActiveTab('fixed')}
              className={`min-h-[52px] px-4 py-3 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'fixed'
                  ? 'bg-[#0284C7] text-white border-[#0284C7]'
                  : 'bg-white text-[#0F172A] border-[#BAE6FD] hover:border-[#0284C7]'
              }`}
            >
              <ListChecks className="size-5 shrink-0" aria-hidden="true" />
              <span>Rotinas Fixas</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('child_order')}
              className={`min-h-[52px] px-4 py-3 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'child_order'
                  ? 'bg-[#0284C7] text-white border-[#0284C7]'
                  : 'bg-white text-[#0F172A] border-[#BAE6FD] hover:border-[#0284C7]'
              }`}
            >
              <Shuffle className="size-5 shrink-0" aria-hidden="true" />
              <span>Criança Escolhe a Ordem</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('first_then')}
              className={`min-h-[52px] px-4 py-3 rounded-2xl border-2 font-bold text-sm flex items-center justify-center gap-2 transition cursor-pointer ${
                activeTab === 'first_then'
                  ? 'bg-[#0284C7] text-white border-[#0284C7]'
                  : 'bg-white text-[#0F172A] border-[#BAE6FD] hover:border-[#0284C7]'
              }`}
            >
              <Sparkles className="size-5 shrink-0" aria-hidden="true" />
              <span>Primeiro / Depois</span>
            </button>
          </nav>

          {/* Tab 1: Fixed Routines */}
          {activeTab === 'fixed' ? (
            <section className="flex flex-col gap-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xl font-bold text-[#0F172A] text-balance">
                    Rotinas Fixas Salvas
                  </h2>
                  <p className="text-sm text-[#475569] text-pretty">
                    Toque em uma rotina pronta para abrir os cartões sequenciados na hora.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setCreatingFixed((v) => !v)}
                  className="inline-flex items-center gap-1.5 px-4 h-11 rounded-2xl bg-[#F59E0B] text-[#0F172A] font-bold text-sm cursor-pointer"
                >
                  {creatingFixed ? (
                    <>
                      <X className="size-4" aria-hidden="true" />
                      <span>Cancelar</span>
                    </>
                  ) : (
                    <>
                      <Plus className="size-4" aria-hidden="true" />
                      <span>Nova rotina fixa</span>
                    </>
                  )}
                </button>
              </div>

              {creatingFixed ? (
                <form
                  onSubmit={handleSaveFixedRoutine}
                  className="rounded-3xl bg-white border-2 border-[#0284C7] p-5 flex flex-col gap-4"
                >
                  <h3 className="text-lg font-bold text-[#0F172A]">
                    Criar Nova Rotina Fixa
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#0F172A]">
                        Nome da rotina
                      </span>
                      <input
                        type="text"
                        required
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Ex.: Rotina da Mochila"
                        className="h-11 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A]"
                      />
                    </label>
                    <label className="flex flex-col gap-1">
                      <span className="text-xs font-bold text-[#0F172A]">
                        Descrição curta (opcional)
                      </span>
                      <input
                        type="text"
                        value={newDescription}
                        onChange={(e) => setNewDescription(e.target.value)}
                        placeholder="Ex.: Antes de sair para a escola"
                        className="h-11 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A]"
                      />
                    </label>
                  </div>

                  {/* Selected sequence */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">
                      Passos da rotina ({newSteps.length})
                    </span>
                    {newSteps.length === 0 ? (
                      <p className="text-xs text-[#64748B] rounded-xl bg-[#F0F9FF] border border-dashed border-[#BAE6FD] p-3">
                        Toque nos cartões abaixo para adicionar passos na sequência.
                      </p>
                    ) : (
                      <div className="flex flex-col gap-2">
                        {newSteps.map((step, idx) => (
                          <div
                            key={`${step.id}-${idx}`}
                            className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF]/60 p-2.5 flex items-center justify-between gap-2"
                          >
                            <div className="flex items-center gap-3 min-w-0">
                              <span className="size-7 rounded-lg bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center tabular-nums shrink-0">
                                {idx + 1}
                              </span>
                              <img
                                src={getArasaacPictogramUrl(step.arasaacId)}
                                alt=""
                                width={36}
                                height={36}
                                className="rounded-lg bg-white p-0.5 object-contain shrink-0"
                              />
                              <span className="text-sm font-bold text-[#0F172A] truncate">
                                {step.label}
                              </span>
                            </div>

                            <div className="flex items-center gap-1 shrink-0">
                              <button
                                type="button"
                                onClick={() => moveNewStep(idx, -1)}
                                disabled={idx === 0}
                                aria-label={`Mover ${step.label} para cima`}
                                className="size-8 rounded-lg border border-[#BAE6FD] bg-white flex items-center justify-center text-[#0F172A] disabled:opacity-40 cursor-pointer"
                              >
                                <ArrowUp className="size-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveNewStep(idx, 1)}
                                disabled={idx === newSteps.length - 1}
                                aria-label={`Mover ${step.label} para baixo`}
                                className="size-8 rounded-lg border border-[#BAE6FD] bg-white flex items-center justify-center text-[#0F172A] disabled:opacity-40 cursor-pointer"
                              >
                                <ArrowDown className="size-3.5" aria-hidden="true" />
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setNewSteps((prev) =>
                                    prev.filter((_, i) => i !== idx),
                                  )
                                }
                                aria-label={`Remover passo ${step.label}`}
                                className="size-8 rounded-lg border border-[#BAE6FD] bg-white flex items-center justify-center text-red-600 cursor-pointer"
                              >
                                <Trash2 className="size-3.5" aria-hidden="true" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Pick from card bank */}
                  <div className="flex flex-col gap-2">
                    <span className="text-xs font-bold text-[#0F172A]">
                      Adicionar do banco de cartões:
                    </span>
                    <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
                      {data.cardBank.map((card) => (
                        <button
                          key={card.id}
                          type="button"
                          onClick={() => setNewSteps((prev) => [...prev, card])}
                          className="rounded-2xl border border-[#BAE6FD] hover:border-[#0284C7] bg-white p-2 flex flex-col items-center gap-1 text-center cursor-pointer"
                        >
                          <img
                            src={getArasaacPictogramUrl(card.arasaacId)}
                            alt={card.label}
                            width={40}
                            height={40}
                            className="object-contain"
                          />
                          <span className="text-[11px] font-bold text-[#0F172A] line-clamp-2">
                            {card.label}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <ArasaacCardAdder
                    title="Ou busque na ARASAAC para adicionar um novo cartão"
                    onAddCard={(card) => {
                      handleAddCardToBank(card);
                      setNewSteps((prev) => [...prev, card]);
                    }}
                  />

                  <BigActionButton
                    type="submit"
                    variant="primary"
                    disabled={!newTitle.trim() || newSteps.length === 0}
                    className="w-full"
                  >
                    <span>Salvar rotina fixa</span>
                  </BigActionButton>
                </form>
              ) : null}

              {/* Fixed routines grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {data.fixedRoutines.map((routine) => (
                  <div
                    key={routine.id}
                    data-testid={`fixed-routine-${routine.id}`}
                    className="rounded-3xl bg-white border-2 border-[#BAE6FD] p-5 flex flex-col justify-between gap-4 shadow-xs"
                  >
                    <div className="flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-lg font-bold text-[#0F172A] text-balance">
                            {routine.title}
                          </h3>
                          <p className="text-xs text-[#475569] text-pretty">
                            {routine.description}
                          </p>
                        </div>
                        {!isDefaultFixed(routine.id) ? (
                          <button
                            type="button"
                            onClick={() => handleDeleteFixedRoutine(routine.id)}
                            aria-label={`Excluir rotina ${routine.title}`}
                            className="size-9 rounded-xl border border-[#BAE6FD] flex items-center justify-center text-[#64748B] hover:text-red-600 cursor-pointer shrink-0"
                          >
                            <Trash2 className="size-4" aria-hidden="true" />
                          </button>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {routine.steps.map((s, idx) => (
                          <div
                            key={`${s.id}-${idx}`}
                            title={s.label}
                            className="size-11 shrink-0 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] p-1 flex items-center justify-center"
                          >
                            <img
                              src={getArasaacPictogramUrl(s.arasaacId)}
                              alt={s.label}
                              width={32}
                              height={32}
                              className="object-contain"
                            />
                          </div>
                        ))}
                      </div>
                    </div>

                    <BigActionButton
                      variant="primary"
                      onClick={() =>
                        setRunningRoutine({
                          title: routine.title,
                          steps: routine.steps,
                        })
                      }
                      className="w-full"
                    >
                      <Play className="size-5 fill-current" aria-hidden="true" />
                      <span>Iniciar rotina ({routine.steps.length} passos)</span>
                    </BigActionButton>
                  </div>
                ))}
              </div>
            </section>
          ) : null}

          {/* Tab 2: Child Chooses Order */}
          {activeTab === 'child_order' ? (
            <ChildOrderBuilder
              cardBank={data.cardBank}
              onAddCardToBank={handleAddCardToBank}
              onRemoveCardFromBank={handleRemoveCardFromBank}
              onStartRoutine={(title, steps) =>
                setRunningRoutine({ title, steps })
              }
            />
          ) : null}

          {/* Tab 3: First / Then */}
          {activeTab === 'first_then' ? (
            <FirstThenBoard
              firstThen={data.firstThen}
              cardBank={data.cardBank}
              muted={muted}
              onUpdateFirstThen={handleUpdateFirstThen}
              onAddCardToBank={handleAddCardToBank}
            />
          ) : null}
        </main>
      )}

      <footer className="py-3 px-4 text-center text-xs text-[#475569]">
        Pictogramas:{' '}
        <a
          href="https://arasaac.org"
          target="_blank"
          rel="noopener noreferrer"
          className="underline hover:text-[#0F172A]"
        >
          ARASAAC
        </a>{' '}
        · Autor: Sergio Palao · Gobierno de Aragón · CC BY-NC-SA 4.0
      </footer>
    </div>
  );
}
