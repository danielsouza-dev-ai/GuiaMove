'use client';

import { Volume2, VolumeX } from 'lucide-react';

interface SoundToggleProps {
  muted: boolean;
  onToggle: () => void;
}

export function SoundToggle({ muted, onToggle }: SoundToggleProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={muted ? 'Ativar som' : 'Silenciar som'}
      className="inline-flex items-center gap-2 px-3.5 h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] font-semibold text-sm hover:bg-[#E0F2FE] active:scale-95 transition touch-manipulation"
    >
      {muted ? (
        <VolumeX className="w-5 h-5 text-[#64748B]" />
      ) : (
        <Volume2 className="w-5 h-5 text-[#0284C7]" />
      )}
      <span className="hidden sm:inline">{muted ? 'Mudo' : 'Som'}</span>
    </button>
  );
}
