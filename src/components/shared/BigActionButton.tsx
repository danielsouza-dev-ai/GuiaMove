'use client';

import type { ButtonHTMLAttributes, ReactNode } from 'react';

interface BigActionButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'amber' | 'outline';
}

const VARIANT_CLASSES: Record<NonNullable<BigActionButtonProps['variant']>, string> = {
  primary:
    'bg-[#0284C7] text-white hover:bg-[#0369A1] shadow-sm border border-[#0284C7]',
  amber:
    'bg-[#F59E0B] text-[#0F172A] hover:bg-[#D97706] shadow-sm border border-[#F59E0B]',
  outline:
    'bg-white text-[#0F172A] hover:bg-[#F0F9FF] border-2 border-[#BAE6FD]',
};

export function BigActionButton({
  children,
  variant = 'primary',
  className = '',
  ...props
}: BigActionButtonProps) {
  return (
    <button
      type="button"
      className={`min-h-[56px] px-6 py-3.5 rounded-2xl font-bold text-base sm:text-lg inline-flex items-center justify-center gap-2.5 active:scale-[0.98] transition touch-manipulation cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
