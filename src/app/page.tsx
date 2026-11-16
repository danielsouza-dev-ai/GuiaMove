import Link from 'next/link';
import { ArrowRight, Clock, Thermometer } from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

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
          className="grid grid-cols-1 sm:grid-cols-2 gap-5"
        >
          <Link
            href="/temporizador"
            className="group rounded-3xl bg-white border-2 border-[#BAE6FD] hover:border-[#0284C7] hover:shadow-md p-6 flex flex-col justify-between gap-6 shadow-sm transition duration-150 ease-out active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="size-12 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <Clock className="size-6" aria-hidden="true" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F172A] text-balance">
                Temporizador Visual
              </h2>
              <p className="mt-1.5 text-sm text-[#475569] text-pretty">
                Contagem visual lúdica para ajudar nas transições sem briga com o relógio.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0284C7]">
              <span>Abrir temporizador</span>
              <ArrowRight
                className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </Link>

          <Link
            href="/termometro"
            className="group rounded-3xl bg-white border-2 border-[#BAE6FD] hover:border-[#0284C7] hover:shadow-md p-6 flex flex-col justify-between gap-6 shadow-sm transition duration-150 ease-out active:scale-[0.98]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="size-12 rounded-2xl bg-[#FEF3C7]/60 border border-[#FDE68A] flex items-center justify-center text-[#B45309]">
                <Thermometer className="size-6" aria-hidden="true" />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F172A] text-balance">
                Termômetro Sensorial
              </h2>
              <p className="mt-1.5 text-sm text-[#475569] text-pretty">
                Quatro zonas visuais para a criança mostrar como está e abrir a estratégia de calma em um toque.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0284C7]">
              <span>Abrir termômetro</span>
              <ArrowRight
                className="size-4 transition-transform duration-150 ease-out group-hover:translate-x-1"
                aria-hidden="true"
              />
            </div>
          </Link>
        </section>

        <section
          aria-label="Próximas ferramentas"
          className="rounded-2xl bg-white/75 border border-[#BAE6FD] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-sm text-[#475569]"
        >
          <span className="font-semibold text-[#0F172A]">Em desenvolvimento:</span>
          <span className="text-pretty">
            Sequenciamento Lógico do Dia e Rotinas Primeiro/Depois (ARASAAC)
          </span>
        </section>
      </main>

      <footer className="py-5 px-4 text-center text-xs text-[#475569] border-t border-[#BAE6FD]/60 bg-white/60">
        GuiaMove por <span className="font-semibold text-[#0F172A]">@dansouza.move</span> · Acadêmico de Fisioterapia, ABA e IA
      </footer>
    </div>
  );
}
