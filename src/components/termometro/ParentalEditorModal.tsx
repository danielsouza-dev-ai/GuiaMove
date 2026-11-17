'use client';

import { useEffect, useRef, useState } from 'react';
import { Search, X } from 'lucide-react';
import {
  ARASAAC_ICON_PATHS,
  ZONES,
  resolveStrategyIconSrc,
  searchArasaacPictograms,
  type ArasaacSearchResult,
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
  { id: 'butterfly_tapping', label: 'Abraço da Borboleta' },
  { id: 'twist_and_sway', label: 'Girar e Balançar' },
  { id: 'arm_swings', label: 'Balanço dos Braços' },
  { id: 'custom_text', label: 'Texto dos Pais' },
];

const ICON_OPTIONS: Array<{ id: StrategyIcon; label: string }> = [
  { id: 'abracar', label: 'Abraço' },
  { id: 'beber-agua', label: 'Água' },
  { id: 'fone', label: 'Fone' },
  { id: 'parar', label: 'Pausa' },
  { id: 'respirar', label: 'Respirar' },
  { id: 'borboleta', label: 'Borboleta' },
  { id: 'girar', label: 'Girar' },
  { id: 'levantar-bracos', label: 'Braços' },
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

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="parental-editor-title"
      className="fixed inset-0 z-50 bg-[#0F172A]/40 backdrop-blur-xs flex items-center justify-center p-4"
    >
      <div className="bg-white border-2 border-[#BAE6FD] rounded-3xl max-w-xl w-full p-6 flex flex-col gap-5 max-h-[90dvh] overflow-y-auto">
        <div className="flex items-center justify-between">
          <div>
            <h2 id="parental-editor-title" className="text-xl font-bold text-[#0F172A] text-balance">
              Configurar Estratégias
            </h2>
            <p className="text-xs text-[#475569] text-pretty">
              Escolha o que abre direto quando a criança toca em cada zona.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="size-10 rounded-xl bg-[#F0F9FF] flex items-center justify-center text-[#0F172A]"
          >
            <X className="size-5" aria-hidden="true" />
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
                  <ArasaacZonePicker
                    zoneLabel={zone.label}
                    current={current}
                    onChange={(patch) => updateZone(zone.id, patch)}
                  />
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

interface ArasaacZonePickerProps {
  zoneLabel: string;
  current: ZoneStrategyConfig;
  onChange: (patch: Partial<ZoneStrategyConfig>) => void;
}

function ArasaacZonePicker({ zoneLabel, current, onChange }: ArasaacZonePickerProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ArasaacSearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => abortRef.current?.abort();
  }, []);

  const handleSearch = async () => {
    const clean = query.trim();
    if (!clean) return;
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;

    setSearching(true);
    setSearchError(null);
    try {
      const items = await searchArasaacPictograms(clean, controller.signal);
      if (controller.signal.aborted) return;
      setResults(items);
      if (items.length === 0) {
        setSearchError('Nenhum pictograma encontrado para essa palavra.');
      }
    } catch {
      if (controller.signal.aborted) return;
      setSearchError(
        'Não foi possível buscar na ARASAAC agora. Você pode usar os ícones rápidos abaixo.',
      );
    } finally {
      if (!controller.signal.aborted) {
        setSearching(false);
      }
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-2">
        <div className="size-11 rounded-xl bg-white border border-[#BAE6FD] flex items-center justify-center p-1 shrink-0">
          <img
            src={resolveStrategyIconSrc(current)}
            alt=""
            width={34}
            height={34}
            className="object-contain"
          />
        </div>
        <input
          type="text"
          aria-label={`Texto personalizado da Zona ${zoneLabel}`}
          value={current.text ?? ''}
          onChange={(e) => onChange({ text: e.target.value })}
          placeholder="Ex.: Abraçar o urso e tomar 3 goles de água"
          className="flex-1 h-11 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A]"
        />
      </div>

      {/* Live ARASAAC API search */}
      <div className="flex flex-col gap-2 rounded-xl bg-white border border-[#BAE6FD] p-3">
        <span className="text-xs font-bold text-[#0F172A]">
          Buscar qualquer pictograma na ARASAAC
        </span>
        <div className="flex gap-2">
          <input
            type="search"
            aria-label={`Buscar pictograma ARASAAC para Zona ${zoneLabel}`}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault();
                handleSearch();
              }
            }}
            placeholder="Ex.: urso, bola, música, cobertor..."
            className="flex-1 h-10 px-3 rounded-xl border border-[#BAE6FD] bg-[#F0F9FF]/50 text-sm text-[#0F172A]"
          />
          <button
            type="button"
            onClick={handleSearch}
            disabled={searching || !query.trim()}
            className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-[#0284C7] text-white text-xs font-bold disabled:opacity-50 cursor-pointer"
          >
            <Search className="size-3.5" aria-hidden="true" />
            <span>{searching ? 'Buscando...' : 'Buscar'}</span>
          </button>
        </div>

        {searchError ? (
          <p className="text-xs text-[#475569]">{searchError}</p>
        ) : null}

        {results.length > 0 ? (
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 pt-1">
            {results.map((item) => {
              const selected = current.arasaacId === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onChange({ arasaacId: item.id })}
                  title={item.label}
                  aria-label={`Selecionar pictograma ${item.label}`}
                  className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 bg-white transition cursor-pointer ${
                    selected
                      ? 'border-[#F59E0B] bg-[#FEF3C7]/40'
                      : 'border-[#BAE6FD] hover:border-[#0284C7]'
                  }`}
                >
                  <img
                    src={item.src}
                    alt={item.label}
                    width={44}
                    height={44}
                    className="object-contain"
                  />
                  <span className="text-[10px] font-medium text-[#334155] truncate w-full text-center">
                    {item.label}
                  </span>
                </button>
              );
            })}
          </div>
        ) : null}
      </div>

      {/* Quick offline icons */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-semibold text-[#475569]">
          Ou escolha um ícone rápido (funciona offline):
        </span>
        <div className="flex flex-wrap gap-1.5">
          {ICON_OPTIONS.map((ic) => {
            const selected =
              !current.arasaacId && (current.icon ?? 'abracar') === ic.id;
            return (
              <button
                key={ic.id}
                type="button"
                onClick={() => onChange({ icon: ic.id, arasaacId: undefined })}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold border cursor-pointer ${
                  selected
                    ? 'bg-[#F59E0B] text-[#0F172A] border-[#F59E0B]'
                    : 'bg-white text-[#475569] border-[#BAE6FD]'
                }`}
              >
                <img
                  src={ARASAAC_ICON_PATHS[ic.id]}
                  alt=""
                  width={18}
                  height={18}
                  className="rounded-xs bg-white object-contain"
                />
                <span>{ic.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
