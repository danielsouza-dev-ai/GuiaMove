'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import type { ReactNode } from 'react';

interface GuiaMoveHeaderProps {
  title?: string;
  subtitle?: string;
  backHref?: string;
  rightSlot?: ReactNode;
}

export function GuiaMoveHeader({
  title,
  subtitle,
  backHref,
  rightSlot,
}: GuiaMoveHeaderProps) {
  return (
    <header className="w-full border-b border-[#BAE6FD] bg-white/95 backdrop-blur-sm sticky top-0 z-30">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          {backHref ? (
            <Link
              href={backHref}
              aria-label="Voltar"
              className="inline-flex items-center justify-center w-11 h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] hover:bg-[#E0F2FE] active:scale-95 transition shrink-0"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          ) : null}
          <div className="min-w-0">
            {title ? (
              <h1 className="text-base sm:text-xl font-bold text-[#0F172A] truncate">
                {title}
              </h1>
            ) : (
              <div className="flex items-baseline gap-1 font-bold text-xl sm:text-2xl tracking-tight">
                <span className="text-[#0F172A]">Guia</span>
                <span className="text-[#0284C7]">Move</span>
              </div>
            )}
            {subtitle ? (
              <p className="text-xs sm:text-sm text-[#475569] line-clamp-2 sm:truncate">
                {subtitle}
              </p>
            ) : null}
          </div>
        </div>
        {rightSlot ? <div className="shrink-0">{rightSlot}</div> : null}
      </div>
    </header>
  );
}
