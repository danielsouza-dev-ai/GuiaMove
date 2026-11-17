import type { Metadata } from 'next';
import Link from 'next/link';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

export const metadata: Metadata = {
  title: 'Contato: GuiaMove (@dansouza.move)',
  description:
    'Canais oficiais de contato, suporte técnico, sugestões de melhorias e parcerias educacionais do GuiaMove.',
  alternates: {
    canonical: 'https://guiamove.vercel.app/contact',
  },
};

export default function ContactPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        backHref="/"
        subtitle="Canais oficiais de contato e suporte"
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        <article className="rounded-3xl bg-white border border-[#BAE6FD] p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] text-balance">
            Contato: GuiaMove
          </h1>

          <p className="text-base text-[#334155] text-pretty">
            O GuiaMove é mantido por Daniel Souza (@dansouza.move) para apoiar famílias, professores e terapeutas no uso diário de apoios visuais e regulação sensorial.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Canais oficiais de atendimento
            </h2>
            <ul className="list-disc pl-5 flex flex-col gap-2 text-base text-[#334155]">
              <li>
                <strong>E-mail de suporte e parcerias:</strong>{' '}
                <a
                  href="mailto:contato@guiamove.vercel.app"
                  className="text-[#0284C7] font-semibold underline"
                >
                  contato@guiamove.vercel.app
                </a>
              </li>
              <li>
                <strong>Instagram oficial:</strong>{' '}
                <a
                  href="https://www.instagram.com/dansouza.move/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#0284C7] font-semibold underline"
                >
                  @dansouza.move
                </a>
              </li>
              <li>
                <strong>Localização de referência:</strong> São Paulo, SP, Brasil.
              </li>
            </ul>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Como enviar sugestões ou relatar falhas
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              Se você encontrou alguma dificuldade no celular (iPhone ou Android), iPad ou computador, ou deseja sugerir novos pictogramas, movimentos calmantes ou modelos de rotina fixa, envie uma mensagem descrevendo o aparelho e a ferramenta utilizada (Temporizador Visual, Termômetro Sensorial ou Rotinas &amp; Primeiro/Depois).
            </p>
          </section>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl bg-[#0284C7] text-white font-bold text-sm hover:bg-[#0369A1]"
            >
              Voltar para a página inicial
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl border border-[#BAE6FD] bg-[#F0F9FF] text-[#0F172A] font-bold text-sm hover:bg-[#E0F2FE]"
            >
              Sobre o GuiaMove
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
