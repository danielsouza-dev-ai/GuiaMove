import Link from 'next/link';
import { Clock, ListChecks, Thermometer } from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

interface HubAppItem {
  id: string;
  href: string;
  name: string;
  shortLabel: string;
  iconBg: string;
  iconBorder: string;
  iconColor: string;
  customIconSrc?: string; // Ready for future custom SVG/PNG app icons
  Icon: typeof Clock;
}

const HUB_APPS: HubAppItem[] = [
  {
    id: 'temporizador',
    href: '/temporizador',
    name: 'Temporizador Visual',
    shortLabel: 'Tempo e transições',
    iconBg: 'bg-[#E0F2FE]',
    iconBorder: 'border-[#7DD3FC]',
    iconColor: 'text-[#0284C7]',
    Icon: Clock,
  },
  {
    id: 'termometro',
    href: '/termometro',
    name: 'Termômetro Sensorial',
    shortLabel: 'Emoções e calma',
    iconBg: 'bg-[#FEF3C7]',
    iconBorder: 'border-[#FCD34D]',
    iconColor: 'text-[#B45309]',
    Icon: Thermometer,
  },
  {
    id: 'rotinas',
    href: '/rotinas',
    name: 'Rotinas & Primeiro/Depois',
    shortLabel: 'Passo a passo visual',
    iconBg: 'bg-[#D1FAE5]',
    iconBorder: 'border-[#6EE7B7]',
    iconColor: 'text-[#047857]',
    Icon: ListChecks,
  },
];

export default function HomePage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader subtitle="Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 sm:py-10 flex flex-col gap-8">
        <section className="flex flex-col gap-2 max-w-2xl">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] leading-tight text-balance">
            Apoio prático para a rotina de casa e da clínica
          </h1>
          <p className="text-base text-[#475569] text-pretty">
            Ferramentas visuais diretas no navegador, sem cadastro e sem anúncios. Tudo fica salvo apenas no seu aparelho.
          </p>
        </section>

        <section
          aria-label="Ferramentas disponíveis"
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-5"
        >
          {HUB_APPS.map((app) => {
            const IconComponent = app.Icon;
            return (
              <Link
                key={app.id}
                href={app.href}
                className="group rounded-3xl bg-white border-2 border-b-4 border-[#BAE6FD] hover:border-[#0284C7] p-4 sm:p-6 flex flex-row sm:flex-col items-center justify-start sm:justify-center text-left sm:text-center gap-4 sm:gap-3.5 shadow-sm transition duration-150 ease-out active:translate-y-0.5 active:scale-[0.99] touch-manipulation"
              >
                <div
                  className={`size-16 sm:size-24 rounded-2xl sm:rounded-3xl border-2 ${app.iconBg} ${app.iconBorder} ${app.iconColor} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform duration-150 ease-out`}
                >
                  {app.customIconSrc ? (
                    <img
                      src={app.customIconSrc}
                      alt=""
                      className="size-11 sm:size-16 object-contain"
                    />
                  ) : (
                    <IconComponent
                      className="size-8 sm:size-11 stroke-[2.2]"
                      aria-hidden="true"
                    />
                  )}
                </div>

                <div className="flex flex-col gap-0.5 sm:gap-1 min-w-0">
                  <h2 className="text-base sm:text-lg font-bold text-[#0F172A] leading-snug text-balance">
                    {app.name}
                  </h2>
                  <span className="text-xs font-medium text-[#475569]">
                    {app.shortLabel}
                  </span>
                </div>
              </Link>
            );
          })}
        </section>

        <section
          aria-label="Próximas ferramentas"
          className="rounded-2xl bg-white/75 border border-[#BAE6FD] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-[#475569]"
        >
          <span className="font-semibold text-[#0F172A]">Em desenvolvimento:</span>
          <span className="text-pretty">Sequenciamento Lógico do Dia</span>
        </section>
      </main>

      <footer className="py-5 px-4 text-center text-xs text-[#475569] border-t border-[#BAE6FD]/60 bg-white/60">
        GuiaMove por <span className="font-semibold text-[#0F172A]">@dansouza.move</span> · Acadêmico de Fisioterapia, ABA e IA
      </footer>
    </div>
  );
}
