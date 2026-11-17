import type { Metadata } from 'next';
import Link from 'next/link';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

export const metadata: Metadata = {
  title: 'Sobre o GuiaMove: Ferramentas Visuais de Rotina e Autonomia',
  description:
    'Conheça o propósito, a base prática (ABA, TEACCH, Zones of Regulation e ARASAAC) e a autoria do GuiaMove por Daniel Souza (@dansouza.move).',
  alternates: {
    canonical: 'https://guiamove.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        backHref="/"
        subtitle="Ferramentas gratuitas de rotina e autonomia"
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        <article className="rounded-3xl bg-white border border-[#BAE6FD] p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] text-balance">
            Sobre o GuiaMove
          </h1>

          <p className="text-base text-[#334155] text-pretty">
            O GuiaMove é um portal web gratuito e instalável (PWA) criado por Daniel Souza (@dansouza.move), acadêmico de Fisioterapia, para reunir ferramentas visuais simples voltadas a famílias e profissionais que acompanham crianças autistas (TEA) ou com TDAH.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Base prática e acessibilidade
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              Cada aplicativo do GuiaMove adapta estratégias usadas na prática clínica e educacional (como ensino estruturado TEACCH, Análise do Comportamento Aplicada ABA, Zones of Regulation e Comunicação Aumentativa e Alternativa com pictogramas ARASAAC) para telas limpas, com pouco ruído visual e uso imediato no celular ou tablet.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Ferramentas disponíveis gratuitamente
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              O portal conta hoje com quatro ferramentas: o Temporizador Visual Infantil para transições de 10 segundos a 60 minutos, o Termômetro Sensorial com estratégias de calma e busca na ARASAAC, o módulo de Rotinas Fixas e Quadro Primeiro/Depois, e o Sequenciamento Lógico do Dia com desafios em 3 níveis.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Sem cadastro e sem anúncios
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              O site não pede criação de conta, não mostra publicidade e não envia fotos ou registros da criança para fora do seu aparelho. Tudo fica salvo apenas no navegador do dispositivo.
            </p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl bg-[#0284C7] text-white font-bold text-sm hover:bg-[#0369A1]"
            >
              Explorar ferramentas
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] font-bold text-sm hover:bg-[#E0F2FE]"
            >
              Falar com o projeto
            </Link>
            <Link
              href="/privacy"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl border border-[#BAE6FD] bg-white text-[#0F172A] font-bold text-sm hover:bg-[#F0F9FF]"
            >
              Privacidade e LGPD
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
