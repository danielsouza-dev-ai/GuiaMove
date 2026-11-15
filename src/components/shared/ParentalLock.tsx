'use client';

import { Lock } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface ParentalLockProps {
  onUnlock: () => void;
  label?: string;
  holdMs?: number;
  className?: string;
}

export function ParentalLock({
  onUnlock,
  label = 'Área dos pais',
  holdMs = 2000,
  className = '',
}: ParentalLockProps) {
  const [holding, setHolding] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearHold = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setHolding(false);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handlePointerDown = () => {
    clearHold();
    setHolding(true);
    timerRef.current = setTimeout(() => {
      timerRef.current = null;
      setHolding(false);
      onUnlock();
    }, holdMs);
  };

  return (
    <button
      type="button"
      onPointerDown={handlePointerDown}
      onPointerUp={clearHold}
      onPointerCancel={clearHold}
      onPointerLeave={clearHold}
      onContextMenu={(e) => e.preventDefault()}
      aria-label={`${label} (segure por 2 segundos)`}
      className={`relative overflow-hidden inline-flex items-center gap-2 px-4 h-11 rounded-2xl border border-[#BAE6FD] bg-white text-[#0F172A] font-semibold text-sm select-none touch-none hover:bg-[#F0F9FF] transition ${className}`}
    >
      <span
        aria-hidden="true"
        className={`absolute inset-y-0 left-0 bg-[#BAE6FD]/60 transition-all ${
          holding ? 'w-full' : 'w-0'
        }`}
        style={{ transitionDuration: holding ? `${holdMs}ms` : '150ms' }}
      />
      <Lock className="w-4 h-4 text-[#0284C7] relative z-10" />
      <span className="relative z-10">
        {holding ? 'Segure...' : label}
      </span>
    </button>
  );
}
