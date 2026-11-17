import type { Metadata } from 'next';
import Link from 'next/link';
import { GuiaMoveHeader } from '@/components/shared/GuiaMoveHeader';

export const metadata: Metadata = {
  title: 'Política de Privacidade e LGPD — GuiaMove',
  description:
    'Saiba como o GuiaMove protege a privacidade infantil com armazenamento 100% local no dispositivo, sem login, anúncios ou envio de dados para a nuvem.',
  alternates: {
    canonical: 'https://guiamove.vercel.app/privacy',
  },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-dvh flex flex-col bg-[#F0F9FF]">
      <GuiaMoveHeader
        backHref="/"
        subtitle="Armazenamento exclusivamente local e respeito à LGPD"
      />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 py-8 flex flex-col gap-6">
        <article className="rounded-3xl bg-white border border-[#BAE6FD] p-6 sm:p-8 flex flex-col gap-5 shadow-xs">
          <h1 className="text-2xl sm:text-3xl font-bold text-[#0F172A] text-balance">
            Política de Privacidade e LGPD
          </h1>

          <p className="text-base text-[#334155] text-pretty">
            O GuiaMove foi projetado desde a arquitetura inicial com foco rigoroso na proteção de dados infantis e na conformidade com a Lei Geral de Proteção de Dados (LGPD). Nenhuma informação pessoal, fotografia, rotina ou registro emocional inserido nas ferramentas é enviado para servidores próprios ou bancos de dados na nuvem.
          </p>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Armazenamento 100% local no seu aparelho
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              Os perfis do Temporizador Visual (incluindo fotos recortadas localmente no navegador), as estratégias configuradas no Termômetro Sensorial e os cartões ou rotinas criadas no módulo Rotinas &amp; Primeiro/Depois são gravados apenas no IndexedDB e no localStorage do seu próprio dispositivo.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Ausência de rastreamento e integrações externas
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              O portal não exige login, não exibe anúncios e não utiliza cookies de rastreamento publicitário. Quando um responsável realiza uma busca por palavra-chave na API pública de pictogramas ARASAAC (licença CC BY-NC-SA 4.0), apenas o termo pesquisado do pictograma é consultado, sem envio de nome ou qualquer dado da criança.
            </p>
          </section>

          <section className="flex flex-col gap-2">
            <h2 className="text-xl font-bold text-[#0F172A]">
              Exclusão imediata e controle total
            </h2>
            <p className="text-base text-[#334155] text-pretty">
              Você pode apagar perfis, cartões personalizados e rotinas diretamente pela interface do aplicativo ou limpando os dados de armazenamento do site no navegador a qualquer momento.
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
              href="/contact"
              className="inline-flex items-center justify-center px-5 min-h-11 rounded-2xl border border-[#BAE6FD] bg-white text-[#0F172A] font-bold text-sm hover:bg-[#F0F9FF]"
            >
              Falar com o projeto
            </Link>
          </div>
        </article>
      </main>
    </div>
  );
}
