'use client';

import { useEffect, useState } from 'react';
import { Play, Plus, Trash2 } from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';
import { SoundToggle } from '@/components/shared/SoundToggle';
import { BigActionButton } from '@/components/shared/BigActionButton';
import { SequencingGame } from '@/components/sequenciamento/SequencingGame';
import { CustomChallengeModal } from '@/components/sequenciamento/CustomChallengeModal';
import {
  DEFAULT_SEQUENCING_CHALLENGES,
  getSequencingPictogramUrl,
  loadCustomChallenges,
  saveCustomChallenges,
  type SequencingChallenge,
  type SequencingLevel,
} from '@/lib/sequenciamento/sequencingConfig';
import { soundEngine } from '@/lib/temporizador/soundEngine';

export default function SequenciamentoPage() {
  const [customChallenges, setCustomChallenges] = useState<
    SequencingChallenge[]
  >([]);
  const [selectedLevel, setSelectedLevel] = useState<'all' | SequencingLevel>(
    'all',
  );
  const [activeChallengeId, setActiveChallengeId] = useState<string | null>(
    null,
  );
  const [modalOpen, setModalOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  useEffect(() => {
    setCustomChallenges(loadCustomChallenges());
  }, []);

  const allChallenges = [...customChallenges, ...DEFAULT_SEQUENCING_CHALLENGES];
  const filteredChallenges =
    selectedLevel === 'all'
      ? allChallenges
      : allChallenges.filter((c) => c.level === selectedLevel);

  const activeChallenge =
    allChallenges.find((c) => c.id === activeChallengeId) ?? null;

  const activeIndex = activeChallenge
    ? filteredChallenges.findIndex((c) => c.id === activeChallenge.id)
    : -1;
  const nextChallenge =
    activeIndex >= 0 && activeIndex < filteredChallenges.length - 1
      ? filteredChallenges[activeIndex + 1]
      : undefined;

  const handleToggleMute = () => {
    const next = !muted;
    setMuted(next);
    soundEngine.setMuted(next);
  };

  const handleSaveCustom = (challenge: SequencingChallenge) => {
    const next = [challenge, ...customChallenges];
    setCustomChallenges(next);
    saveCustomChallenges(next);
    setModalOpen(false);
    setActiveChallengeId(challenge.id);
  };

  const handleDeleteCustom = (id: string) => {
    const next = customChallenges.filter((c) => c.id !== id);
    setCustomChallenges(next);
    saveCustomChallenges(next);
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        title="Sequenciamento Lógico"
        backHref={activeChallenge ? undefined : '/'}
        rightSlot={<SoundToggle muted={muted} onToggle={handleToggleMute} />}
      />

      {activeChallenge ? (
        <SequencingGame
          challenge={activeChallenge}
          muted={muted}
          onBack={() => setActiveChallengeId(null)}
          onNextChallenge={
            nextChallenge
              ? () => setActiveChallengeId(nextChallenge.id)
              : undefined
          }
        />
      ) : (
        <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-6 flex flex-col gap-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-[#0F172A] text-balance">
                O que vem antes e depois?
              </h2>
              <p className="text-sm text-[#475569] text-pretty">
                Escolha um desafio para a criança montar a sequência lógica do dia a dia sem pressão.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-4 h-11 rounded-2xl bg-[#F59E0B] text-[#0F172A] font-bold text-sm shrink-0 whitespace-nowrap cursor-pointer"
            >
              <Plus className="size-4" aria-hidden="true" />
              <span>Novo desafio lógico</span>
            </button>
          </div>

          {/* Level filter tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                { id: 'all', label: `Todos (${allChallenges.length})` },
                { id: 1, label: 'Nível 1 · 3 passos' },
                { id: 2, label: 'Nível 2 · 4 passos' },
                { id: 3, label: 'Nível 3 · Dia inteiro' },
              ] as const
            ).map((tab) => (
              <button
                key={String(tab.id)}
                type="button"
                onClick={() => setSelectedLevel(tab.id)}
                className={`px-3.5 h-10 rounded-2xl text-xs sm:text-sm font-bold border transition cursor-pointer ${
                  selectedLevel === tab.id
                    ? 'bg-[#0284C7] text-white border-[#0284C7]'
                    : 'bg-white text-[#475569] border-[#BAE6FD] hover:border-[#0284C7]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Challenge grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredChallenges.map((challenge) => (
              <div
                key={challenge.id}
                data-testid={`seq-card-${challenge.id}`}
                className="rounded-3xl bg-white border-2 border-[#BAE6FD] p-5 flex flex-col justify-between gap-4 shadow-xs"
              >
                <div className="flex flex-col gap-2.5">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-[11px] font-bold text-[#0284C7] mb-1">
                        {challenge.levelLabel}
                      </span>
                      <h3 className="text-lg font-bold text-[#0F172A] text-balance">
                        {challenge.title}
                      </h3>
                    </div>

                    {challenge.isCustom ? (
                      <button
                        type="button"
                        onClick={() => handleDeleteCustom(challenge.id)}
                        aria-label={`Excluir desafio ${challenge.title}`}
                        className="size-9 rounded-xl border border-[#BAE6FD] flex items-center justify-center text-[#64748B] hover:text-red-600 cursor-pointer shrink-0"
                      >
                        <Trash2 className="size-4" aria-hidden="true" />
                      </button>
                    ) : null}
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {challenge.steps.map((step, idx) => (
                      <div
                        key={`${step.id}-${idx}`}
                        title={step.label}
                        className="size-11 shrink-0 rounded-xl bg-[#F0F9FF] border border-[#BAE6FD] p-1 flex items-center justify-center"
                      >
                        <img
                          src={getSequencingPictogramUrl(step.arasaacId)}
                          alt={step.label}
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
                  onClick={() => setActiveChallengeId(challenge.id)}
                  className="w-full"
                >
                  <Play className="size-5 fill-current" aria-hidden="true" />
                  <span>Jogar ({challenge.steps.length} passos)</span>
                </BigActionButton>
              </div>
            ))}
          </div>
        </main>
      )}

      {modalOpen ? (
        <CustomChallengeModal
          onSave={handleSaveCustom}
          onClose={() => setModalOpen(false)}
        />
      ) : null}

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
