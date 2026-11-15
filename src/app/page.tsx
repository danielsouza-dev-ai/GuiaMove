import Link from 'next/link';
import { ArrowRight, Clock, Layers, Sparkles, Thermometer } from 'lucide-react';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader subtitle="Ferramentas gratuitas de rotina, autonomia e movimento por @dansouza.move" />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 py-8 flex flex-col gap-8">
        <section className="rounded-3xl bg-white border border-[#BAE6FD] p-6 sm:p-8 shadow-xs">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F0F9FF] border border-[#BAE6FD] text-xs font-semibold text-[#0284C7] mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>100% gratuito e direto no navegador</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] leading-tight">
            Apoio prático para a rotina de casa e da clínica
          </h1>
          <p className="mt-2 text-[#475569] text-base max-w-2xl">
            Sem cadastro, sem anúncios e sem envio de dados da criança para a nuvem. Tudo fica salvo apenas no seu aparelho.
          </p>
        </section>

        <section aria-label="Ferramentas disponíveis" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/temporizador"
            className="group rounded-3xl bg-white border-2 border-[#BAE6FD] hover:border-[#0284C7] p-6 flex flex-col justify-between gap-5 shadow-xs transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#0284C7]">
                <Clock className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold">
                Disponível
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Temporizador Visual</h2>
              <p className="mt-1.5 text-sm text-[#475569]">
                Contagem visual lúdica para ajudar nas transições sem briga com o relógio.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0284C7] group-hover:translate-x-1 transition">
              <span>Abrir temporizador</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>

          <Link
            href="/termometro"
            className="group rounded-3xl bg-white border-2 border-[#BAE6FD] hover:border-[#0284C7] p-6 flex flex-col justify-between gap-5 shadow-xs transition active:scale-[0.99]"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="w-14 h-14 rounded-2xl bg-[#F0F9FF] border border-[#BAE6FD] flex items-center justify-center text-[#F59E0B]">
                <Thermometer className="w-7 h-7" />
              </div>
              <span className="px-3 py-1 rounded-full bg-[#FEF3C7] text-[#92400E] text-xs font-bold">
                Disponível
              </span>
            </div>

            <div>
              <h2 className="text-xl font-bold text-[#0F172A]">Termômetro Sensorial</h2>
              <p className="mt-1.5 text-sm text-[#475569]">
                Quatro zonas visuais para a criança mostrar como está e abrir a estratégia de calma em um toque.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 text-sm font-bold text-[#0284C7] group-hover:translate-x-1 transition">
              <span>Abrir termômetro</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </Link>
        </section>

        <section aria-label="Próximas ondas" className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="rounded-3xl bg-white/70 border border-dashed border-[#BAE6FD] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#F0F9FF] flex items-center justify-center text-[#64748B] shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#0284C7]">Em breve · Onda 2</p>
              <p className="font-bold text-[#0F172A]">Sequenciamento Lógico do Dia</p>
            </div>
          </div>

          <div className="rounded-3xl bg-white/70 border border-dashed border-[#BAE6FD] p-5 flex items-center gap-4">
            <div className="w-11 h-11 rounded-2xl bg-[#F0F9FF] flex items-center justify-center text-[#64748B] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wide text-[#0284C7]">Em breve · Onda 3</p>
              <p className="font-bold text-[#0F172A]">Rotinas & Primeiro/Depois (ARASAAC)</p>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-5 text-center text-xs text-[#64748B] border-t border-[#BAE6FD]/60 bg-white/60">
        GuiaMove por <span className="font-semibold text-[#0F172A]">@dansouza.move</span> · Acadêmico de Fisioterapia, ABA e IA
      </footer>
    </div>
  );
}
