'use client';

import { useState } from 'react';
import { X } from 'lucide-react';
import {
  ZONES,
  type StrategyIcon,
  type StrategyType,
  type ZoneId,
  type ZoneStrategyConfig,
} from '@/lib/termometro/zones';
import { BigActionButton } from '@/components/shared/BigActionButton';

interface ParentalEditorModalProps {
  config: Record<ZoneId, ZoneStrategyConfig>;
  onSave: (next: Record<ZoneId, ZoneStrategyConfig>) => void;
  onClose: () => void;
}

const STRATEGY_OPTIONS: Array<{ id: StrategyType; label: string }> = [
  { id: 'breathing', label: 'Respiração Guiada' },
  { id: 'calm_sound', label: 'Som Suave' },
  { id: 'pause_button', label: 'Botão de Pausa' },
  { id: 'custom_text', label: 'Texto dos Pais' },
];

const ICON_OPTIONS: Array<{ id: StrategyIcon; label: string }> = [
  { id: 'heart', label: 'Abraço' },
  { id: 'water', label: 'Água' },
  { id: 'headphones', label: 'Fone' },
  { id: 'hand', label: 'Pausa' },
  { id: 'wind', label: 'Respirar' },
];

export function ParentalEditorModal({
  config,
  onSave,
  onClose,
}: ParentalEditorModalProps) {
  const [draft, setDraft] = useState<Record<ZoneId, ZoneStrategyConfig>>(config);

  const updateZone = (
    zoneId: ZoneId,
    patch: Partial<ZoneStrategyConfig>,
  ) => {
    setDraft((prev) => ({
      ...prev,
      [zoneId]: { ...prev[zoneId], ...patch },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white border-2 border-[#BAE6FD] rounded-3xl max-w-xl w-full p-6 flex flex-col gap-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-[#0F172A]">
              Configurar Estratégias
            </h2>
            <p className="text-xs text-[#475569]">
              Escolha o que abre direto quando a criança toca em cada zona.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="w-10 h-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-[#0F172A]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {ZONES.map((zone) => {
            const current = draft[zone.id];
            return (
              <div
                key={zone.id}
                className="rounded-2xl border border-[#BAE6FD] p-4 bg-[#F0F9FF]/50 flex flex-col gap-3"
              >
                <div className="flex items-center gap-2 font-bold text-[#0F172A]">
                  <span>{zone.emoji}</span>
                  <span>Zona {zone.label}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {STRATEGY_OPTIONS.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => updateZone(zone.id, { type: opt.id })}
                      className={`py-2 px-2 rounded-xl text-xs font-bold border transition ${
                        current.type === opt.id
                          ? 'bg-[#0284C7] text-white border-[#0284C7]'
                          : 'bg-white text-[#0F172A] border-[#BAE6FD]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {current.type === 'custom_text' ? (
                  <div className="flex flex-col gap-2">
                    <input
                      type="text"
                      value={current.text ?? ''}
                      onChange={(e) =>
                        updateZone(zone.id, { text: e.target.value })
                      }
                      placeholder="Ex.: Abraçar o urso e tomar 3 goles de água"
                      className="w-full h-11 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A]"
                    />
                    <div className="flex flex-wrap gap-1.5">
                      {ICON_OPTIONS.map((ic) => (
                        <button
                          key={ic.id}
                          type="button"
                          onClick={() => updateZone(zone.id, { icon: ic.id })}
                          className={`px-3 py-1 rounded-lg text-xs font-semibold border ${
                            (current.icon ?? 'heart') === ic.id
                              ? 'bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]'
                              : 'bg-white text-[#475569] border-[#BAE6FD]'
                          }`}
                        >
                          {ic.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>

        <BigActionButton onClick={() => onSave(draft)} className="w-full">
          Salvar estratégias
        </BigActionButton>
      </div>
    </div>
  );
}
