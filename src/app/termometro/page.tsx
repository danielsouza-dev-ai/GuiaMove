'use client';

import { useState } from 'react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';
import { ParentalLock } from '@/components/shared/ParentalLock';
import { SoundToggle } from '@/components/shared/SoundToggle';
import { ParentalEditorModal } from '@/components/termometro/ParentalEditorModal';
import { RegulationView } from '@/components/termometro/RegulationView';
import {
  DEFAULT_ZONE_STRATEGIES,
  TERMOMETRO_STORAGE_KEY,
  ZONES,
  type ZoneId,
  type ZoneStrategyConfig,
} from '@/lib/termometro/zones';
import { getLocalJson, setLocalJson } from '@/utils/storage';

export default function TermometroPage() {
  const [config, setConfig] = useState<Record<ZoneId, ZoneStrategyConfig>>(() => {
    const saved = getLocalJson<Partial<Record<ZoneId, ZoneStrategyConfig>>>(
      TERMOMETRO_STORAGE_KEY,
      {},
    );
    return {
      ...DEFAULT_ZONE_STRATEGIES,
      ...saved,
    };
  });
  const [activeZoneId, setActiveZoneId] = useState<ZoneId | null>(null);
  const [editorOpen, setEditorOpen] = useState(false);
  const [muted, setMuted] = useState(false);

  const activeZone = ZONES.find((z) => z.id === activeZoneId) ?? null;

  const handleSaveConfig = (next: Record<ZoneId, ZoneStrategyConfig>) => {
    setConfig(next);
    setLocalJson(TERMOMETRO_STORAGE_KEY, next);
    setEditorOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        title="Termômetro Sensorial"
        backHref={activeZone ? undefined : '/'}
        rightSlot={
          <div className="flex items-center gap-2">
            <SoundToggle muted={muted} onToggle={() => setMuted((m) => !m)} />
            {!activeZone ? (
              <ParentalLock
                label="Editar"
                onUnlock={() => setEditorOpen(true)}
              />
            ) : null}
          </div>
        }
      />

      {activeZone ? (
        <RegulationView
          zone={activeZone}
          strategy={config[activeZone.id]}
          muted={muted}
          onBack={() => setActiveZoneId(null)}
        />
      ) : (
        <main className="flex-1 max-w-2xl w-full mx-auto px-4 py-6 flex flex-col gap-5">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-[#0F172A]">
              Como você está se sentindo agora?
            </h2>
            <p className="mt-1 text-sm text-[#475569]">
              Toque em uma cor para abrir a estratégia combinada.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
            {ZONES.map((zone) => (
              <button
                key={zone.id}
                type="button"
                onClick={() => setActiveZoneId(zone.id)}
                className={`rounded-3xl border-4 p-6 flex flex-col items-center justify-center text-center gap-3 min-h-[150px] active:scale-[0.98] transition touch-manipulation cursor-pointer ${zone.bgClass}`}
                style={{ borderColor: zone.borderHex }}
              >
                <span className="text-4xl" aria-hidden="true">
                  {zone.emoji}
                </span>
                <span className="text-2xl font-bold text-[#0F172A]">
                  {zone.label}
                </span>
                <span className="text-sm font-medium text-[#334155]">
                  {zone.feelings}
                </span>
              </button>
            ))}
          </div>
        </main>
      )}

      {editorOpen ? (
        <ParentalEditorModal
          config={config}
          onSave={handleSaveConfig}
          onClose={() => setEditorOpen(false)}
        />
      ) : null}
    </div>
  );
}
