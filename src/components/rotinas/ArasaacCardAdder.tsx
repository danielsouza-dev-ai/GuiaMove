'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, Search } from 'lucide-react';
import {
  searchArasaacPictograms,
  type ArasaacSearchResult,
} from '@/lib/termometro/zones';
import type { RoutineCardItem } from '@/lib/rotinas/routinesConfig';

interface ArasaacCardAdderProps {
  onAddCard: (card: RoutineCardItem) => void;
  title?: string;
}

export function ArasaacCardAdder({
  onAddCard,
  title = 'Adicionar novo cartão com pictograma ARASAAC',
}: ArasaacCardAdderProps) {
  const [query, setQuery] = useState('');
  const [customLabel, setCustomLabel] = useState('');
  const [results, setResults] = useState<ArasaacSearchResult[]>([]);
  const [selectedItem, setSelectedItem] = useState<ArasaacSearchResult | null>(
    null,
  );
  const [searching, setSearching] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
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
    setErrorMsg(null);
    setSelectedItem(null);
    try {
      const items = await searchArasaacPictograms(clean, controller.signal);
      if (controller.signal.aborted) return;
      setResults(items);
      if (items.length === 0) {
        setErrorMsg('Nenhum pictograma encontrado para essa palavra.');
      }
    } catch {
      if (controller.signal.aborted) return;
      setErrorMsg('Não foi possível consultar a ARASAAC agora.');
    } finally {
      if (!controller.signal.aborted) setSearching(false);
    }
  };

  const handleConfirmAdd = () => {
    if (!selectedItem) return;
    const label = customLabel.trim() || selectedItem.label;
    onAddCard({
      id: `custom-${selectedItem.id}-${Date.now()}`,
      label,
      arasaacId: selectedItem.id,
    });
    setQuery('');
    setCustomLabel('');
    setResults([]);
    setSelectedItem(null);
  };

  return (
    <div className="rounded-2xl bg-[#F0F9FF]/70 border border-[#BAE6FD] p-4 flex flex-col gap-3">
      <span className="text-sm font-bold text-[#0F172A]">{title}</span>
      <div className="flex gap-2 min-w-0">
        <input
          type="search"
          aria-label="Buscar cartão na ARASAAC"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              handleSearch();
            }
          }}
          placeholder="Ex.: escovar, mochila, parque, suco..."
          className="flex-1 min-w-0 h-10 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A]"
        />
        <button
          type="button"
          onClick={handleSearch}
          disabled={searching || !query.trim()}
          className="inline-flex items-center gap-1.5 px-3.5 h-10 rounded-xl bg-[#0284C7] text-white text-xs font-bold disabled:opacity-50 cursor-pointer shrink-0"
        >
          <Search className="size-3.5" aria-hidden="true" />
          <span>{searching ? 'Buscando...' : 'Buscar'}</span>
        </button>
      </div>

      {errorMsg ? <p className="text-xs text-[#475569]">{errorMsg}</p> : null}

      {results.length > 0 ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
          {results.map((item) => {
            const isSelected = selectedItem?.id === item.id;
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => {
                  setSelectedItem(item);
                  setCustomLabel((prev) => prev || item.label);
                }}
                aria-label={`Escolher pictograma ${item.label}`}
                className={`flex flex-col items-center gap-1 p-1.5 rounded-xl border-2 bg-white cursor-pointer transition ${
                  isSelected
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

      {selectedItem ? (
        <div className="flex flex-col sm:flex-row gap-2 pt-1 min-w-0">
          <input
            type="text"
            aria-label="Nome do novo cartão"
            value={customLabel}
            onChange={(e) => setCustomLabel(e.target.value)}
            placeholder="Nome do cartão (ex.: Tomar suco)"
            className="flex-1 min-w-0 h-10 px-3 rounded-xl border border-[#BAE6FD] bg-white text-sm text-[#0F172A]"
          />
          <button
            type="button"
            onClick={handleConfirmAdd}
            className="inline-flex items-center justify-center gap-1.5 px-4 h-10 rounded-xl bg-[#F59E0B] text-[#0F172A] text-sm font-bold cursor-pointer shrink-0"
          >
            <Plus className="size-4" aria-hidden="true" />
            <span>Salvar no banco</span>
          </button>
        </div>
      ) : null}
    </div>
  );
}
