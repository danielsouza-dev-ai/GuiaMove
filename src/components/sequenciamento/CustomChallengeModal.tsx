'use client';

import { useEffect, useState } from 'react';
import { ArrowDown, ArrowUp, Trash2, X } from 'lucide-react';
import { BigActionButton } from '@/components/shared/BigActionButton';
import { ArasaacCardAdder } from '@/components/rotinas/ArasaacCardAdder';
import {
  getSequencingPictogramUrl,
  type SequencingChallenge,
  type SequencingLevel,
  type SequencingStep,
} from '@/lib/sequenciamento/sequencingConfig';

interface CustomChallengeModalProps {
  onSave: (challenge: SequencingChallenge) => void;
  onClose: () => void;
}

export function CustomChallengeModal({
  onSave,
  onClose,
}: CustomChallengeModalProps) {
  const [title, setTitle] = useState('');
  const [explanation, setExplanation] = useState('');
  const [steps, setSteps] = useState<SequencingStep[]>([]);

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  const moveStep = (idx: number, delta: -1 | 1) => {
    const target = idx + delta;
    if (target < 0 || target >= steps.length) return;
    const copy = [...steps];
    const [moved] = copy.splice(idx, 1);
    copy.splice(target, 0, moved);
    setSteps(copy);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanTitle = title.trim();
    if (!cleanTitle || steps.length < 3) return;

    const level: SequencingLevel =
      steps.length <= 3 ? 1 : steps.length === 4 ? 2 : 3;
    const levelLabel =
      level === 1
        ? 'Personalizado · 3 passos'
        : level === 2
          ? 'Personalizado · 4 passos'
          : `Personalizado · ${steps.length} passos`;

    onSave({
      id: `custom-seq-${Date.now()}`,
      title: cleanTitle,
      level,
      levelLabel,
      explanation:
        explanation.trim() ||
        `Muito bem! Você organizou todos os ${steps.length} passos de "${cleanTitle}" na ordem certa!`,
      steps,
      isCustom: true,
    });
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="custom-seq-modal-title"
      className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border-2 border-[#BAE6FD] rounded-3xl max-w-xl w-full max-h-[90dvh] overflow-hidden flex flex-col">
        <form
          onSubmit={handleSubmit}
          className="p-6 overflow-y-auto flex flex-col gap-4"
        >
          <div className="flex items-center justify-between gap-2">
            <div>
              <h2
                id="custom-seq-modal-title"
                className="text-xl font-bold text-[#0F172A] text-balance"
              >
                Novo Desafio Lógico
              </h2>
              <p className="text-xs text-[#475569] text-pretty">
                Adicione de 3 a 5 cartões na ordem correta. O jogo embaralha automaticamente para a criança.
              </p>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fechar"
              className="size-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-[#0F172A] shrink-0 cursor-pointer"
            >
              <X className="size-5" aria-hidden="true" />
            </button>
          </div>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#0F172A]">
              Nome do desafio
            </span>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex.: Arrumar a mochila para a escola"
              className="h-11 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A] min-w-0"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs font-bold text-[#0F172A]">
              Frase de explicação ao acertar (opcional)
            </span>
            <input
              type="text"
              value={explanation}
              onChange={(e) => setExplanation(e.target.value)}
              placeholder="Ex.: Primeiro pegamos o caderno, depois colocamos na mochila!"
              className="h-11 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A] min-w-0"
            />
          </label>

          <div className="flex flex-col gap-2">
            <span className="text-xs font-bold text-[#0F172A]">
              Passos na ordem correta ({steps.length}/5 · mínimo 3)
            </span>
            {steps.length === 0 ? (
              <p className="text-xs text-[#64748B] rounded-xl bg-[#F0F9FF] border border-dashed border-[#BAE6FD] p-3">
                Busque pictogramas na ARASAAC abaixo para montar os passos da sequência.
              </p>
            ) : (
              <div className="flex flex-col gap-2">
                {steps.map((step, idx) => (
                  <div
                    key={`${step.id}-${idx}`}
                    className="rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF]/60 p-2.5 flex items-center justify-between gap-2"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <span className="size-7 rounded-lg bg-[#0284C7] text-white text-xs font-bold flex items-center justify-center tabular-nums shrink-0">
                        {idx + 1}
                      </span>
                      <img
                        src={getSequencingPictogramUrl(step.arasaacId)}
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
                        onClick={() => moveStep(idx, -1)}
                        disabled={idx === 0}
                        aria-label={`Mover ${step.label} para cima`}
                        className="size-8 rounded-lg border border-[#BAE6FD] bg-white flex items-center justify-center text-[#0F172A] disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowUp className="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() => moveStep(idx, 1)}
                        disabled={idx === steps.length - 1}
                        aria-label={`Mover ${step.label} para baixo`}
                        className="size-8 rounded-lg border border-[#BAE6FD] bg-white flex items-center justify-center text-[#0F172A] disabled:opacity-40 cursor-pointer"
                      >
                        <ArrowDown className="size-3.5" aria-hidden="true" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setSteps((prev) => prev.filter((_, i) => i !== idx))
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

          {steps.length < 5 ? (
            <ArasaacCardAdder
              title="Buscar passo na ARASAAC"
              onAddCard={(card) => {
                if (steps.length >= 5) return;
                setSteps((prev) => [
                  ...prev,
                  {
                    id: card.id,
                    label: card.label,
                    arasaacId: card.arasaacId,
                  },
                ]);
              }}
            />
          ) : null}

          <BigActionButton
            type="submit"
            variant="primary"
            disabled={!title.trim() || steps.length < 3}
            className="w-full"
          >
            <span>Salvar desafio lógico</span>
          </BigActionButton>
        </form>
      </div>
    </div>
  );
}
