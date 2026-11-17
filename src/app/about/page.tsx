import type { Metadata } from 'next';
import Link from 'next/link';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

export const metadata: Metadata = {
  title: 'Sobre o GuiaMove — Ferramentas Visuais de Rotina e Autonomia',
  description:
    'Conheça o propósito, a base clínica (ABA, TEACCH, Zones of Regulation e ARASAAC) e a autoria do GuiaMove por Daniel Souza (@dansouza.move).',
  alternates: {
    canonical: 'https://guiamove.vercel.app/about',
  },
};

export default function AboutPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        backHref="/"
        subtitle="Ferramentas gratuitas de rotina, autonomia e movimento"
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        <article className="rounded-3xl bg-white border border-[#BAE6FD] p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] text-balance">
            Sobre o GuiaMove
          </h1>

          <p className="text-base text-[#334155] text-pretty">
            O GuiaMove é um portal web gratuito e instalável (PWA) criado por Daniel Souza (@dansouza.move), acadêmico de Fisioterapia, com o objetivo de oferecer ferramentas visuais práticas e acessíveis para famílias, escolas e clínicas que acompanham crianças autistas (TEA), com TDAH ou em desenvolvimento típico.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Fundamentos práticos e acessibilidade
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              Cada aplicativo do GuiaMove traduz estratégias amplamente utilizadas na prática clínica e educacional — como ensino estruturado (TEACCH), Análise do Comportamento Aplicada (ABA), autorregulação sensorial (Zones of Regulation) e Comunicação Aumentativa e Alternativa (CAA) com pictogramas ARASAAC — em interfaces limpas, com baixo ruído visual e uso imediato em celulares, tablets e computadores.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Ferramentas disponíveis gratuitamente
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              Atualmente o portal reúne três módulos integrados: o Temporizador Visual Infantil para transições previsíveis de 10 segundos a 60 minutos, o Termômetro Sensorial com estratégias de calma configuráveis pelos pais e busca ao vivo na ARASAAC, e o módulo de Rotinas Fixas e Quadro Primeiro/Depois com escolha controlada pela criança.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Compromisso sem cadastro e sem anúncios
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              O GuiaMove não exige criação de conta, não exibe publicidade e não envia fotos, perfis ou registros da criança para servidores externos. Tudo permanece salvo exclusivamente no navegador do seu aparelho.
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
